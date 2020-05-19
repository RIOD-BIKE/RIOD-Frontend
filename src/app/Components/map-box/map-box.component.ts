import { environment } from './../../../environments/environment';
import { UserService } from '../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

import {Geolocation} from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss'],
})
export class MapBoxComponent implements OnInit {

  private map: mapboxgl.Map;
  private style = 'mapbox://styles/mapbox/outdoors-v10?optimize=true';

  private position = {
    latitude: 52.27264,
    longitude: 8.0498
  };

  constructor(private userservice: UserService) { }

  ngOnInit() {
   
  }
  public moveMapToCurrent(): boolean {
    console.log(navigator.geolocation);
    if (1) {
      this.userservice.behaviorMyOwnPosition.subscribe(myOwnPosition => {
          this.position.latitude = myOwnPosition.coords.latitude;
          this.position.longitude = myOwnPosition.coords.longitude;
        });
      this.map.flyTo({zoom: 15, center: [this.position.longitude, this.position.latitude]});
      return true;
    }
    return false;
  }

  public setupMap() {
    this.inizializeMap();
    setTimeout(() => this.map.resize(), 0);

  }
  private inizializeMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.position.latitude = position.coords.latitude;
        this.position.longitude = position.coords.longitude;
        this.map.jumpTo({center: [this.position.longitude, this.position.latitude]});
      });
    }
    this.buildMap();

  }


  buildMap() {
    console.log(this.position.longitude + ' ' + this.position.latitude);
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.position.longitude, this.position.latitude],
      accessToken: environment.mapbox.accessToken
    });
    this.map.addControl(new mapboxgl.NavigationControl());
  }
}
