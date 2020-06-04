import { MapDataFetchService } from './../../services/map-data-fetch/map-data-fetch.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapIntegrationService } from '../../services/map-integration/map-integration.service';
import { Position, PositionI, GeoCluster, ClusterCollection, AssemblyPointCollection, RoutingGeoAssemblyPoint } from '../../Classess/map/map';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UserService } from './../../services/user/user.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { resolve } from 'url';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
const MAP_KEY = 'map-reload-token';

@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss'],
})
export class MapBoxComponent implements OnInit {

  private map: mapboxgl.Map;
  private myPosition: PositionI = new PositionI(0, 0);

  private test = false;

  private clusterSource: any;
  public clusterMarkers: any;
  private firstTry: boolean = true;
  private assemblyPointSource: any;
  private assemblyPointMarkers: any;

  constructor(private routingUserService: RoutingUserService, private geolocation: Geolocation, private userservice: UserService,
    private mapIntegrationService: MapIntegrationService, private platform: Platform,
    private mapDataFetchService: MapDataFetchService, private storage: Storage) {
    this.init();
  }

  ngOnInit() { }

  init() {

  }

  public async setupMap() {
    try {
      // if (this.userservice.getfirstTimeCalling() == true) {
        await this.userservice.getUserPosition().then(y => {
          this.userservice.behaviorMyOwnPosition.subscribe(x => {
            this.myPosition = new PositionI(x.coords.longitude, x.coords.latitude);
          });
          this.inizializeMap();
          if (this.map) { setTimeout(() => this.map.resize(), 0); } // Buggy MapBox draw-fix
        });
      // } else {
      //   this.userservice.behaviorMyOwnPosition.subscribe(x => {
      //     this.myPosition = new PositionI(x.coords.longitude, x.coords.latitude);
      //   });
      //   this.inizializeMap();
      //   if (this.map) { setTimeout(() => this.map.resize(), 0); } // Buggy MapBox draw-fix
      // }
    } catch (e) { console.log(e); }
  }


  private pointFetch(): Promise<any> {
    return new Promise<any>(resolve => {
      this.mapDataFetchService.retrieveClusters().subscribe((value) => {
        console.log("CLUSTER" + value.entries);
        this.clusterMarkers = value;
        console.log(value);
        this.mapDataFetchService.clusterValueChange.subscribe(x => {
          if (this.firstTry === false) {
            // this.updateCluster(x);
          }
        })
      });
      this.mapDataFetchService.retrieveAssemblyPoints().subscribe((value) => {
        console.log("APS" + value.values);
        this.assemblyPointMarkers = value;
      });
      resolve();
    });
  }

  private async inizializeMap() {
    await this.buildMap().then(x => {
      this.pointFetch().then(() => {
        this.drawClusters();
        this.drawAssemblyPoints();
      });

    });
    this.drawUserPoint(this.map);
  }



