import { PositionI, RoutingGeoAssemblyPoint } from './../../Classess/map/map';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';




@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private geolocation: Geolocation, private platform: Platform) { }

  public behaviorMyOwnPosition = new BehaviorSubject(null);
  private firstTimeCalling = true;


  async getUserPosition(): Promise<PositionI> {
    return new Promise<PositionI>(resolve => {
      this.platform.ready().then(rdy => {
        const options = {
          enableHighAccuracy: true,
          timeout: 25000
        };
        this.geolocation.watchPosition(options).subscribe(x => {
          this.behaviorMyOwnPosition.next(x);
          this.firstTimeCalling = false;
        });
        this.geolocation.getCurrentPosition().then((resp) => {
          resolve(new PositionI(resp.coords.longitude, resp.coords.latitude));
        });
      });
    });
  }

  public saveRoute(newRoute: string,points:RoutingGeoAssemblyPoint[]) {
    console.log("Route Saved Adress: " + newRoute);
    var temp="Points: ";
    points.forEach(x=>{
      temp+=x.name+", ";
    });
    console.log(temp);
  }

  public getfirstTimeCalling() {
    return this.firstTimeCalling;
  }
}
