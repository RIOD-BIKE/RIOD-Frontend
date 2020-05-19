import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private geolocation: Geolocation, ) {}

  public behaviorMyOwnPosition = new BehaviorSubject(null);

  private firstCall = true;
  private oldTimestamp;




  showUserOnMap() {
    const options = { timeout: 10000, enableHighAccuracy: true, maximumAge: 10 };

    const watch = this.geolocation.watchPosition(options);

    watch.subscribe(myOwnPosition => {
      if (this.firstCall == true) {
        this.behaviorMyOwnPosition.next(myOwnPosition);
        this.oldTimestamp = this.behaviorMyOwnPosition.getValue();
        this.firstCall = false;
      }

      if (this.oldTimestamp.timestamp == myOwnPosition.timestamp) {
      } else {
        this.behaviorMyOwnPosition.next(myOwnPosition);
        this.oldTimestamp = myOwnPosition;
      }
    });

    return this.behaviorMyOwnPosition;
  }

  getOwnPosition(){
    return this.behaviorMyOwnPosition;
  }

}
