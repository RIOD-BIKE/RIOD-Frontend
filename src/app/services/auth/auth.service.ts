import { Injectable, ErrorHandler } from '@angular/core';
import * as firebase from 'firebase';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFirestore, QuerySnapshot  } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Storage } from'@ionic/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database/database';
import { TemplateDefinitionBuilder } from '@angular/compiler/src/render3/view/template';
import { UsersDataFetchService } from '../users-data-fetch/users-data-fetch.service';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

const TOKEN_KEY='user-access-token';
export enum ThirdParties {
  Google,
  Twitter,
  Facebook
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private confirmationResult:firebase.auth.ConfirmationResult;
  private authState = new BehaviorSubject(null);
  private user:Observable<any>;
  private verificationId: string;

  constructor(private userDataFetch:UsersDataFetchService, public navCtrl:NavController, public alertCtrl:AlertController, 
    private db: AngularFirestore, private storage:Storage, private router: Router, private angularFireAuth: AngularFireAuth,
    private firebaseAuthentication: FirebaseAuthentication) 
    { 
      this.loadUser();
      this.user = this.authState.asObservable().pipe(filter(response => response));
  }

  loadUser(){
    this.storage.get(TOKEN_KEY).then(data =>{
      console.log("Loaded User: "+data);
      if(data){
        this.authState.next(data);
      } else{
        this.authState.next({role:null});
      }
    });
  }

  // getVerification(phoneNumberString:string,appVerifier:firebase.auth.RecaptchaVerifier):Promise<boolean>{
  //   return new Promise(resolve => {
  //    this.angularFireAuth.signInWithPhoneNumber(phoneNumberString, appVerifier)
  //     .then( async confirmationResult => {
  //       this.confirmationResult=confirmationResult;
  //       resolve(true);
  //     }).catch(function (error) {
  //       console.error("SMS not sent", error); 
  //       resolve(false);
  //   });
  // });
  // }
  // 
  // sendVerification(verifyNumber:number):Promise<any>{
  //   return new Promise(resolve => {
  //   this.confirmationResult.confirm(verifyNumber.toString()).then(x=>{
  //     console.log("Verified Code!");
  //     this.userDataFetch.rtdb_createUser(x.user.uid).then(y=>{
  //       console.log("RTDB Entry created!");
  //       this.userDataFetch.firestore_createUser(x.user.uid).then(z=>{
  //         if(z==true) {} //NEWLY Created Structure of Firestore for User
  //         if(z==false){} //NO NEW Structure of Firestore for User -> already exists
  //         console.log("Firestore Entry created!");
  //         this.signIn(x.user.uid).then(x=>{
  //           resolve(true);
  //         })
  //       });
  //     });
  //   }).catch(x=>{
  //     console.log(x);
  //     resolve(false);
  //   });
  // });
  // }

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
    await firebase.auth().signInWithRedirect(provider);
    const result = await firebase.auth().getRedirectResult();
    console.log(`${result.user.displayName} with UID ${result.user.uid} logged in!`);
    await this.userDataFetch.firestore_createUser(result.user.uid);
    await this.signIn(result.user.uid)
    await this.userDataFetch.firestore_setName(result.user.uid, result.user.displayName);
  }

  signIn(uid:string):Promise<any>{
    return new Promise(resolve => {
    let user=null;
    this.db.collection("users").doc(uid).valueChanges().subscribe(x=>{
      var isUser = Object(x)["isUser"];
      var isAdmin = Object(x)["isAdmin"];
      if(isUser==true && isAdmin !== true){
          user={role:'USER', uid:uid}
          console.log("isUser");
      }
      if(isAdmin==true && isUser !== true){
          user={role:'ADMIN',uid:uid}
          console.log("isAdmin");
      }
      this.authState.next(user);
      this.storage.set(TOKEN_KEY,user);
      resolve()
    });
  });
  }

  getUser(){return this.user;}

  getUserUID(){
    return this.user.pipe(take(1), map(user => {
      let uid = user['uid'];
      return uid;
    }))
  }

  async signout(){
    await this.storage.set(TOKEN_KEY,null);
    this.authState.next(null);
    this.router.navigate(['/sign-up-tab2']); // TODO: Alert SignOut
  }


}