  buildMap(): Promise<any> {
    return new Promise<any>(resolve => {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10?optimize=true',
        zoom: 13,
        center: [this.myPosition.position.longitude, this.myPosition.position.latitude],
        accessToken: environment.mapbox.accessToken
      });
      console.log('BuildMap');
      this.map.jumpTo({ center: [this.myPosition.position.longitude, this.myPosition.position.latitude] });
      resolve();
    });
  }


  public async moveMapToCurrent() {
    // try {
    //   this.myPosition = new PositionI(this.userservice.behaviorMyOwnPosition.value.coords.longitude, this.userservice.behaviorMyOwnPosition.value.coords.latitude);
    // } catch (e) { console.log(e); }

    await this.userservice.getUserPosition().then(y => {
      this.userservice.behaviorMyOwnPosition.subscribe(x => {
        this.myPosition = new PositionI(x.coords.longitude, x.coords.latitude);
      });
    });

    this.map.flyTo({ zoom: 15, center: [this.myPosition.position.longitude, this.myPosition.position.latitude] });

  }


  // User-Touch-Longpress Modal Overlay -> Routing
  touchLongpress() {

  }


  drawClusters() {
    this.map.on('load', (event) => {
      this.map.addSource('clusters', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      this.clusterSource = this.map.getSource('clusters');
      const data = new ClusterCollection(this.clusterMarkers);
      this.clusterSource.setData(data);

      data.features.forEach(x => { const el = document.createElement('div'); el.className = 'marker'; });

      this.map.addLayer({
        id: 'clusters',
        source: 'clusters',
        type: 'symbol',
        layout: {
          'visibility': 'visible',
          'icon-image': 'rocket-15',
          'icon-allow-overlap': true
        },
      });

    });
  }


  updateCluster(newMarkers) {
    console.log(newMarkers);
    console.log("UpdatedCluster");

    let source = <mapboxgl.GeoJSONSource>this.map.getSource("clusters");
    let data2 = new ClusterCollection(newMarkers);
    data2.features.forEach(x => { const el = document.createElement('div'); el.className = 'marker'; });

    source.setData(newMarkers[0]); // ONLY ONE MARKER UPDATES - FeatureCollection--->>
  }

  // draw all Clusters in perimeter
  drawAssemblyPoints() {
    this.map.on('load', (event) => {
      this.map.addSource('assemblyPoints', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // Should be Observable Calling -> FirebaseList
      this.assemblyPointSource = this.map.getSource('assemblyPoints');
      const data2 = new AssemblyPointCollection(this.assemblyPointMarkers);
      this.assemblyPointSource.setData(data2);

      data2.features.forEach(x => { const el = document.createElement('div'); el.className = 'marker'; });

      this.map.addLayer({
        id: 'assemblyPoints',
        source: 'assemblyPoints',
        type: 'symbol',
        layout: {
          'visibility': 'visible',
          'icon-image': 'bicycle-15',
          'icon-allow-overlap': true
        },
      });
    });
  }

  // draw User with Bearing
  drawUserPoint(paraMap: mapboxgl.Map) {
    console.log('draw');
    console.log(this.myPosition.position.longitude, this.myPosition.position.latitude);

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showAccuracyCircle: true,
      showUserLocation: true
    });

    this.map.addControl(geolocate);
    this.map.on('load', (event) => {
      geolocate.trigger();
    });

    geolocate.on('geolocate', (event) => {
      console.log(event);
    });






    // const marker = new mapboxgl.Marker().setLngLat([this.myPosition.position.longitude, this.myPosition.position.latitude]).addTo(this.map);

    // const geojson = {
    //   type: 'FeatureCollection',
    //   features: [{
    //     type: 'Feature',
    //     geometry: {
    //       type: 'Point',
    //       coordinates: {
    //         longi: this.myPosition.position.longitude,
    //         lati: this.myPosition.position.latitude
    //       }
    //     },
    //     properties: {
    //       title: 'Mapbox',
    //       description: 'MyLocation'
    //     }
    //   }]
    // };

    // // add markers to map
    // geojson.features.forEach(function (marker) {

    //   // create a HTML element for each feature
    //   const el = document.createElement('div');
    //   el.className = 'marker';

    // //   // make a marker for each feature and add to the map
    //   console.log('Drawmap');
    //   console.log(paraMap);

    //   new mapboxgl.Marker(el)
    //     .setLngLat([marker.geometry.coordinates.longi, marker.geometry.coordinates.lati])
    //     .addTo(paraMap);
    // });
    // this.map = paraMap;
  }


  drawFinishMarker() { }

  drawStartMarker() { }

  deleteAllLayers() { }

  //Draw Feature AssemblyPoints with Clickable Touch interface to Select one AP
  drawChooseAssemblyPoints() {

    if (this.map.loaded() === true) { }

    this.map.addSource('clickable', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });

    this.assemblyPointSource = this.map.getSource('clickable');
    const data2 = new AssemblyPointCollection(this.assemblyPointMarkers);
    this.assemblyPointSource.setData(data2);

    data2.features.forEach(x => { const el = document.createElement('div'); el.className = 'marker'; });
    this.map.addLayer({
      id: 'clickable',
      source: 'clickable',
      type: 'symbol',
      layout: {
        'visibility': 'visible',
        'icon-image': 'beach-15',
        'icon-size': 2,
        'icon-allow-overlap': true
      },
    });

    let centerPoint: RoutingGeoAssemblyPoint;

    this.map.on('click', 'clickable', e => {
      let l = e.features[0].properties.latitude;
      let s = e.features[0].properties.longitude;
      let n = e.features[0].properties.name;
      let temp = [l, s, n]
      centerPoint = new RoutingGeoAssemblyPoint(s, l, n);
      this.routingUserService.addAssemblyPoint(centerPoint);
      this.toggleAssemblyPointLayerVisibility();
    });
  }

  toggleAssemblyPointLayerVisibility() {
    var visibility = this.map.getLayoutProperty('assemblyPoints', 'visibility');
    if (visibility === 'visible') {
      console.log("APs hidden");
      if (this.firstTry === true) {
        this.drawChooseAssemblyPoints();
        this.firstTry = false;
      } else {
        this.map.setLayoutProperty('clickable', 'visibility', 'visible');
      }
      this.map.setLayoutProperty('assemblyPoints', 'visibility', 'none');
    } else {
      console.log("Aps showing");
      this.map.setLayoutProperty('clickable', 'visibility', 'none');
      this.map.setLayoutProperty('assemblyPoints', 'visibility', 'visible');
    }
  }
}
