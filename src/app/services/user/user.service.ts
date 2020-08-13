import { PositionI, RoutingGeoAssemblyPoint, iconShortcut } from './../../Classess/map/map';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as hash from 'hash.js';
import { UsersDataFetchService } from '../users-data-fetch/users-data-fetch.service';
import { MapDataFetchService } from '../map-data-fetch/map-data-fetch.service';
import { resolve } from 'url';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private userDataFetch: UsersDataFetchService, private storage: Storage, private geolocation: Geolocation, private platform: Platform) { }

  public behaviorMyOwnPosition = new BehaviorSubject(null);
  public behaviorFavorite: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(null);
  private firstTimeCalling = true;
  private hashedUID: string = null;
  private assemblyPointReference: any[] = [];
  public updateFavor: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  async getUserPosition(): Promise<PositionI> {
    return new Promise<PositionI>(resolve => {
      this.platform.ready().then(rdy => {
        const options = {
          enableHighAccuracy: true,
          timeout: 25000
        };
        if (this.firstTimeCalling === true) {
          this.firstTimeCalling = false;
          this.geolocation.watchPosition(options).subscribe(x => {
          this.behaviorMyOwnPosition.next(x);
        });
        }
        this.geolocation.getCurrentPosition().then((resp) => {
          resolve(new PositionI(resp.coords.longitude, resp.coords.latitude));
        });
      });
    });
  }

// TODO change plz to coords
// Uncomplete -> Dependend on new UI System
  public saveShortcut(address: any, iconName: any, plz: any): Promise<any> {
    return new Promise(resolve => {
      let i = 0;
      let j = 0;
      this.storage.length().then(length => {
        this.storage.forEach((value, key, index) => {
          const keySpliced = key.split('_');
          if (keySpliced[0] == 'SavedIcon') {
            j++;
            if (value.iconName === iconName) {  // iconName already saved -> override? Question
              this.storage.set(key, {address, plz, iconName});
              resolve('Updated Address with icon');
            }
          }
          i++;
          if (i == length) {
            this.storage.set('SavedIcon_' + j, {address, plz, iconName});
            resolve('New Address saved with icon');
          }
        });
      });
    });
  }

  // Delete Shortcut
  public deleteShortcut(icon: iconShortcut): Promise<any> {
    return new Promise(resolve => {
    this.storage.length().then(length => {
      this.storage.forEach((value, key, index) => {
        const keySpliced = key.split('_');
        if (keySpliced[0] === 'SavedIcon') {
          if (value.iconName === icon.iconName && value.address === icon.address &&
            value.plz[0] === icon.coords[0] && value.plz[1] === icon.coords[1]) {
            this.storage.remove(key);
            resolve();
          }
        }
      });
    });
    });
  }

  // Clear ShortcutList and set new one
  public setNewOrder(iconList: iconShortcut): Promise<any> {
    
  }

  public getAllShortcuts(): Promise<any> {
    return new Promise(resolve => {
      let i = 0;
      const tempArray: iconShortcut[] = [];
      this.storage.length().then(length => {
        this.storage.forEach((value, key, index) => {
          const keySpliced = key.split('_');
          if (keySpliced[0] === 'SavedIcon') {
              console.log(keySpliced);
              tempArray.push(new iconShortcut(value.iconName, i, value.address, value.plz));
          }
          i++;
          if (i == length) {
            resolve(tempArray);
          }
        });
      });
    });
  }



  public getfirstTimeCalling() {
    return this.firstTimeCalling;
  }

  setAssemblyPointReference(reference: any[]) {
    this.assemblyPointReference = reference;
    return;
  }


  public getDetailsToAP(AP: string, followingAP: string, caseSwitch: boolean, userTimestamp: any) {
    this.assemblyPointReference.forEach(ap => {
      if (ap.name == AP) {
        this.createHashedUID().then(x => {
          this.userDataFetch.rtdb_getDetailsAP(ap.reference, followingAP, caseSwitch, userTimestamp, x);
        });
      }
    });
  }

  public updateNextApTimingToRTDB(userTimestamp: number, duration: number, nextAps: string, followingAps: string, ) {
      this.createHashedUID().then(hash => {
        console.log(userTimestamp + '|' + duration + '|' + nextAps + '|' + followingAps + '|' + hash);
        this.assemblyPointReference.forEach(ap => {
          if (ap.name == nextAps) {

            this.userDataFetch.rtdb_sendNextAps(ap.reference, followingAps, hash.toString(), duration, userTimestamp);
          }
        });
      });
  }

  public deleteOldApTimingtoRTDB(nextAps: string, followingAps: string) {
    this.createHashedUID().then(hash => {
      this.assemblyPointReference.forEach(ap => {
        if (ap.name == nextAps) {
          console.log(ap.name + '|' + nextAps + '|' + followingAps + '|' + hash);
          this.userDataFetch.rtdb_deleteOldAps(ap.reference, followingAps, hash.toString());
        }
      });
    });
  }




  public createHashedUID(): Promise<any> {
    return new Promise(resolve => {
      if (this.hashedUID != null) {
        resolve(this.hashedUID.toString());
      } else {
      this.storage.get('user-access-token').then(value => {
        const uid: string = value.uid;
        this.hashString(uid).then(hash => {
          this.hashedUID = hash.slice(0, 13);
          resolve(this.hashedUID.toString());
        });
      });
      }
    });

  }

  hashString(str: string): Promise<any> {
    return new Promise(resolve => {
      const returnHash = hash.sha256().update(str).digest('hex');
      resolve(returnHash);
    });
  }



}
