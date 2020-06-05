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

  rtdb_createUser(uid: string): Promise<any> {
    return new Promise(resolve => {
      let userR;
      // TODO: CHECK IF USER STRUCTURE IN REALTIME DATABSE EXISTS
      userR = this.rtdb.object(`users/${uid}`).set({latitude: 0, longitude: 0, bearing: 0});
      resolve(userR);
    })
  }

  firestore_createUser(uid: string): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection('users').doc(uid).get().toPromise().then(qSnap => {
        if(!qSnap.exists){
        this.afs.collection('users').doc(uid).set({
          name: '',
          activeCluster: '',
          isUser: true
        }).then(y => {
          this.afs.collection('users').doc(uid).collection('clusters').doc('123456').set({
            coordinates: [8.038522, 52.276253],
            properties: [{name: 'CL1', count: 3, potMemberCount: 12}]
          }).then(x => {
            this.afs.collection('users').doc(uid).collection('assemblyPoints').doc('223456').set({
              coordinates:[8.038633, 52.276377],
              properties:[{name: 'Assembly-1', maxMember: 15, potMember: 8, direction: 'W'}]
            }).then(x => {
              console.log("back");
              resolve(true);
            });
          });
        });
        }
        resolve(false);
      });
    });
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
