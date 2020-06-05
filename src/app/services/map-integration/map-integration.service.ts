import { Position } from '../../Classess/map/map';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MapDataFetchService } from '../map-data-fetch/map-data-fetch.service';
import { Storage } from '@ionic/storage';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
const MAP_KEY = 'map-reload-token';

export interface MapboxOutput{
  attribution: string;
  features: Feature[];
  query: [];
}
export interface Feature {
  place_name: string;
  geometry: any;
}

@Injectable({
  providedIn: 'root'
})


export class MapIntegrationService {


  constructor(private storage: Storage, private http: HttpClient) {
    // (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    // if (!(mapboxgl as any).supported()) {
    //   alert('Not supported!');
    // }


  }

//return Marker for User - Return to MapBox-Component
  drawUserMarker() {

  }


  cacheMap(map: any) {
    console.log(map);
    //this.storage.set(MAP_KEY,map);
  }



  //generalised Method to draw Marker
  drawMarker(x: number, y: number) {
    return new mapboxgl.Marker().setLngLat([x,y]);
  }

  //return Marker for End and Start using getEndStartCoordinates() - Return to MapBox-Component
  drawEndStartMarker() {

  }


  //return Positions for End and Start Coordinates - API?
  getEndStartCoordinates() {

  }

  //return Route to MapBox-Component using getRouteMapBox()
  drawRoute() {

  }

  //Get MapBox route via Point A and C over Point B
  getRouteMapBox() {

  }


  searchAddress(query: string){
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http.get(url + query + '.json?types=address&access_token=' + environment.mapbox.accessToken)
      .pipe(map((res: MapboxOutput) => {
        console.log(res.query.values);
        return res.features;
    }));
  }
}
