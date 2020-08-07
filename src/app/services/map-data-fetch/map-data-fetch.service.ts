import { Status } from './../status-audio/status-audio.service';
import { UserService } from './../user/user.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { GeoCluster, GeoAssemblyPoint, AssemblyPointReference } from '../../Classess/map/map';
import { Injectable } from '@angular/core';
import { Subscriber, Observable, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, DocumentSnapshot, DocumentData  } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { ThrowStmt } from '@angular/compiler';
import { stat } from 'fs';

@Injectable({
  providedIn: 'root'
})



export class MapDataFetchService {
  private positionAPs;
  private positionDBAPs: Array<GeoCluster>;
  private userFirestore: Observable<any>;
  private assemblyPointReference:any[]=[];

// Cluster Array and BehaviorSubject
  cluster: Array<GeoCluster>; clusterValueChange: BehaviorSubject<Array<GeoCluster>>;

// AssemblyPoint Array and BehaviorSubject
  aps: Array<GeoAssemblyPoint>; apsValueChange: BehaviorSubject<Array<GeoAssemblyPoint>>;

  // readonly activeCluster: BehaviorSubject<any>; // not longer used
  readonly activeClusterStatus: BehaviorSubject<Status>;
  private activeClusterSubscription: Subscription;
  private activeClusterRef: DocumentReference;
  private lastClusterStatus: Status;

  constructor(private db: AngularFirestore, private auth: AuthService,
              private rtDB: AngularFireDatabase, private userService: UserService) {
    this.aps = new Array<GeoAssemblyPoint>();
    this.cluster = new Array<GeoCluster>();
    // this.activeCluster = new BehaviorSubject<any>(null);
    this.activeClusterStatus = new BehaviorSubject<Status>(null);
    this.initFirestoreObservables();
  }

  async initFirestoreObservables() {
    this.userFirestore = this.db.collection('users').doc(await this.auth.getCurrentUID()).valueChanges();

    // Init activeCluster Observable
    this.userFirestore.subscribe(async data => {
      if (this.activeClusterRef?.path === data.activeCluster?.path) { return; }
      if (data.activeCluster === null) {
        this.activeClusterRef = null;
        this.activeClusterSubscription.unsubscribe();
        // this.activeCluster.next(null);
        this.activeClusterStatus.next(Status.ALONE);
        this.lastClusterStatus = Status.ALONE;
        return;
      }
      this.activeClusterRef = data.activeCluster;
      this.activeClusterSubscription = this.db.doc(data.activeCluster).valueChanges().subscribe(clusterData => {
        // this.activeCluster.next(clusterData);
        const count = clusterData['count'];
        let status: Status;
        if (count >= 5 && count <= 15) {
          status = Status.GROUP;
        } else if (count > 15) {
          status = Status.ASSOCIATION;
        }
        if (status === this.lastClusterStatus) { return; }
        this.lastClusterStatus = status;
        this.activeClusterStatus.next(status);
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
    this.userFirestore.subscribe(data => {
      for (const path of data['clusters']) {
        const ref = this.db.doc(path);
        ref.get().toPromise().then(cData => {
          const c = cData.data();
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

  retrieveAssemblyPoints(): BehaviorSubject<Array<GeoAssemblyPoint>> {
    this.userFirestore.subscribe(data => {
      this.assemblyPointReference=[];
      this.aps = [];
      for (const path of data['assemblyPoints']) {
        const ref = this.db.doc(path);
        ref.get().toPromise().then(apData => {
          const ap = apData.data();
          this.aps.push(new GeoAssemblyPoint([ap.coordinates.longitude, ap.coordinates.latitude], 
                        '', 'marker_DAP', [ap.name], [ap.available]));
          this.assemblyPointReference.push(new AssemblyPointReference(ap.name,path.kc.path.segments[6]));
          this.apsValueChange.next(this.aps);
          
        });
      }
      this.userService.setAssemblyPointReference(this.assemblyPointReference);
    });
    
    return this.apsValueChange = new BehaviorSubject<Array<GeoAssemblyPoint>>(this.aps);
  }

  retrieveAssemblyPointsObservable(): Observable<Array<GeoAssemblyPoint>> {
    return this.apsValueChange.asObservable();
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
  async sendUserPosition(coords?) {
    const uid = await this.auth.getCurrentUID();
    // note: is blocking until user moved!
    let t
    
    if(coords){
       t=coords;
      this.rtDB.object('users/' + uid).set({
        bearing: 0,
        latitude: t.position.latitude,
        longitude: t.position.longitude
      });
    } else{
      t=this.userService.behaviorMyOwnPosition.value; 
      this.rtDB.object('users/' + uid).set({
        bearing: 0,
        latitude: t.coords.latitude,
        longitude: t.coords.longitude
      });
    }
    

  }

}
