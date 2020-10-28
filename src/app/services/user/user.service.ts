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
import { element } from 'protractor';
import { resolveSrv } from 'dns';



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


  //Nutzerposition nach Platform Ready [Geolocation] holen und an Aufrufer zurückgeben
  //BehaviorSubject mit neuer GPS aktualisieren
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
  //Shortcut einer Route mit Icon speichern, überschreiben, aktualisieren
  public saveShortcut(address: any, iconName: any, coords: any, iterator?: number): Promise<any> {
    return new Promise( resolve => {
      let updated = false;
      let i = 0;
      let j = 0;
      this.storage.length().then(length => {
        this.storage.forEach((value, key, index) => {
          const keySpliced = key.split('_');
          if (keySpliced[0] == 'SavedIcon') {
            j++;
            if (value.iconName === iconName) {  // iconName already saved -> override? Question
              this.storage.set(key, { address, coords, iconName });
              updated = true;
              resolve('Updated Address with icon');
            }
          }
          i++;

          if (iterator !== undefined) {
            if (updated === false) {
              this.storage.set('SavedIcon_' + iterator, { address, coords, iconName });
              resolve('New Address saved with icon');
            }
          } else {
            if (i === length && updated === false) {
              this.storage.set('SavedIcon_' + j++, { address, coords, iconName });
              resolve('New Address saved with icon');
            }
          }
        });
      });
    });
  }

  // Delete Shortcut
  //Shortcut löschen
  public deleteShortcut(icon: iconShortcut): Promise<any> {
    return new Promise(resolve => {
      this.storage.length().then(length => {
        this.storage.forEach((value, key, index) => {
          const keySpliced = key.split('_');
          if (keySpliced[0] === 'SavedIcon') {
            if (value.iconName === icon.iconName && value.address === icon.address) {
              this.storage.remove(key);
              resolve();
            }
          }
        });
      });
    });
  }

  //Alle Shortcuts löschen
  public deleteAllShortcuts(icon: iconShortcut[]): Promise<any> {
    let i = 0;
    return new Promise(resolve => {
      icon.forEach(element => {
        this.deleteShortcut(element).then(() => {
          i++;
          if (i === icon.length) {
            resolve();
          }
        });
      });

    });
  }

  //Alle Shortcuts holen
  public getAllShortcuts(): Promise<any> {
    return new Promise(resolve => {
      let i = 0;
      const tempArray: iconShortcut[] = [];
      this.storage.length().then(length => {
        this.storage.forEach((value, key, index) => {
          const keySpliced = key.split('_');
          if (keySpliced[0] === 'SavedIcon') {
            tempArray.push(new iconShortcut(value.iconName, i, value.address, value.coords));
          }
          i++;
          if (i == length - 1) {
            resolve(tempArray);
          }
        });
      });
    });
  }

//Alle Shortcuts [übergebene Liste] speichern
  public saveAllShortcuts(iconList: iconShortcut[]): Promise<any> {
    let k = 0;
    return new Promise(resolve => {
      this.getAllShortcuts().then(allShortcuts => {
        this.deleteAllShortcuts(allShortcuts).then(() => {
          for (let i = 0; i < iconList.length; i++) {
              this.saveShortcut(iconList[i].address, iconList[i].iconName, iconList[i].coords, i).then(() => {
                k++;
                if ( k === iconList.length) {
                  resolve(this.updateFavor.next(true));
                }
            });
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

//Alle Details zu AssemblyPoint holen
  public getDetailsToAP(AP: string, followingAP: string, caseSwitch: boolean, userTimestamp: any) {
    this.assemblyPointReference.forEach(ap => {
      if (ap.name == AP) {
        this.createHashedUID().then(x => {
          this.userDataFetch.rtdb_getDetailsAP(ap.reference, followingAP, caseSwitch, userTimestamp, x);
        });
      }
    });
  }
//Nächste Duration/Timestamp an RTDB übergeben
  public updateNextApTimingToRTDB(userTimestamp: number, duration: number, nextAps: string, followingAps: string,) {
    this.createHashedUID().then(hash => {
      console.log(userTimestamp + '|' + duration + '|' + nextAps + '|' + followingAps + '|' + hash);
      this.assemblyPointReference.forEach(ap => {
        if (ap.name == nextAps) {

          this.userDataFetch.rtdb_sendNextAps(ap.reference, followingAps, hash.toString(), duration, userTimestamp);
        }
      });
    });
  }
//Letzen/Alten Eintrag in RTDB löschen
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



//Hashed UID für RTDB erstellen
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
//Hash String-Helper Funktion
  hashString(str: string): Promise<any> {
    return new Promise(resolve => {
      const returnHash = hash.sha256().update(str).digest('hex');
      resolve(returnHash);
    });
  }



}
