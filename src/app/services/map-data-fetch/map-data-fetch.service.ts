import { UserService } from './../user/user.service';
import { AngularFireDatabase } from '@angular/fire/database';
import {  RouteCl, GeoCluster, GeoAssemblyPoint } from '../../Classess/map/map';
import { Injectable } from '@angular/core';
import { Subscriber, Observable, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, DocumentSnapshot, DocumentData  } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})



export class MapDataFetchService {
  private positionAPs;
  private positionDBAPs: Array<GeoCluster>;
  private userFirestore: Observable<any>;

// Cluster Array and BehaviorSubject
  cluster: Array<GeoCluster>; clusterValueChange: BehaviorSubject<Array<GeoCluster>>;

// AssemblyPoint Array and BehaviorSubject
  aps: Array<GeoAssemblyPoint>; apsValueChange: BehaviorSubject<Array<GeoAssemblyPoint>>;

  readonly activeCluster: BehaviorSubject<any>;
  private activeClusterSubscription: Subscription;
  private activeClusterRef: DocumentReference;

  constructor(private db: AngularFirestore, private auth: AuthService, 
              private rtDB: AngularFireDatabase, private userService: UserService) {
    this.aps = new Array<GeoAssemblyPoint>();
    this.cluster = new Array<GeoCluster>();
    this.activeCluster = new BehaviorSubject<any>(null);
    this.initFirestoreObservables();
  }

  async initFirestoreObservables() {
    this.userFirestore = this.db.collection('users').doc(await this.auth.getCurrentUID()).valueChanges();

    // Init activeCluster Observable
    this.userFirestore.subscribe(async data => {
      if(this.activeClusterRef?.path === data.activeCluster?.path) return;
      if(data.activeCluster === null) {
        this.activeClusterRef = null;
        this.activeClusterSubscription.unsubscribe();
        this.activeCluster.next(null);
        return;
      }
      this.activeClusterRef = data.activeCluster;
      this.activeClusterSubscription = this.db.doc(data.activeCluster).valueChanges().subscribe(clusterData => {
        this.activeCluster.next(clusterData);
      });
    });
  }

//IMPORTANT -- IMPORTANT
  //------------          ------------//
    //Maximum of Clusters and Assembly Points set  --> == Get All Values != good --> To Many Reads!
    //Timeout for Calls must be implemented
    // Best: Observable --> ELSE if Values must be altered or read in Typescript -> Please change to BehaviorSubject
  //------------          ------------//

  // get All Clusters of User via Firestore

  retrieveClusters(): BehaviorSubject<Array<GeoCluster>> {
    //console.log(this.userFirestore);
    this.userFirestore.subscribe(data => {
      for (const path of data['clusters']) {
        const ref = this.db.doc(path);
        ref.get().toPromise().then(cData => {
          const c = cData.data();
          // console.log(c);
          this.cluster.push(new GeoCluster([c.coordinates.longitude, c.coordinates.latitude], [c.count]));
          this.clusterValueChange.next(this.cluster);
        });
      }
    });
    return this.clusterValueChange = new BehaviorSubject<Array<GeoCluster>>(this.cluster);
  }
  retrieveClusterObservable(): Observable<Array<GeoCluster>> {
    return this.clusterValueChange.asObservable();
  }


  // get All AssemblyPoints of User via Firestore
  retrieveAssemblyPoints(): BehaviorSubject<Array<GeoAssemblyPoint>> {
    this.userFirestore.subscribe(data => {
      this.aps = [];
      for (const path of data['assemblyPoints']) {
        const ref = this.db.doc(path);
        ref.get().toPromise().then(apData => {
          const ap = apData.data();
          this.aps.push(new GeoAssemblyPoint([ap.coordinates.longitude, ap.coordinates.latitude], 
                        '', 'marker_DAP', [ap.name], [ap.available]));
          this.apsValueChange.next(this.aps);
        });
      }
    });
    return this.apsValueChange = new BehaviorSubject<Array<GeoAssemblyPoint>>(this.aps);
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
  async sendUserPosition() {
    const uid = await this.auth.getCurrentUID();
    // note: is blocking until user moved!
    const position = await this.userService.getUserPosition();
    this.rtDB.object('users/' + uid).set({
      bearing: 0,
      latitude: position.position.latitude,
      longitude: position.position.longitude
    });
  }

}
