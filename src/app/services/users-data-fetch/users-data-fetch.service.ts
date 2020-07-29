import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { resolve } from 'url';



@Injectable({
  providedIn: 'root'
})
export class UsersDataFetchService {
  private usersRef;
  private dataAPRef: BehaviorSubject<Array<string>>
  private specialAvatarCached: string;

  constructor(private rtdb: AngularFireDatabase, private afs: AngularFirestore) {
  this.usersRef = rtdb.list('/users');
  }


  async rtdb_sendNextAps(nextAps:string,followingAps:string,userHash:string,duration:number,userTimestamp:number){
    await this.rtdb.object('assemblyPoints/'+nextAps+"/"+followingAps+"/"+userHash).set({
      duration:duration,
      timestamp:userTimestamp
    });
  }
  async rtdb_deleteOldAps(oldAps:string,oldfollowingAps:string,userHash:string){
    await this.rtdb.object('assemblyPoints/'+oldAps+"/"+oldfollowingAps+"/"+userHash).remove();
  }
  async rtdb_getDetailsAP(AP:string,followingAp:string){
    //out

  }
  
  async rtdb_createUser(uid: string) {
    await this.rtdb.object('users/' + uid).set({
      bearing: 0,
      latitude: 0,
      longitude: 0
    });
  }

  async rtdb_wipeUser(uid: string) {
    await this.rtdb.object('users/' + uid).remove();
  }

  async firestore_createUser(uid: string) {
    const userExists = (await this.afs.collection('users').doc(uid).get().toPromise()).exists;
    if (userExists) {
      return false;
    }
    await this.afs.collection('users').doc(uid).set({
      activeCluster: null,
      assemblyPoints: [],
      clusters: [],
      isUser: true,
      name: ''
    });
    return true;
  }

  async firestore_wipeUser(uid: string) {
    await this.afs.collection('users').doc(uid).delete();
  }

  async firestore_setName(uid: string, name: string) {
    await this.afs.collection('users').doc(uid).update({
      name
    });
  }

  async firestore_getName(uid: string) {
    const user = (await this.afs.collection('users').doc(uid).ref.get()).data();
    return user.name as string;
  }

  async firestore_setContact(uid: string, contact: string) {
    await this.afs.collection('users').doc(uid).update({
      contact
    });
  }

  async firestore_getContact(uid: string) {
    const user = (await this.afs.collection('users').doc(uid).ref.get()).data();
    return user.contact as string;
  }

  private async storage_getSpecialAvatarURL() {
    try {
      return await firebase.storage().ref('special-avatar.png').getDownloadURL() as string;
    } catch (e) {
      if (e.code !== 'storage/object-not-found') {
        throw e;
      } else {
        return null;
      }
    }
  }

  private async storage_getSpecialAvatarHelper(): Promise<string> {
    const url = await this.storage_getSpecialAvatarURL();
    if(!url) {
      this.specialAvatarCached = '../../../assets/settings/profile-pic.jpg';
      return this.specialAvatarCached;
    }
    const blob = await (await fetch(url)).blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(blob);
      reader.onload = () => {
        this.specialAvatarCached = reader.result as string;
        return resolve(reader.result as string);
      }
    });
  }

  async storage_getSpecialAvatar() {
    return this.specialAvatarCached ?? await this.storage_getSpecialAvatarHelper();
  }
}
