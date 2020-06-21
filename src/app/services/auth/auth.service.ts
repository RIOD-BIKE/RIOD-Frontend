import { Injectable, ErrorHandler } from '@angular/core';
import * as firebase from 'firebase';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database/database';
import { TemplateDefinitionBuilder } from '@angular/compiler/src/render3/view/template';
import { UsersDataFetchService } from '../users-data-fetch/users-data-fetch.service';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

const TOKEN_KEY = 'user-access-token';
export enum ThirdParties {
  Google,
  Twitter,
  Facebook
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<{ role: string, uid: string }>(null);
  private verificationId: string;

  constructor(private userDataFetch: UsersDataFetchService, public navCtrl: NavController, public alertCtrl: AlertController,
    private db: AngularFirestore, private storage: Storage, private router: Router, private angularFireAuth: AngularFireAuth,
    private firebaseAuthentication: FirebaseAuthentication, private platform: Platform) {
    this.loadUser();
  }

  loadUser() {
    this.storage.get(TOKEN_KEY).then(data => {
      if (data) {
        console.log('Loaded User: ' + data.uid, data.role);
        this.authState.next(data);
      } else {
        console.log('No user loaded');
        this.authState.next({ role: null, uid: null });
      }
    });
  }

  async requestPhoneVerification(phone: string) {
    this.verificationId = await this.firebaseAuthentication.verifyPhoneNumber(phone, 0);
    console.log(`Requested phone verification for ${phone}. Got verificationId ${this.verificationId}`);
  }

  async checkVerficationCode(code: number) {
    this.firebaseAuthentication.onAuthStateChanged().subscribe(async (result) => {
      console.log(`UID ${result.uid} logged in!`);
      await this.userDataFetch.rtdb_createUser(result.uid);
      await this.userDataFetch.firestore_createUser(result.uid);
      await this.signIn(result.uid);
    });
    await this.firebaseAuthentication.signInWithVerificationId(this.verificationId, code.toString());
  }

  async handleAnonymousSignIn() {
    const result = await firebase.auth().signInAnonymously();
    console.log(`UID ${result.user.uid} logged in!`);
    await this.userDataFetch.firestore_createUser(result.user.uid);
    await this.signIn(result.user.uid);
  }

  async handleThirdPartySignIn(thirdParty: ThirdParties) {
    let provider: firebase.auth.AuthProvider;
    switch (thirdParty) {
      case ThirdParties.Google:
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      case ThirdParties.Facebook:
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      case ThirdParties.Twitter:
        provider = new firebase.auth.TwitterAuthProvider();
        break;
    }

    let result: firebase.auth.UserCredential;
    if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      result = await firebase.auth().signInWithPopup(provider);
    } else {
      await firebase.auth().signInWithRedirect(provider);
      result = await firebase.auth().getRedirectResult();
    }
    console.log(`${result.user.displayName} with UID ${result.user.uid} logged in!`);
    await this.userDataFetch.firestore_createUser(result.user.uid);
    await this.signIn(result.user.uid);
    await this.userDataFetch.firestore_setName(result.user.uid, result.user.displayName);
  }

  signIn(uid: string): Promise<any> {
    return new Promise(resolve => {
      let user = null;
      this.db.collection('users').doc(uid).valueChanges().subscribe(x => {
        const isUser = Object(x)['isUser'];
        const isAdmin = Object(x)['isAdmin'];
        if (isUser == true && isAdmin !== true) {
          user = { role: 'USER', uid: uid };
          console.log('isUser');
        }
        if (isAdmin == true && isUser !== true) {
          user = { role: 'ADMIN', uid: uid };
          console.log('isAdmin');
        }
        this.authState.next(user);
        this.storage.set(TOKEN_KEY, user);
        resolve();
      });
    });
  }

  getCurrentUser() {
    const currentValue = this.authState.getValue();
    // TODO: find out why authState yields null for the first time
    return currentValue || this.authState.pipe(take(2)).toPromise();
  }
  async getCurrentUID() {
    const currentUser = await this.getCurrentUser();
    return currentUser.uid;
  }
  async isLoggedIn() {
    const currentUser = await this.getCurrentUser();
    return currentUser.role !== null && currentUser.uid !== null;
  }

  async signout() {
    await this.storage.set(TOKEN_KEY, null);
    this.authState.next(null);
  }

  async deleteUser() {
    // TODO: Delete User from Firebase Authentication
  }

}
