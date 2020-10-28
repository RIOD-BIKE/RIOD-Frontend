import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { riodMembersAtAP } from 'src/app/Classess/map/map';


@Injectable({
  providedIn: 'root'
})
export class UsersDataFetchService {

  private specialAvatarCached: string;
  public  riodMembers: Array<riodMembersAtAP>; 
  public riodMembersValueChange:BehaviorSubject<riodMembersAtAP> = new BehaviorSubject<riodMembersAtAP>(null);
  private riodRef;
  private riodSubscribtion;

  constructor(private rtdb: AngularFireDatabase, private afs: AngularFirestore, private storage: Storage) {

    this.refreshCurrentSpecialAvatar();
  }

//Nächsten AssemblyPoint an RTDB senden
  async rtdb_sendNextAps(nextAps:string,followingAps:string,userHash:string,duration:number,userTimestamp:number){
    await this.rtdb.object('assemblyPoints/'+nextAps+"/"+followingAps+"/"+userHash).set({
      duration:duration,
      timestamp:userTimestamp
    });
  }
  //Alte AssemblyPoint von RTDB löschen
  async rtdb_deleteOldAps(oldAps:string,oldfollowingAps:string,userHash:string){
    await this.rtdb.object('assemblyPoints/'+oldAps+"/"+oldfollowingAps+"/"+userHash).remove();
  }
  //Letzen AssemblyPoint von RTDB löschen
  async rtdb_deleteLastAps(oldAps:string,oldfollowingAps:string,userHash:string){
    await this.rtdb.object('assemblyPoints/'+oldAps+"/"+oldfollowingAps+"/"+userHash).remove();
  }

  //Details zu AssemblyPoint von RealtimeDatabase holen ->Andere nutzereintragungen bezüglich Zeit/Timeout & co
  //Abfangen von abgelaufenen Einträgen von Nutzern
  async rtdb_getDetailsAP(AP:string,followingAp:string,caseSwitch:boolean,userTimestamp,userHash){
    let returnArray:riodMembersAtAP[]=[];
    if(caseSwitch==true){
      console.log('assemblyPoints/'+AP+"/"+followingAp);
      this.riodRef = this.rtdb.list('assemblyPoints/'+AP+"/"+followingAp);
      this.riodSubscribtion= this.riodRef.snapshotChanges().subscribe(items=>{
        this.riodMembers=[];
        returnArray=[];
        console.log(items);
        for(let i=0; i<items.length;i++){
         if(items[i].key!= "__DUMMY__" && items[i].payload.node_.children_.root_.value.value_!=undefined){
          console.log(items[i])
          let recalculateWriteDBTime =items[i].payload.node_.children_.root_.value.value_+(60000*items[i].payload.node_.children_.root_.left.value.value_)*2;
          console.log(recalculateWriteDBTime + "|"+userTimestamp)
          if(recalculateWriteDBTime>userTimestamp || items[i].payload.node_.children_.root_.left.value.value_ == 0){
            console.log("iF")
            if(items[i].key!=userHash){
            returnArray.push(new riodMembersAtAP(items[i].payload.node_.children_.root_.left.value.value_,items[i].payload.node_.children_.root_.value.value_));
            }
            if(items.length==i+1){

              this.riodMembers=returnArray;
              console.log(this.riodMembers)
              this.riodMembersValueChange.next(new riodMembersAtAP(items[i].payload.node_.children_.root_.left.value.value_,items[i].payload.node_.children_.root_.value.value_));
            }
          }
          if(items.length==i+1 && items[i].payload.node_.children_.root_.left.value.value_ != 0){
            this.riodMembers=returnArray;
            console.log(this.riodMembers)
            this.riodMembersValueChange.next(new riodMembersAtAP(items[i].payload.node_.children_.root_.left.value.value_,items[i].payload.node_.children_.root_.value.value_));
          }
        }
        }
      })
    } else{
      console.log("No buddys");
      this.riodMembers=[];
      this.riodMembersValueChange.next(new riodMembersAtAP("Last",""));
    }
  }

  //Unsubscribe to RTDB-AssemblyPoint-X
  async rtdb_getDetailsAP_unsub(){
    if(this.riodSubscribtion!=null){
      this.riodSubscribtion.unsubscribe();
      this.riodSubscribtion=null;
      console.log("RTDB_UNSUBSCRIBED");
    }
    this.riodRef=null;
 

  }
//RTDB Nutzer als Positionen anlegen
  async rtdb_createUser(uid: string) {
    await this.rtdb.object('users/' + uid).set({
      bearing: 0,
      latitude: 0,
      longitude: 0
    });
  }
//RTDB Nutzer löschen
  async rtdb_wipeUser(uid: string) {
    await this.rtdb.object('users/' + uid).remove();
  }
//Firestore Nutzer anlegen
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

  private async urlToBase64Blob(url: string) {
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

  private async refreshCurrentSpecialAvatar() {
    try {
      var metadata = await firebase.storage().ref('special-avatar.png').getMetadata();
    } catch(e) {
      if (e.code !== 'storage/object-not-found') {
        throw e;
      } else {
        await this.storage.set('special_avatar_hash', null);
        await this.storage.set('special_avatar', null);
        return;
      }
    }
    const hash = metadata.md5Hash;
    const currentHash = await this.storage.get('special_avatar_hash');
    if (hash !== currentHash) {
      const url = await firebase.storage().ref('special-avatar.png').getDownloadURL();
      const dataUrl = await this.urlToBase64Blob(url);
      await this.storage.set('special_avatar_hash', hash);
      await this.storage.set('special_avatar', dataUrl);
    }
  }

  async storage_getSpecialAvatar() {
    return await this.storage.get('special_avatar') ?? '../../../assets/settings/profile-pic.jpg';
  }
}
