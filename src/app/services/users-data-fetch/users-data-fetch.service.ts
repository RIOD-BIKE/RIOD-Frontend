import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class UsersDataFetchService {
  private usersRef;
  constructor(private rtdb: AngularFireDatabase, private afs: AngularFirestore) {
  this.usersRef = rtdb.list('/users');
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
      // name: name
      name
    });
  }

  async firestore_getName(uid: string) {
    const user = (await this.afs.collection('users').doc(uid).ref.get()).data();
    console.log(user);
    // return user['name'] as string;
    return user.name as string;
  }
}
