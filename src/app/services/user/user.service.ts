import { PositionI, RoutingGeoAssemblyPoint, iconShortcut } from './../../Classess/map/map';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as hash from 'hash.js'
import { UsersDataFetchService } from '../users-data-fetch/users-data-fetch.service';
import { MapDataFetchService } from '../map-data-fetch/map-data-fetch.service';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private userDataFetch:UsersDataFetchService,private storage:Storage,private geolocation: Geolocation, private platform: Platform) { }

  public behaviorMyOwnPosition = new BehaviorSubject(null);
  private firstTimeCalling = true;
  private hashedUID:string=null;
  private assemblyPointReference:any[]=[];


  async getUserPosition(): Promise<PositionI> {
    return new Promise<PositionI>(resolve => {
      this.platform.ready().then(rdy => {
        const options = {
          enableHighAccuracy: true,
          timeout: 25000
        };
        if(this.firstTimeCalling==true){
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


//Uncomplete -> Dependend on new UI System
  public saveShortcut(address,iconName,routeName?):Promise<any> {
    return new Promise(resolve=>{
      var i=0;
      this.storage.length().then(length=>{
        this.storage.forEach((value,key,index)=>{
          let keySpliced = key.split('_');
          if(keySpliced[0] == "SavedIcon"){
            if(keySpliced[1]===iconName){  //iconName already saved -> override? Question
              this.storage.set(key,{address:address})
              resolve("Updated Address with icon");
              return;
            }
          }
          i++;
          if(i==length){
            this.storage.set("SavedIcon_"+iconName,{address:address});
            resolve("New Address saved with icon");
          }
        })
      })
    })
  }



  public getAllShortcuts():Promise<any>{
    return new Promise(resolve=>{
      var i=0;
      var tempArray:iconShortcut[]=[];
      this.storage.length().then(length=>{
        this.storage.forEach((value,key,index)=>{
          let keySpliced = key.split('_');
          if(keySpliced[0] == "SavedIcon"){
              tempArray.push(value);
          }
          i++;
          if(i==length ){
            resolve(tempArray);
          }
        });
      });
    });
  }



  public getfirstTimeCalling() {
    return this.firstTimeCalling;
  }

  setAssemblyPointReference(reference){
    this.assemblyPointReference=reference;
    return;
  }

  public updateNextApTimingToRTDB(userTimestamp:number,duration:number,nextAps:string,followingAps:string,){
      this.createHashedUID().then(hash=>{
        console.log(userTimestamp+"|"+duration+"|"+nextAps+"|"+followingAps+"|"+hash);
        this.assemblyPointReference.forEach(ap=>{
          if(ap.name == nextAps){    
            this.userDataFetch.rtdb_sendNextAps(ap.reference,followingAps,hash.toString(),duration,userTimestamp);
          }
        }) 
      })
  }

  public deleteOldApTimingtoRTDB(nextAps:string,followingAps:string){
    this.createHashedUID().then(hash=>{
      this.assemblyPointReference.forEach(ap=>{
        if(ap.name == nextAps){    
          console.log(ap.name+"|"+nextAps+"|"+followingAps+"|"+hash);
          this.userDataFetch.rtdb_deleteOldAps(ap.reference,followingAps,hash.toString());
        }
      }) 
    })
  }


  public createHashedUID():Promise<any>{
    return new Promise(resolve=>{
      if(this.hashedUID!=null){
        resolve(this.hashedUID.toString());
      }else{
      this.storage.get("user-access-token").then(value=>{
        let uid:string = value.uid;
        this.hashString(uid).then(hash=>{
          this.hashedUID=hash.slice(0,13);
          resolve(this.hashedUID.toString())
        })
      });
      }
    });

  }

  hashString(str):Promise<any>{
    return new Promise(resolve=>{
      var returnHash = hash.sha256().update(str).digest('hex');
      resolve(returnHash);
    });
  }



}
