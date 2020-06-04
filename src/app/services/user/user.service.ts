import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';




@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private geolocation: Geolocation, private platform: Platform) {}

  public behaviorMyOwnPosition = new BehaviorSubject(null);
  private firstTimeCalling = true;
  private firstCall = true;
  private oldTimestamp;

 async getUserPosition(): Promise<any> {
    return new Promise<any>(resolve => {
    this.platform.ready().then(rdy => {
      const options = {
        enableHighAccuracy: true,
        timeout: 25000
      };
      this.geolocation.watchPosition(options).subscribe(x => {
        this.behaviorMyOwnPosition.next(x);
        this.firstTimeCalling = false;
        resolve();
      });
    });
    });
  }

  public saveRoute(newRoute:string){
    console.log("Route Saved Adress: "+newRoute);
  }

  public getfirstTimeCalling(){
    return this.firstTimeCalling;
  }
}
