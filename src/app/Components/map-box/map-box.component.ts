import { MapDataFetchService } from './../../services/map-data-fetch/map-data-fetch.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapIntegrationService } from '../../services/map-integration/map-integration.service';
import { Position, PositionI, GeoCluster, ClusterCollection, AssemblyPointCollection, RoutingGeoAssemblyPoint, PointMarker, GeoPointMarker } from '../../Classess/map/map';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UserService } from './../../services/user/user.service';
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

  private clusterSource: any;
  public clusterMarkers: any;
  private firstTry = true;
  private assemblyPointSource: any;
  private assemblyPointMarkers: any;
  private finishPointSource: any;
  private finishPointMarker: any;
  private startingPointSource: any;
  private startingPointMarker: any;
  private coords:any;

  constructor(private routingUserService: RoutingUserService, private geolocation: Geolocation, private userservice: UserService,
    private mapIntegrationService: MapIntegrationService, private mapDataFetchService: MapDataFetchService,
    private storage: Storage) {
    this.init();
  }

  ngOnInit() { }

  init() {

  }

  public async setupMap() {
    try {
      // if (this.userservice.getfirstTimeCalling() == true) {
      // await this.userservice.getUserPosition().then(y => {
      //   this.userservice.behaviorMyOwnPosition.subscribe(x => {
      //     this.myPosition = new PositionI(x.coords.longitude, x.coords.latitude);
      //   });
      //   this.inizializeMap();
      //   if (this.map) { setTimeout(() => this.map.resize(), 0); } // Buggy MapBox draw-fix
      // });
      // } else {
      //   this.userservice.behaviorMyOwnPosition.subscribe(x => {
      //     this.myPosition = new PositionI(x.coords.longitude, x.coords.latitude);
      //   });
      //   this.inizializeMap();
      //   if (this.map) { setTimeout(() => this.map.resize(), 0); } // Buggy MapBox draw-fix
      // }
      this.myPosition = await this.userservice.getUserPosition();
    } catch (e) {
      console.log(e);
    }
    this.inizializeMap();
    setTimeout(() => this.map.resize(), 0);
  }


  private pointFetch(): Promise<any> {
    return new Promise<any>(resolve => {
      this.mapDataFetchService.retrieveClusters().subscribe((value) => {
        console.log('CLUSTER' + value.entries);
        this.clusterMarkers = value;
        console.log(value);
        this.mapDataFetchService.clusterValueChange.subscribe(x => {
          if (this.firstTry === false) {
            // this.updateCluster(x);
          }
        })
      });
      this.mapDataFetchService.retrieveAssemblyPoints().subscribe((value) => {
        // console.log("APS" + value.values);
        this.assemblyPointMarkers = value;
      });
      resolve();
    });
  }

  private async inizializeMap() {
    await this.buildMap().then(x => {
      // setTimeout(() => {
      this.pointFetch().then(() => {

          this.drawClusters();
          this.drawAssemblyPoints();
        });
      // }, 5000);
      this.drawUserPoint();
    });
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
      // console.log('BuildMap');
      this.map.jumpTo({ center: [this.myPosition.position.longitude, this.myPosition.position.latitude] });
      resolve();
    });
  }


  public async moveMapToCurrent() {

    // await this.userservice.getUserPosition().then(y => {
    //   this.userservice.behaviorMyOwnPosition.subscribe(x => {
    //     this.myPosition = new PositionI(x.coords.longitude, x.coords.latitude);
    //   });
    // });

    try {
      let temp = await this.userservice.behaviorMyOwnPosition.getValue().coords;
    } catch (e) {
      console.log(e);
    }
    this.map.flyTo({ zoom: 15, center: [this.myPosition.position.longitude, this.myPosition.position.latitude] });
  }


  // User-Touch-Longpress Modal Overlay -> Routing
  touchLongpress() {

  }


  drawClusters() {
    this.map.on('load', (event) => {
      this.map.addSource('clusters', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
      setTimeout(() => {
        this.clusterSource = this.map.getSource('clusters');
        const data = new ClusterCollection(this.clusterMarkers);
        this.clusterSource.setData(data);

        data.features.forEach(x => {
          const el = document.createElement('div');
          el.className = 'marker';
        });

        this.map.addLayer({
          id: 'clusters',
          source: 'clusters',
          type: 'symbol',
          layout: {
            visibility: 'visible',
            'icon-image': 'rocket-15',
            'icon-allow-overlap': true
          },
        });
      }, 2000);
    });
  }



  updateCluster(newMarkers) {
    // console.log(newMarkers);
    // console.log('UpdatedCluster');

    const source = this.map.getSource('clusters') as mapboxgl.GeoJSONSource;
    const data2 = new ClusterCollection(newMarkers);
    data2.features.forEach(x => {
      const el = document.createElement('div');
      el.className = 'marker';
    });

    source.setData(newMarkers[0]); // ONLY ONE MARKER UPDATES - FeatureCollection--->>
  }

  // draw all Clusters in perimeter
  drawAssemblyPoints() {
    this.map.on('load', (event) => {
      this.map.addSource('assemblyPoints', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
      setTimeout(() => {
        // Should be Observable Calling -> FirebaseList
        this.assemblyPointSource = this.map.getSource('assemblyPoints');
        const data2 = new AssemblyPointCollection(this.assemblyPointMarkers);
        this.assemblyPointSource.setData(data2);

        data2.features.forEach(x => {
          const el = document.createElement('div');
          el.className = 'marker';
        });

        this.map.addLayer({
          id: 'assemblyPoints',
          source: 'assemblyPoints',
          type: 'symbol',
          layout: {
            // 'visibility': 'visible',
            visibility: 'visible',
            'icon-image': 'bicycle-15',
            'icon-allow-overlap': true
          },
        });
      }, 2000);
    });
  }

  // draw User with Bearing
  drawUserPoint() {
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
  }


  drawChooseAssemblyPoints() {
    if (this.map.loaded() === true) { }
    this.map.addSource('clickable', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
    this.assemblyPointSource = this.map.getSource('clickable');
    const data2 = new AssemblyPointCollection(this.assemblyPointMarkers);
    console.log(data2);
    this.assemblyPointSource.setData(data2);
    console.log(data2);
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



  async drawRoute(pointString):Promise<any> {
    return new Promise(resolve => {
    this.routingUserService.getstartPoint().then(y=>{
    this.routingUserService.getfinishPoint().then(x=>{
      var start=y[0]; //StartCoords
      var end=x[0]; //FinishCoords
      var completeDirectionString = start[0] + ',' + start[1] + ';'+pointString + end[0] + ',' + end[1];
      console.log(completeDirectionString);
      var url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + 
      completeDirectionString+
      '?steps=true&geometries=geojson&access_token=' + environment.mapbox.accessToken.toString();
      console.log(url);
      if(this.map.loaded()){

        this.drawRouteHelpMethod(url,this.drawRouteFunctionMap,this.map,this.drawStartMarker,this.drawFinishMarker,this.routingUserService).then(()=>{resolve();})
      }

    });
  });
});
  }

 

  drawRouteHelpMethod(url, cFunction,map,start,finish,routing):Promise<any>{
    return new Promise(resolve => {

    //XMLHttpRequest is a bitch  
    var xhttp = new XMLHttpRequest();
    xhttp.responseType = 'json';
    xhttp.open("GET",url,true);
    xhttp.onreadystatechange = function() {
    xhttp.onload=function(){
      var jsonResponse = xhttp.response;
      var distance = jsonResponse.routes[0].distance*0.001; // Convert to KM
      var duration = jsonResponse.routes[0].duration/60;  // Convert to Minutes
      var coords = jsonResponse.routes[0].geometry;
      var routeCoords={coordinates:[],type:"LineString"}
      jsonResponse.routes[0].legs.forEach(element=>{
        element.steps.forEach(step=>{
          step.geometry.coordinates.forEach(coordinate=>{
            routeCoords.coordinates.push(coordinate);
          })
        })
      });
      console.log(routeCoords);
      console.log(coords);
        if ((xhttp.readyState ===4) && (xhttp.status===200)) {
        routing.setDuration(duration);  //Set Duration Value
        routing.setDistance(distance);  //Set Distance Value

        // For printing Start-/FinishMarker
        var first = coords.coordinates[0]; //First GeoLine Point
        var last = coords.coordinates[coords.coordinates.length-1]; //Last GeoLine Point
        
       
        cFunction(routeCoords,map); //Übergabe von drawRouteFunctionMap() Function
        start(first,map); //Übergabe von drawStartMarker() Function
        finish(last,map); //Übergabe von drawFinishMarker() Function
        resolve();

      }
    };
  }
    xhttp.send();
    
});
  }

  drawRouteFunctionMap(coords,map){

    //check and delete if Layer exists
    if(map.getLayer("route")!=undefined){
      map.removeLayer("route");
      map.removeSource("routeSource");
      console.log("removed.......");

    }

    map.addSource('routeSource', {type: 'geojson',data: { type: 'Feature', properties: {},geometry: coords }});

      map.addLayer({
          id: "route",
          type: "line",
          source:"routeSource",
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#3b9ddd",
            "line-width": 8,
            "line-opacity": 0.8
          }
        });

        //Move Route Layer infront of APs and Cluster
        map.moveLayer("route","assemblyPoints");
        map.moveLayer("route","clusters");

  };



drawFinishMarker(finishPoint,map) { 

  if(map.getLayer("finishMarker")!=undefined){
    //map.removeLayer("finishMarker");
   // map.removeSource("finishMarker");
    console.log("FinishMarker exists");

  }
    console.log("FinishPoint: "+finishPoint);
    map.addSource('finishMarker', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
    let finishPointSource;
    finishPointSource= map.getSource('finishMarker') as mapboxgl.GeoJSONSource;
    const finishPointdata = new PointMarker(Array(new GeoPointMarker(finishPoint[0])));
    console.log(finishPointdata);
    finishPointdata.features.forEach(x => { const el = document.createElement('div'); el.className = 'marker'; });
  
    finishPointSource.setData(finishPointdata);

    map.addLayer({
      id: 'finishMarker',
      source: 'finishMarker',
      type: 'symbol',
      layout: {
        'visibility': 'visible',
        'icon-image': 'marker-15',
        'icon-size': 2,
        'icon-allow-overlap': true
      },
    });

}

drawStartMarker(startPoint,map) { 

  if(map.getLayer("startMarker")!=undefined){
    //map.removeLayer("startMarker");
   // map.removeSource("startMarker");
    console.log("StartMarker exists");

  }
  console.log("Startpoint"+startPoint);
   
    map.addSource('startMarker', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
    let startingPointSource;
    startingPointSource= map.getSource('startMarker') as mapboxgl.GeoJSONSource;
    const startPointData = new PointMarker(Array(new GeoPointMarker(startPoint[0])));
    console.log(startPointData);
    startPointData.features.forEach(x => { const el = document.createElement('div'); el.className = 'marker'; });
  
    startingPointSource.setData(startPointData);

    map.addLayer({
      id: 'startMarker',
      source: 'startMarker',
      type: 'symbol',
      layout: {
        'visibility': 'visible',
        'icon-image': 'marker-15',
        'icon-size': 2,
        'icon-allow-overlap': true
      },
    });
  

}

removeRoute(){
  if(this.map.getLayer("startMarker")!=undefined){
    this.map.removeLayer("startMarker");
    this.map.removeSource("startMarker");
  }
  if(this.map.getLayer("finishMarker")!=undefined){
    this.map.removeLayer("finishMarker");
    this.map.removeSource("finishMarker");
  }
  if(this.map.getLayer("route")!=undefined){
    this.map.removeLayer("route");
    this.map.removeSource("routeSource");
  }
}

  toggleAssemblyPointLayerVisibility() {
    const visibility = this.map.getLayoutProperty('assemblyPoints', 'visibility');
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
