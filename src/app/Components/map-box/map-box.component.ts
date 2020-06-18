import { MapDataFetchService } from './../../services/map-data-fetch/map-data-fetch.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapIntegrationService } from '../../services/map-integration/map-integration.service';
import { PositionI, ClusterCollection, AssemblyPointCollection, RoutingGeoAssemblyPoint, PointMarker, GeoPointMarker, GeoAssemblyPoint } from '../../Classess/map/map';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UserService } from './../../services/user/user.service';
import { Storage } from '@ionic/storage';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';

const MAP_KEY = 'map-reload-token';



@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss'],
})
export class MapBoxComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasEl: ElementRef;
  private map: mapboxgl.Map;
  private myPosition: PositionI = new PositionI(0, 0);

  private clusterSource: any;
  public clusterMarkers: any;
  private assemblyPointSource: any;
  private assemblyPointTempSource: any;
  private assemblyPointMarkers: any;



  constructor(private routingUserService: RoutingUserService, private userservice: UserService,
    private mapDataFetchService: MapDataFetchService) {
    this.init();
  }

  ngOnInit() { }

  init() {

  }

  public async setupMap() {
    try {
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
        this.clusterMarkers = value;
        this.mapDataFetchService.clusterValueChange.subscribe(x => {
          this.clusterMarkers = x;
          this.updateCluster();
        })
      });
      this.mapDataFetchService.retrieveAssemblyPoints().subscribe((value) => {
        this.assemblyPointMarkers = value;
        this.mapDataFetchService.apsValueChange.subscribe(y => {
          this.assemblyPointMarkers = y;
          this.updateAssemblyPoints();
        })
      });
      resolve();
    });
  }

  private async inizializeMap() {
    await this.buildMap().then(x => {
      // setTimeout(() => {
      this.pointFetch().then(() => {
        this.drawAssemblyPoints();
        this.drawClusters();
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
        maxZoom: 16,
        center: [this.myPosition.position.longitude, this.myPosition.position.latitude],
        accessToken: environment.mapbox.accessToken
      });
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
      const temp = await this.userservice.behaviorMyOwnPosition.getValue().coords;
      this.map.flyTo({ zoom: 15, center: [temp.longitude, temp.latitude] });
    } catch (e) {
      console.log(e);
    }
    // this.map.flyTo({ zoom: 15, center: [this.myPosition.position.longitude, this.myPosition.position.latitude] });
  }


  // User-Touch-Longpress Modal Overlay -> Routing
  touchLongpress() {

  }


  drawClusters() {
    this.map.on('load', (event) => {

      console.log('true or false');
      console.log(this.map.getLayer('clusters') || this.map.getSource('clusters'));

      if (this.map.getLayer('clusters') || this.map.getSource('clusters')) {

      } else {
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

          if (this.map.hasImage('marker_GEM')) {
            this.mapDrawClusterHelper();
          } else {
            this.map.loadImage('assets/icon/group_excl_me.png', (error, image) => {
              this.map.addImage('marker_GEM', image);
              const img = new Image(20, 20);
              img.onload = () => this.map.addImage('test', img);
              img.src = 'assets/icon/cancel.svg';
              // img.naturalHeight;
              this.mapDrawClusterHelper();
            });
          }
        }, 2000);
      }
    });
  }
  mapDrawClusterHelper(): Promise<any> {
    return new Promise<any>(resolve => {
      resolve(this.map.addLayer({
        id: 'clusters',
        interactive: true,
        source: 'clusters',
        type: 'symbol',
        layout: {
          'visibility': 'visible',
          'icon-image': 'marker_GEM',
          'icon-size': 0.5,
          'icon-allow-overlap': true,
          'icon-offset': [0, -30]
        },
      }))
    });
  }

  mapDrawAssemblyPointsHelper(): Promise<any> {
    return new Promise<any>(resolve => {
      this.map.addLayer({
        id: 'assemblyPoints',
        interactive: true,
        source: 'assemblyPoints',
        type: 'symbol',
        layout: {
          'visibility': 'visible',
          'icon-image': ['get', 'iconName'],
          'icon-size': 0.5,
          'icon-allow-overlap': true,
          'text-field': ['get', 'textField'],
          'text-size': 21,
          'icon-offset': [0, -30],
          'text-offset': [0, -0.8]

        },
      })
      resolve(this.map.moveLayer('assemblyPoints', 'clusters'));
    });
  }


  updateCluster() {
    if (this.map.getSource('clusters')) {

      console.log('cluster');
      console.log(this.map.getSource('clusters'));

      this.clusterSource = this.map.getSource('clusters');
      const data2 = new ClusterCollection(this.clusterMarkers);
      const drawnBuilding = Object.assign({}, data2);
      this.clusterSource.setData(drawnBuilding);
    }
  }

  updateAssemblyPoints() {
    if (this.map.getSource('assemblyPoints')) {

      this.assemblyPointTempSource = this.map.getSource('assemblyPoints');
      const temp = this.assemblyPointMarkers;
      temp.forEach(element => {
        element.properties.textField = '';
        element.properties.iconName = 'marker_DAP';
      });
      this.assemblyPointMarkers = temp;
      const data3 = new AssemblyPointCollection(temp);
      const drawnBuilding = Object.assign({}, data3);
      this.assemblyPointTempSource.setData(drawnBuilding);

      console.log('AP updated in View');
    }
  }
  // draw all Clusters in perimeter
  drawAssemblyPoints() {
    this.map.on('load', (event) => {
      if (this.map.getSource('assemblyPoints')) {

        console.log('drawAssembly');
        console.log(this.map.getSource('assemblyPoints'));
        
      } else {
        this.map.addSource('assemblyPoints', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });
      }
      setTimeout(() => {
        // Should be Observable Calling -> FirebaseList
        this.assemblyPointSource = this.map.getSource('assemblyPoints');
        const data2 = new AssemblyPointCollection(this.assemblyPointMarkers);
        this.assemblyPointSource.setData(data2);

        if (this.map.hasImage('marker_CAP') && this.map.hasImage('marker_DAP') && this.map.hasImage('marker_UNAP')) {
          if (this.map.getLayer('assemblyPoints')) {

          } else {
            this.mapDrawAssemblyPointsHelper();
          }
        } else {
          this.map.loadImage('assets/icon/default_meetingpoint_whiteborder.png', (error, image) => {
            this.map.addImage('marker_DAP', image);
            this.map.loadImage('assets/icon/choosen_meetingpoint.png', (error, image) => {
              this.map.addImage('marker_CAP', image);
              this.map.loadImage('assets/icon/default_meetingpoint_whiteborder_alpha.png', (error, image) => {
                this.map.addImage('marker_UNAP', image);
                // let img = new Image(20,20);
                // img.onload=()=>this.map.addImage('test',img);
                // img.src='assets/icon/cancel.svg';
                if (this.map.getLayer('assemblyPoints')) {
                } else {
                  this.mapDrawAssemblyPointsHelper();
                }
              });
            });
          });

        }
      }, 2000);
    });


  }

  // draw User with Bearing
  drawUserPoint() {
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showAccuracyCircle: true,
      showUserLocation: true
    });
    this.map.addControl(geolocate);
    this.map.on('load', (event) => {
      geolocate.trigger();
    });
  }

  disableAssemblyClick(): Promise<any> {
    return new Promise<any>(resolve => {
      resolve(this.map.off('click', 'assemblyPoints', this.drawChooseAssemblyPoints));
    });
  }

  drawUpdateChooseAssemblyPoints() {
    if (this.map.getSource('assemblyPoints')) {
      let data2;
      data2 = new AssemblyPointCollection(this.assemblyPointMarkers);
      const temp: mapboxgl.GeoJSONSource = this.map.getSource('assemblyPoints') as mapboxgl.GeoJSONSource;
      temp.setData(data2);
    }
  }


  drawChooseAssemblyPoints = (e) => {
    if (e.features[0].properties.iconName == 'marker_UNAP') {
    } else {
      if (e.features[0].properties.iconName === 'marker_CAP') {
        let n = e.features[0].properties.textField;
        let l = e.features[0].properties.title;
        let arr = [];
        let temp2 = this.assemblyPointMarkers;
        this.routingUserService.deletePoints(parseInt(n)).then(() => {
          this.routingUserService.getPoints().then(x2 => {
            if (x2.length != null && x2.length != 0) {
              let length = 0;
              length = x2.length;
              this.assemblyPointMarkers.forEach(x => {
                if (x.properties.textField == length.toString()) {
                  for (let i = 0; i < x.properties.available_count; i++) {
                    arr.push(x.properties['available_' + (i + 1)]);
                  }
                }
                for (let i = 0; i < temp2.length; i++) {
                  if (temp2[i].properties.iconName == 'marker_CAP') {
                    if (temp2[i].properties.title === l || parseInt(temp2[i].properties.textField) > parseInt(n)) {
                      temp2[i].properties.iconName = 'marker_DAP';
                      temp2[i].properties.textField = '';
                    }
                  } else {
                    temp2[i].properties.iconName = 'marker_UNAP';
                    for (let j = 0; j < arr.length; j++) {
                      if (arr[j] == temp2[i].properties.title) {
                        temp2[i].properties.iconName = 'marker_DAP';
                      }
                    }
                  }
                }
                this.drawUpdateChooseAssemblyPoints();
              })
            } else {
              for (let i = 0; i < temp2.length; i++) {
                temp2[i].properties.iconName = 'marker_DAP';
                temp2[i].properties.textField = '';
              }
              this.drawUpdateChooseAssemblyPoints();
            }
          });
        });
      } else {
        e.features[0].properties.iconName = 'marker_CAP';
        let s = e.features[0].properties.latitude;
        let l = e.features[0].properties.longitude;
        let n = e.features[0].properties.title;
        let m = e.features[0].properties.iconName;
        let count = e.features[0].properties.available_count;
        let arr = [];
        for (let i = 0; i < count; i++) {
          arr.push(e.features[0].properties['available_' + (i + 1)]);
        }
        this.routingUserService.getPoints().then(x => {
          this.routingUserService.setPoints(new RoutingGeoAssemblyPoint(s, l, n, arr, (x.length + 1).toString(), m)).then(() => {
            this.drawChooseUpdateAssemblyPoints_Helper(arr, n);
          });
        });
      }
    }
  }

  drawChooseUpdateAssemblyPoints_Helper(arr: Array<any>, n: string): Promise<any> {
    return new Promise<any>(resolve => {
      let temp2 = this.assemblyPointMarkers;
      this.routingUserService.getPoints().then(x => {
        for (let i = 0; i < temp2.length; i++) {
          if (x.some(e => (e.name === temp2[i].properties.title) && (temp2[i].properties.iconName == 'marker_CAP'))) {
          } else {
            if (temp2[i].properties.title == n) {
              temp2[i].properties.iconName = 'marker_CAP';
              temp2[i].properties.textField = x.length.toString();
            } else {
              temp2[i].properties.iconName = 'marker_UNAP';
              for (let j = 0; j < arr.length; j++) {
                if (arr[j] == temp2[i].properties.title) {
                  temp2[i].properties.iconName = 'marker_DAP';
                }
              }
            }
          }
        }
        this.drawUpdateChooseAssemblyPoints();
        resolve();
      });
    });
  }

  async drawRoute(pointString): Promise<any> {
    return new Promise(resolve => {
      this.routingUserService.getstartPoint().then(y => {
        this.routingUserService.getfinishPoint().then(x => {
          const start = y[0]; //StartCoords
          const end = x[0]; //FinishCoords
          const bbox = [start, end];
          const completeDirectionString = start[0] + ',' + start[1] + ';' + pointString + end[0] + ',' + end[1];
          const url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' +
            completeDirectionString + '?steps=true&geometries=geojson&access_token=' + environment.mapbox.accessToken.toString();
          console.log(url);
          if (this.map.loaded()) {
            this.drawRouteHelpMethod(url, this.drawRouteFunctionMap, this.map, this.drawStartMarker,
              this.drawThisFinishMarker, this.routingUserService, bbox).then(() => { resolve(); });
          }

        });
      });
    });
  }



  drawRouteHelpMethod(url, cFunction, map, start, finish, routing, bbox): Promise<any> {
    return new Promise(resolve => {
      // XMLHttpRequest is a bitch  
      const xhttp = new XMLHttpRequest();
      xhttp.responseType = 'json';
      xhttp.open("GET", url, true);
      xhttp.onreadystatechange =  () => {
        xhttp.onload = () => {
          const jsonResponse = xhttp.response;
          const distance = jsonResponse.routes[0].distance * 0.001; // Convert to KM
          const duration = jsonResponse.routes[0].duration / 60;  // Convert to Minutes
          const coords = jsonResponse.routes[0].geometry;
          const routeCoords = { coordinates: [], type: 'LineString' }
          jsonResponse.routes[0].legs.forEach(element => {
            element.steps.forEach(step => {
              step.geometry.coordinates.forEach(coordinate => {
                routeCoords.coordinates.push(coordinate);

              })

            })
          });
          if ((xhttp.readyState === 4) && (xhttp.status === 200)) {
            routing.setDuration(duration);  // Set Duration Value
            routing.setDistance(distance);  // Set Distance Value
            // For printing Start-/FinishMarker
            const first = coords.coordinates[0]; // First GeoLine Point
            const last = coords.coordinates[coords.coordinates.length - 1]; // Last GeoLine Point
            cFunction(routeCoords, map); // Übergabe von drawRouteFunctionMap() Function
            // depreceated //start(first,map); //Übergabe von drawStartMarker() Function 
            console.log(bbox);
            map.fitBounds(bbox, { padding: { top: 200, bottom: 130, left: 40, right: 40 } });
            finish(map, routing, last); // Übergabe von drawFinishMarker() Function
            resolve();
          }
        };
      }
      xhttp.send();
    });
  }

  drawRouteFunctionMap(coords, map) {
    if (map.getLayer('route') != undefined) {
      map.removeLayer('route');
      map.removeSource('routeSource');
    }
    map.addSource('routeSource', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: coords } });
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'routeSource',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',

      },
      paint: {
        'line-color': '#3b9ddd',
        'line-width': 8,
        'line-opacity': 0.8
      }
    });
    map.moveLayer('route', 'assemblyPoints');
  };


  drawFinishMarker() {
    this.map.on('click', 'assemblyPoints', this.drawChooseAssemblyPoints);
    this.drawThisFinishMarker(this.map, this.routingUserService);
  }


  drawThisFinishMarker(map, routing, finishPointHave?) {
    routing.getfinishPoint().then(finishPoint => {
      if (map.getLayer('finishMarker') != undefined) {
        let finishPointSource;
        let finishPointdata;
        finishPointSource = map.getSource('finishMarker') as mapboxgl.GeoJSONSource;
        if (finishPointHave) {
          finishPointdata = new PointMarker(Array(new GeoPointMarker(finishPointHave)));
        } else {
          finishPointdata = new PointMarker(Array(new GeoPointMarker(finishPoint[0])));
        }
        finishPointSource.setData(finishPointdata);
      } else {
        this.routingUserService.getstartPoint().then(x => {
          map.addSource('finishMarker', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] }
          });
          let finishPointSource: mapboxgl.GeoJSONSource;
          let finishPointdata;
          finishPointSource = map.getSource('finishMarker') as mapboxgl.GeoJSONSource;
          if (finishPointHave) {
            finishPointdata = new PointMarker(Array(new GeoPointMarker(finishPointHave)));
            const bbox = [x[0], finishPointHave];
            map.fitBounds(bbox, { padding: { top: 200, bottom: 130, left: 40, right: 40 } });
          } else {
            finishPointdata = new PointMarker(Array(new GeoPointMarker(finishPoint[0])));
            const bbox = [x[0], finishPoint[0]];
            map.fitBounds(bbox, { padding: { top: 200, bottom: 130, left: 40, right: 40 } });
          }
          finishPointSource.setData(finishPointdata);

          if (map.hasImage('target')) {
            this.mapDrawFinishMarkerHelper(map);
          } else {
            map.loadImage('assets/icon/target.png', (error, image) => {
              map.addImage('target', image);
              this.mapDrawFinishMarkerHelper(map);
            });
          }
        })
      }
    });
  }
  mapDrawFinishMarkerHelper(map): Promise<any> {
    return new Promise(resolve => {
      map.addLayer({
        id: 'finishMarker',
        source: 'finishMarker',
        type: 'symbol',
        layout: {
          'visibility': 'visible',
          'icon-image': 'target',
          'icon-size': 0.5,
          'icon-allow-overlap': true,
          'icon-offset': [0, -30]
        },
      });
      resolve();
    });
  }

  drawStartMarker(startPoint, map) { // Depreceated //unusable
    if (map.getLayer('startMarker') != undefined) {
      // map.removeLayer("startMarker");
      //  map.removeSource("startMarker");
      console.log('StartMarker esxists');
    }
    map.addSource('startMarker', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
    let startingPointSource;
    startingPointSource = map.getSource('startMarker') as mapboxgl.GeoJSONSource;
    const startPointData = new PointMarker(Array(new GeoPointMarker(startPoint[0])));
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
        'icon-allow-overlap': false
      },
    });
  }

  removeRoute(): Promise<any> {
    return new Promise(resolve => {
      this.assemblyPointMarkers = this.mapDataFetchService.aps;
      if (this.map.getLayer('startMarker') != undefined) {
        this.map.removeLayer('startMarker');
        this.map.removeSource('startMarker');
      }
      if (this.map.getLayer('finishMarker') != undefined) {
        this.map.removeLayer('finishMarker');
        this.map.removeSource('finishMarker');
      }
      if (this.map.getLayer('route') != undefined) {
        this.map.removeLayer('route');
        this.map.removeSource('routeSource');
      }
      const x = this.userservice.behaviorMyOwnPosition.value;

      this.map.flyTo({
        center: [
          x.coords.longitude,
          x.coords.latitude
        ],
        essential: true,
        zoom: 13,
        bearing: 0,
        speed: 0.5,
        curve: 1
      });

      resolve();
    });
  }

  toggleAssemblyPointLayerVisibility() {
    const visibility = this.map.getLayoutProperty('assemblyPoints', 'visibility');
    if (visibility === 'visible') {
      this.map.setLayoutProperty('assemblyPoints', 'visibility', 'none');
    } else {
      // this.map.setLayoutProperty('clickable', 'visibility', 'none');
      this.map.setLayoutProperty('assemblyPoints', 'visibility', 'visible');
    }
  }
}
