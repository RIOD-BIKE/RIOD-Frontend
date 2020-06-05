
import {  RouteCl, GeoCluster, GeoAssemblyPoint } from '../../Classess/map/map';
import { Injectable } from '@angular/core';
import { Subscriber, Observable, BehaviorSubject, Subject } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})



export class MapDataFetchService {
  private positionAPs;
  private positionDBAPs: Array<GeoCluster>;

// Cluster Array and BehaviorSubject
  cluster: Array<GeoCluster>; clusterValueChange: BehaviorSubject<Array<GeoCluster>>;

// AssemblyPoint Array and BehaviorSubject
  aps: Array<GeoAssemblyPoint>; apsValueChange: BehaviorSubject<Array<GeoAssemblyPoint>>;




  constructor(private db: AngularFirestore, private auth: AuthService) {
   this.aps = new Array<GeoAssemblyPoint>();
   this.cluster = new Array<GeoCluster>();
   }

  // sets Status if User is in Cluster - via Firestore
  getUserClusterStatus() {

  }



//IMPORTANT -- IMPORTANT
  //------------          ------------//
    //Maximum of Clusters and Assembly Points set  --> == Get All Values != good --> To Many Reads!
    //Timeout for Calls must be implemented
    // Best: Observable --> ELSE if Values must be altered or read in Typescript -> Please change to BehaviorSubject
  //------------          ------------//

  // get All Clusters of User via Firestore

  retrieveClusters(): BehaviorSubject<Array<GeoCluster>> {
    this.auth.getUserUID().toPromise().then(uid => {
      console.log(uid);
      const clusterCollection = this.db.collection('users').doc(uid).collection('clusters'); 
      clusterCollection.valueChanges().subscribe(data => {
        data.forEach(x => {
          console.log(this.clusterValueChange);
          this.cluster.push(new GeoCluster(x.coordinates, x.properties)); });
        console.log("Firestore new Cluster Values"+this.cluster);
        return this.clusterValueChange.next(this.cluster);
          });
     });
    return this.clusterValueChange = new BehaviorSubject<Array<GeoCluster>>(this.cluster);
  }
  retrieveClusterObservable(): Observable<Array<GeoCluster>> {
    return this.clusterValueChange.asObservable();
  }


  // get All AssemblyPoints of User via Firestore
  retrieveAssemblyPoints():BehaviorSubject<Array<GeoAssemblyPoint>> {
    this.auth.getUserUID().toPromise().then(uid => {
      console.log(uid);
      const apCollection = this.db.collection('users').doc(uid).collection('assemblyPoints');
      apCollection.valueChanges().subscribe(data => {
        data.forEach(x => {
          console.log(x.properties);
          this.aps.push(new GeoAssemblyPoint(x.coordinates,x.properties));
        });
        console.log('Firestore new Assembly Values' + this.aps);
        return this.apsValueChange.next(this.aps);
   });
  });
    return this.apsValueChange = new BehaviorSubject<Array<GeoAssemblyPoint>>(this.aps);
}


  // get Recent Routes Ionic Storage
  getUserRecentRoutes() {
  //demo Value Creation Routes //Json Points or Simple Coordinates?
  let recentRoutes: Array<RouteCl> = [new RouteCl(52.274557, 8.047160, 'First Route'),
  new RouteCl(52.274557, 8.047160, 'Second Route'), new RouteCl(52.274557, 8.047160, 'Third Route'),
  new RouteCl(52.274557, 8.047160, '4 Route'), new RouteCl(52.274557, 8.047160, 'Fifth Route')];
  }




  // get, set & update User Settings of User via Firestore
  getUserSettings() {


  }

  // initialization of User -> After that only Update (you know why, when implementing)
  setUserSettings() {

  }

  // update Settings  ->  Try to imperativ update selected Values -> Not all values most be accessed in the DB (Expensive when updating all values)
  updateUserSettings() {

  }

  // send UserPosition to Firebase RealTime DB
  sendUserPosition() {

  }

}
