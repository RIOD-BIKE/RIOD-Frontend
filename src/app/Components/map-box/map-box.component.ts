import { MapDataFetchService } from './../../services/map-data-fetch/map-data-fetch.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapIntegrationService } from '../../services/map-integration/map-integration.service';
import { PositionI, ClusterCollection, AssemblyPointCollection, RoutingGeoAssemblyPoint, PointMarker, GeoPointMarker, GeoAssemblyPoint } from '../../Classess/map/map';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UserService } from './../../services/user/user.service';
import { Storage } from '@ionic/storage';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import * as turf from '@turf/turf'
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
  private assemblyPointSource: any;
  private assemblyPointTempSource: any;
  private assemblyPointMarkers: any;

  constructor(private routingUserService: RoutingUserService, private userservice: UserService,
    private mapDataFetchService: MapDataFetchService, private mapIntegration: MapIntegrationService) {
  }

  ngOnInit() { }



  public async setupMap() {
    try {
      await this.userservice.getUserPosition().then(x => {
        this.myPosition = x;
      });
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
        this.mapDataFetchService.clusterValueChange.subscribe(newClusterFetched => {
          this.clusterMarkers = newClusterFetched;
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
        //maxZoom: 16,
        center: [this.myPosition.position.longitude, this.myPosition.position.latitude],
        accessToken: environment.mapbox.accessToken
      });
      this.map.jumpTo({ center: [this.myPosition.position.longitude, this.myPosition.position.latitude] });
      resolve();
    });
  }


  public moveMapToCurrent() {
    try {
      const x = this.userservice.behaviorMyOwnPosition.value.coords;
      this.myPosition.position.longitude = x.longitude;
      this.myPosition.position.latitude = x.latitude;
      this.map.flyTo({ zoom: 15, center: [this.myPosition.position.longitude, this.myPosition.position.latitude] });
    } catch (e) {
      console.log(e);
    }
  }

  async getUserPos() {
    this.myPosition = await this.userservice.getUserPosition();
  }

  drawClusters() {
    this.map.on('load', () => {
      if (this.map.getLayer('clusters') === undefined && this.map.getSource('clusters') === undefined) {
        this.map.addSource('clusters', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });
        //setTimeout(() => {
        this.clusterSource = this.map.getSource('clusters');
        const data = new ClusterCollection(this.clusterMarkers);
        this.clusterSource.setData(data);

        if (this.map.hasImage('marker_GEM')) {
          this.mapDrawClusterHelper();
        } else {
          this.map.loadImage('assets/icon/group_excl_me.png', (error, image) => {
            this.map.addImage('marker_GEM', image);
            //const img = new Image(20, 20);
            //img.onload = () => this.map.addImage('test', img);
            //img.src = 'assets/icon/cancel.svg';
            this.mapDrawClusterHelper();
          });
        }
        // }, 2000);
      } else {
        this.updateCluster();
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
          'text-size': 10,
          'text-field': ['get', 'count'],
          'icon-size': 0.5,
          'icon-allow-overlap': true,
          'icon-offset': [0, -30],
          'text-offset': [0.916, -2.43]
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
    if (this.map.getSource('clusters') !== undefined) {
      this.clusterSource = this.map.getSource('clusters');
      const data2 = new ClusterCollection(this.clusterMarkers);
      const drawnBuilding = Object.assign({}, data2);
      this.clusterSource.setData(drawnBuilding);
    }
  }

  updateAssemblyPoints() {
    if (this.map.getSource('assemblyPoints') !== undefined) {
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
    }
  }

  drawAssemblyPoints() {
    this.map.on('load', () => {
      if (this.map.getSource('assemblyPoints') === undefined && this.map.getLayer('assemblyPoints') === undefined) {
        this.map.addSource('assemblyPoints', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });
      }
      //  setTimeout(() => {
      this.assemblyPointSource = this.map.getSource('assemblyPoints');
      const data2 = new AssemblyPointCollection(this.assemblyPointMarkers);
      this.assemblyPointSource.setData(data2);

      if (this.map.hasImage('marker_CAP') && this.map.hasImage('marker_DAP') && this.map.hasImage('marker_UNAP')) {
        if (this.map.getLayer('assemblyPoints') === undefined) {
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
              if (this.map.getLayer('assemblyPoints') === undefined) {
                this.mapDrawAssemblyPointsHelper();
              }
            });
          });
        });

      }
      //    }, 2000);
    });
  }
  drawUserPoint() {
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showAccuracyCircle: true,
      showUserLocation: true
    });
    this.map.addControl(geolocate);
    this.map.on('load', () => {
      geolocate.trigger();
    });
  }

  disableAssemblyClick(): Promise<any> {
    return new Promise<any>(resolve => {
      resolve(this.map.off('click', 'assemblyPoints', this.drawChooseAssemblyPoints));
    });
  }

  drawUpdateChooseAssemblyPoints() {
    if (this.map.getSource('assemblyPoints') !== undefined) {
      let data2;
      data2 = new AssemblyPointCollection(this.assemblyPointMarkers);
      const temp: mapboxgl.GeoJSONSource = this.map.getSource('assemblyPoints') as mapboxgl.GeoJSONSource;
      temp.setData(data2);
    }
  }

  drawChooseAssemblyPoints = (e) => {
    if (e.features[0].properties.iconName === 'marker_UNAP') {
    } else {
      if (e.features[0].properties.iconName === 'marker_CAP') {
        const n = e.features[0].properties.textField;
        const l = e.features[0].properties.title;
        const arr = [];
        const temp2 = this.assemblyPointMarkers;
        this.routingUserService.deletePoints(parseInt(n)).then(() => {
          this.routingUserService.getPoints().then(points => {
            if (points.length != null && points.length != 0) {
              let length = points.length;
              this.assemblyPointMarkers.forEach(x => {
                if (x.properties.textField == length.toString()) {
                  for (let i = 0; i < x.properties.available_count; i++) {
                    arr.push(x.properties['available_' + (i + 1)]);
                  }
                }
                for (let i = 0; i < temp2.length; i++) {
                  if (temp2[i].properties.iconName === 'marker_CAP') {
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
        const s = e.features[0].properties.latitude;
        const l = e.features[0].properties.longitude;
        const n = e.features[0].properties.title;
        const m = e.features[0].properties.iconName;
        const count = e.features[0].properties.available_count;
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
                if (arr[j] === temp2[i].properties.title) {
                  temp2[i].properties.iconName = 'marker_DAP';
                }
              }
            }
          }
        }
        resolve(this.drawUpdateChooseAssemblyPoints());
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
          //console.log(url);
          this.drawRouteHelpMethod(url, this.drawRouteFunctionMap, this.map, bbox).then(() => { resolve(); });
        });
      });
    });
  }



  drawRouteHelpMethod(url, cFunction, map, bbox): Promise<any> {
    console.log("hey")
    return new Promise(resolve => {
      // XMLHttpRequest is a bitch  
      const xhttp = new XMLHttpRequest();
      xhttp.responseType = 'json';
      xhttp.open("GET", url, true);
      xhttp.onreadystatechange = () => {
        xhttp.onload = () => {
          const jsonResponse = xhttp.response;
          const distance = jsonResponse.routes[0].distance * 0.001;
          const duration = jsonResponse.routes[0].duration / 60;
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
            this.routingUserService.setDuration(duration);
            this.routingUserService.setDistance(distance);
            const first = coords.coordinates[0];
            const last = coords.coordinates[coords.coordinates.length - 1];
            cFunction(routeCoords, map);

            this.routingUserService.getPoints().then(points => {
              let arr = [];
              points.forEach(p => {
                arr.push([p.position.longitude, p.position.latitude]);
              })
              arr.push(bbox[0]);
              arr.push(bbox[1]);
              let line = turf.lineString(arr)
              let bboxTurf = turf.bbox(line);
              map.fitBounds(bboxTurf, { padding: { top: 200, bottom: 130, left: 40, right: 40 } });
              this.drawThisFinishMarker(map, arr);
              resolve();
            })
          }
        };
      }
      xhttp.send();
    });
  }

  drawRouteFunctionMap(coords, map) {
    if (map.getLayer('route') !== undefined) {
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


  drawFinishMarker(): Promise<boolean> {
    return new Promise(resolve => {
      this.drawExistingAssemblyPointRoute().then(x => {
        if (x != false && x.assemblyPoints != undefined && x.assemblyPoints.length > 0) {
          let i = 0;
          let apMarker = this.assemblyPointMarkers;
          let length = x.assemblyPoints.length;
          x.assemblyPoints.forEach(apPoint => {
            apMarker.forEach(apM => {
              if (apPoint.name == apM.properties.title && apPoint.position.longitude == apM.geometry.coordinates[0] && apPoint.position.latitude == apM.geometry.coordinates[1]) {
                apM.properties.iconName = apPoint.iconName;
                apM.properties.textField = apPoint.textField;
                this.routingUserService.setPoints(new RoutingGeoAssemblyPoint(apM.properties.latitude, apM.properties.longitude, apM.properties.title, apPoint.available, apM.properties.textField, apM.properties.iconName));
                i++;
              } else {
                if (apM.properties.textField == "" && apM.properties.iconName != "marker_CAP") {
                  apM.properties.iconName = "marker_UNAP";
                }
              }
            })
            if (length.toString() == apPoint.textField) {
              apPoint.available.forEach(x => {
                this.routingUserService.getPoints().then(point => {
                  if (x != point.name) {
                    apMarker.forEach(apM => {
                      if (apM.properties.title == x && apM.properties.textField == "") {
                        apM.properties.iconName = "marker_DAP"
                      }
                    })
                  }
                })
              })
            }
            if (i == length) {
              this.assemblyPointMarkers = apMarker;
              this.routingUserService.getPoints().then(x => {
                this.drawUpdateChooseAssemblyPoints();
                this.map.on('click', 'assemblyPoints', this.drawChooseAssemblyPoints);
                this.drawThisFinishMarker(this.map);
                resolve(true);
              })
            }
          })
        } else {
          this.map.on('click', 'assemblyPoints', this.drawChooseAssemblyPoints);
          this.drawThisFinishMarker(this.map);
          resolve(false);
        }
      })
    })
  }

  drawExistingAssemblyPointRoute(): Promise<any> {
    return new Promise(resolve => {
      this.mapIntegration.checkifRouteExists().then(x => {
        if (x == false) {
          resolve(false);
        } else {
          resolve(x.value);
        }
      })
    });
  }


  drawThisFinishMarker(map, pointArray?) {
    this.routingUserService.getPoints().then(points => {
      this.routingUserService.getfinishPoint().then(finishPoint => {
        if (map.getLayer('finishMarker') != undefined) {
          let finishPointSource;
          let finishPointdata;
          finishPointSource = map.getSource('finishMarker') as mapboxgl.GeoJSONSource;
          finishPointdata = new PointMarker(Array(new GeoPointMarker(finishPoint[0])));

          finishPointSource.setData(finishPointdata);
        } else {
          this.routingUserService.getstartPoint().then(startpoint => {
            map.addSource('finishMarker', {
              type: 'geojson',
              data: { type: 'FeatureCollection', features: [] }
            });
            let finishPointSource: mapboxgl.GeoJSONSource;
            let finishPointdata;
            finishPointSource = map.getSource('finishMarker') as mapboxgl.GeoJSONSource;
            if (pointArray != undefined) {
              finishPointdata = new PointMarker(Array(new GeoPointMarker(pointArray)));
              let arr = [startpoint[0], pointArray, finishPoint]
              let line = turf.lineString(arr)
              let bbox = turf.bbox(line);

              console.log("DrawThisFinishPointMarker" + bbox)
              map.fitBounds(bbox, { padding: { top: 200, bottom: 130, left: 40, right: 40 } });
            } else {
              finishPointdata = new PointMarker(Array(new GeoPointMarker(finishPoint[0])));
              let arr = [];
              points.forEach(p => {
                arr.push([p.position.longitude, p.position.latitude]);
              })
              arr.push(finishPoint[0]);
              arr.push(startpoint[0]);
              let line = turf.lineString(arr)
              let bboxTurf = turf.bbox(line);
              map.fitBounds(bboxTurf, { padding: { top: 200, bottom: 130, left: 40, right: 40 } });
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
    })

  }
  mapDrawFinishMarkerHelper(map): Promise<any> {
    return new Promise(resolve => {
      resolve(map.addLayer({
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
      }))
    });
  }

  drawStartMarker(startPoint, map) { // Depreceated //unusable
    if (map.getLayer('startMarker') !== undefined) {
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
      if (this.map.getLayer('startMarker') !== undefined) {
        this.map.removeLayer('startMarker');
        this.map.removeSource('startMarker');
      }
      if (this.map.getLayer('finishMarker') !== undefined) {
        this.map.removeLayer('finishMarker');
        this.map.removeSource('finishMarker');
      }
      if (this.map.getLayer('route') !== undefined) {
        this.map.removeLayer('route');
        this.map.removeSource('routeSource');
      }

      this.getUserPos();
      // const x = this.userservice.behaviorMyOwnPosition.value;

      resolve(this.map.flyTo({
        center: [
          // x.coords.longitude,
          // x.coords.latitude
          this.myPosition.position.longitude,
          this.myPosition.position.latitude
        ],
        essential: true,
        zoom: 13,
        bearing: 0,
        speed: 0.5,
        curve: 1
      }));
    });
  }
}
