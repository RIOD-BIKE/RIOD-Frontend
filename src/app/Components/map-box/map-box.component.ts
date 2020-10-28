import { MapDataFetchService } from './../../services/map-data-fetch/map-data-fetch.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapIntegrationService } from '../../services/map-integration/map-integration.service';
import { PositionI, ClusterCollection, AssemblyPointCollection, RoutingGeoAssemblyPoint, PointMarker, GeoPointMarker } from '../../Classess/map/map';
import { UserService } from './../../services/user/user.service';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import * as turf from '@turf/turf';

//Vorwort:
//Das Map-Box Component ist für die Darstellung und Logik der interaktiven Karte dar
//Es wird in die page:map-main als Component Selector includiert

@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss'],
})
export class MapBoxComponent implements OnInit {


  //Variable zur MapBox Map
  private map: mapboxgl.Map;
  //Variable zur temporären Positionsspeicherung -> Hinlänglich Startprozedur
  private myPosition: PositionI = new PositionI(0, 0);

  private clusterSource: any;
  public clusterMarkers: any;
  private assemblyPointSource: any;
  private assemblyPointTempSource: any;
  private assemblyPointMarkers: any;
  private routingActive = false;
  private tempSaveingassemblyPointMarkers: any;

  //Services zur Nutzer-Sensor / Routen / Karten-Daten/ Karten-Interaktion - Verwaltung
  constructor(private routingUserService: RoutingUserService, private userservice: UserService,
              private mapDataFetchService: MapDataFetchService, private mapIntegration: MapIntegrationService) {
  }

  ngOnInit() { }


//Startfunktion
//Nutzer-Sensor-Position nach Serviceaufruf weitergeben an temp-V. und Karten-Daten Service zur weiterleitung an Firestore
  public async setupMap() {
      await this.userservice.getUserPosition().then(x => {
        this.myPosition = x;
        this.mapDataFetchService.sendUserPosition(x);
      });
      //Initialisierung der Karte
    this.inizializeMap();
      //Kartengröße an Bildschrim anpassen
    setTimeout(() => this.map.resize(), 0);

  }

  //Funktion zum holen der aktuellen Cluster und AssemblyPointdaten
  private pointFetch(): Promise<any> {
    return new Promise<any>(resolve => {
      //Verschachtelter Service-Aufruf und abfragen der aktuellen Cluster Daten von Firestore
      this.mapDataFetchService.retrieveClusters().subscribe((value) => {
        this.clusterMarkers = value;
        this.mapDataFetchService.clusterValueChange.subscribe(newClusterFetched => {
          this.clusterMarkers = newClusterFetched;
          //Aufruf AktualisierungFunktion für Cluster
          this.updateCluster();
        });
      });
      //Verschachtelter Service-Aufruf und abfragen der aktuellen AssemblyPoint Daten von Firestore
      this.mapDataFetchService.retrieveAssemblyPoints().subscribe((value) => {
        console.log('hey111');
        if (this.routingActive === false) {
          this.assemblyPointMarkers = value;
          //Aufruf AktualisierungFunktion für AssemblyPoints
          this.updateAssemblyPoints();
        } else {
          //Solange keine Route Aktiv auf der Karte ausgeführt wird, soll die Aktualiserung der AssemblyPoints nur temporär als Variable gespeichert werden
          this.tempSaveingassemblyPointMarkers = value;
        }
      });
      resolve();
    });
  }
  //Initialisierung der Karte und Laden von allen Points
  private async inizializeMap() {
    await this.buildMap().then(() => {
      //Nach Erstellung der Karte & Initialisierung die aktuellen Punkte abfragen und eitnragen
      this.pointFetch().then(() => {
        this.drawAssemblyPoints();
        this.drawClusters();
      });
      //Nutzerposition eintragen
      this.drawUserPoint();
    });
  }

  //Karte als MapBox-Map-Object definieren und mit Style / Zoom Values versehen
  buildMap(): Promise<any> {
    return new Promise<any>(resolve => {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10?optimize=true',
        zoom: 13,
        // maxZoom: 16,
        center: [this.myPosition.position.longitude, this.myPosition.position.latitude],
        accessToken: environment.mapbox.accessToken
      });
      this.map.jumpTo({ center: [this.myPosition.position.longitude, this.myPosition.position.latitude] });
      resolve();
    });
  }

  //Die aktuelle Karte zum Nutzer-Center Fliegen lassen
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
  //Nutzerposition aktualisieren
  async getUserPos() {
    this.myPosition = await this.userservice.getUserPosition();
  }
  //Cluster auf der Karte darstellen
  drawClusters() {
    //Sicherstellung, dass die Karte geladen/erstellt wurde
    this.map.on('load', () => {
      //Layer wurde zuvor nicht verwendet
      if (this.map.getLayer('clusters') === undefined && this.map.getSource('clusters') === undefined) {
        //dann hinzufügen von Source
        this.map.addSource('clusters', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });
        //Source aus Map-Objekt laden, um Objekt als Source-Objekt temporär zu definieren und spätere Zuweisung zum Map-Objekt zuzulassen
        this.clusterSource = this.map.getSource('clusters');
        const data = new ClusterCollection(this.clusterMarkers);
        this.clusterSource.setData(data);
        //Source-Objekt mit neuen ClusterMarkern versehen

        //bei geladenen Cluster-Image [Bilddatei muss dem Map-Objekt hinzugeladen werden] in Funktion übergehen
        if (this.map.hasImage('marker_GEM')) {
          this.mapDrawClusterHelper();
        } else {
          //Sonst neues Bild definieren und dem Map-Objekt hinzugeben
            const img = new Image(78, 78);

            img.src = 'assets/icon/Verband_2.svg';
            img.onload = () => {this.map.addImage('marker_GEM', img);
                                if (this.map.hasImage('marker_GEM')) {
                                this.mapDrawClusterHelper();
                                }
            };

        }
      } else {
        //Sonst UpadeCluster ausführen
        this.updateCluster();
      }
    });
  }
  //Allen Cluster-Objekten das Cluster-Bild und Positionsverschiebung übergeben
  mapDrawClusterHelper(): Promise<any> {
    return new Promise<any>(resolve => {
      resolve(this.map.addLayer({
        id: 'clusters',
        interactive: true,
        source: 'clusters',
        type: 'symbol',
        layout: {
          visibility: 'visible',
          'icon-image': 'marker_GEM',
          'text-size': 10,
          'text-field': ['get', 'count'],
          'icon-size': 0.5,
          'icon-allow-overlap': true,
          'icon-offset': [0, -30],
          'text-offset': [0.865, -2.46]
        },
      }));
    });
  }

  //Allen AssemblyPoint-Objekten das AssemblyPoint-Bild und Positionsverschiebung übergeben
  mapDrawAssemblyPointsHelper(): Promise<any> {
    return new Promise<any>(resolve => {
      this.map.addLayer({
        id: 'assemblyPoints',
        interactive: true,
        source: 'assemblyPoints',
        type: 'symbol',
        layout: {
          visibility: 'visible',
          'icon-image': ['get', 'iconName'],
          'icon-size': 0.5,
          'icon-allow-overlap': true,
          'text-field': ['get', 'textField'],
          'text-size': 21,
          'icon-offset': [0, -30],
          'text-offset': [0, -0.8]
        },
      });
      //AssemblyPoints vor Cluster darstellen
      resolve(this.map.moveLayer('assemblyPoints', 'clusters'));
    });
  }


  //UpadeCluster Funktion
  //Im Laufe des Programms [nicht zur Initialsierung] Aktualisierung der Cluster auf der Karte 
  updateCluster() {
    if (this.map.getSource('clusters') !== undefined) {
      this.clusterSource = this.map.getSource('clusters');
      const data2 = new ClusterCollection(this.clusterMarkers);
      const drawnBuilding = Object.assign({}, data2);
      this.clusterSource.setData(drawnBuilding);
    }
  }

  //AssemblyPoints Funktion
  //Im Laufe des Programms [nicht zur Initialsierung] Zurücksetzen der AssemblyPoints auf der Karte [Auswahl von APs durch Nutzer]
  updateAssemblyPoints() {
    if (this.map.getSource('assemblyPoints') !== undefined) {
      this.assemblyPointTempSource = this.map.getSource('assemblyPoints');
      const temp = this.assemblyPointMarkers;
      temp.forEach((element: { properties: { textField: string; iconName: string; }; }) => {
        //Zurücksetzen aller Elemente von Text und Bild
        element.properties.textField = '';
        element.properties.iconName = 'marker_DAP';
      });
      this.assemblyPointMarkers = temp;
      const data3 = new AssemblyPointCollection(temp);
      const drawnBuilding = Object.assign({}, data3);
      this.assemblyPointTempSource.setData(drawnBuilding);
    }
  }


  //AssemblyPoint Source erstellen und die Bilder für Aps hinzuladen
  //AssemblyPoints-Draw Funktion aufruf, bei bestehen aller Anforderungen
  drawAssemblyPoints() {
    this.map.on('load', () => {
      //Wenn Source nicht vorhanden, soll erstellt werden
      if (this.map.getSource('assemblyPoints') === undefined && this.map.getLayer('assemblyPoints') === undefined) {
        this.map.addSource('assemblyPoints', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });
      }
      this.assemblyPointSource = this.map.getSource('assemblyPoints');
      const data2 = new AssemblyPointCollection(this.assemblyPointMarkers);
      this.assemblyPointSource.setData(data2);

      //Alle Bilder vorhanden, soll mapDrawAssemblyPointsHelper() ausführen
      if (this.map.hasImage('marker_CAP') && this.map.hasImage('marker_DAP') && this.map.hasImage('marker_UNAP')) {
        if (this.map.getLayer('assemblyPoints') === undefined) {
          this.mapDrawAssemblyPointsHelper();
        }
      } else {
        //Sonst alle Bilder hinzuladen
        const img2 = new Image(66.7, 79.38);
        img2.src = 'assets/icon/Sammelpunkt.svg';
        img2.onload = () => {
          this.map.addImage('marker_DAP', img2);
          const img3 = new Image(66.7, 79.38);
          img3.src = 'assets/icon/Sammelpunkt_empty.svg';
          img3.onload = () => {
            this.map.addImage('marker_CAP', img3);
            const img4 = new Image(66.7, 79.38);
            img4.src = 'assets/icon/Sammelpunkt_UNAC.svg';
            img4.onload = () => {
              this.map.addImage('marker_UNAP', img4);
              if (this.map.getLayer('assemblyPoints') === undefined) {
                this.mapDrawAssemblyPointsHelper();
              }
            };
          };
        };
      }
    });
  }
  //Nutzerpositions-Beacon drawn
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

  //Nutzer-Auswahl von AssemblyPoints deaktivieren
  disableAssemblyClick(): Promise<any> {
    return new Promise<any>(resolve => {
      resolve(this.map.off('click', 'assemblyPoints', this.drawChooseAssemblyPoints));
    });
  }

  //AssemblyPoints mit neuen Wertern erstzen und für Auswahl  bereit halten
  drawUpdateChooseAssemblyPoints() {
    if (this.map.getSource('assemblyPoints') !== undefined) {
      let data2;
      data2 = new AssemblyPointCollection(this.assemblyPointMarkers);
      const temp: mapboxgl.GeoJSONSource = this.map.getSource('assemblyPoints') as mapboxgl.GeoJSONSource;
      temp.setData(data2);
    }
  }

  //Nutzerauswahl von AssemblyPoints Funktion
  //Abhängig ob Element geklickt, wird dessen Bild geändert und darauf folgende AssemblyPoints deren Auswahl ermöglicht
  //Abhängig von der Anzahl der schon ausgewählten Folge an Aps wird die Text-Nummerierung verändert
  drawChooseAssemblyPoints = (e) => {
    //Wenn Ap nicht auswählbar, dann nichts tun
    if (e.features[0].properties.iconName === 'marker_UNAP') {
    } else {
      //AP deselektieren
      //Aktuellen AP Text löschen und Image zurücksetzen
      //Umliegende Aps aktualisieren
      if (e.features[0].properties.iconName === 'marker_CAP') {
        const n = e.features[0].properties.textField;
        const l = e.features[0].properties.title;
        const arr = [];
        const temp2 = this.assemblyPointMarkers;
        this.routingUserService.deletePoints(parseInt(n, 10)).then(() => {
          this.routingUserService.getPoints().then(points => {
            if (points.length != null && points.length !== 0) {
              const length = points.length;
              this.assemblyPointMarkers.forEach(x => {
                if (x.properties.textField === length.toString()) {
                  for (let i = 0; i < x.properties.available_count; i++) {
                    arr.push(x.properties['available_' + (i + 1)]);
                  }
                }
                for (let i = 0; i < temp2.length; i++) {
                  if (temp2[i].properties.iconName === 'marker_CAP') {
                    if (temp2[i].properties.title === l || parseInt(temp2[i].properties.textField, 10) > parseInt(n, 10)) {
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
              });
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
        //Initialauswahl vom ersten AssemblyPoint
        e.features[0].properties.iconName = 'marker_CAP';
        const s = e.features[0].properties.latitude;
        const l = e.features[0].properties.longitude;
        const n = e.features[0].properties.title;
        const m = e.features[0].properties.iconName;
        const count = e.features[0].properties.available_count;
        const arr = [];
        //Darauffolgende Mögliche AssemblyPoints in Array laden
        //identifiziert durch available_1/2/3/4/...
        //Sind die an Ap nächst möglich anzufahrenden -> Alle Möglichen Richtungen möglich folgender Ap
        for (let i = 0; i < count; i++) {
          arr.push(e.features[0].properties['available_' + (i + 1)]);
        }
        this.routingUserService.getPoints().then(x => {
          //Die Mögliche Auswahl an Aps an Service geben
          this.routingUserService.setPoints(new RoutingGeoAssemblyPoint(s, l, n, arr, (x.length + 1).toString(), m)).then(() => {
            //Update Assemblypoints
            this.drawChooseUpdateAssemblyPoints_Helper(arr, n);
          });
        });
      }
    }
  }

  //Auswahl Assemblypoints festlegen der Images und Texte, für Aktion des Ersten-Auswählen
  //Aktuell geklickten als Geklickt markieren und umliegend nächste Folgemöglichkeiten als Möglich Selektierbar markieren, alle anderen als unmöglich selektierbar
  drawChooseUpdateAssemblyPoints_Helper(arr: Array<any>, n: string): Promise<any> {
    return new Promise<any>(resolve => {
      const temp2 = this.assemblyPointMarkers;
      this.routingUserService.getPoints().then(x => {
        for (let i = 0; i < temp2.length; i++) {
          if (x.some(e => (e.name === temp2[i].properties.title) && (temp2[i].properties.iconName === 'marker_CAP'))) {
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
        //Update der Assemblypoints auf der Karte
        resolve(this.drawUpdateChooseAssemblyPoints());
      });
    });
  }

  //Route auf Karte drawn
  //Übergebener String wird hier endgültig zusammengestellt und an Hilfe Funktion übergeben
  async drawRoute(pointString): Promise<any> {
    return new Promise(resolve => {
      this.routingActive = true;
      this.routingUserService.getstartPoint().then(y => {
        this.routingUserService.getfinishPoint().then(x => {
          const start = y[0]; // StartCoords
          const end = x[0]; // FinishCoords
          const bbox = [start, end];
          const completeDirectionString = start[0] + ',' + start[1] + ';' + pointString + end[0] + ',' + end[1];
          const url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' +
            completeDirectionString + '?steps=true&geometries=geojson&access_token=' + environment.mapbox.accessToken.toString();
          this.drawRouteHelpMethod(url, this.drawRouteFunctionMap, this.map, bbox).then(() => { resolve(); });
        });
      });
    });
  }


  //Route Helper - Xhttp Calls an MapBox - Problems inside Funktion global Method usage, so
  //Methoden müssen tlw. als Verweis durch drawRoute() übergeben werden
  //cFunktion = drawRouteFunctionMap()
  //map = Kartenelement Map.MapBoxGL Map Objekt
  //bbox = BoundaryBox Koordinaten Start & Finish
  //url = MapBox url mit String der Koordinaten und optionen zur Linienführung


  drawRouteHelpMethod(url, cFunction, map, bbox): Promise<any> {
    // console.log('hey');
    return new Promise(resolve => {
      // XMLHttpRequest is a bitch
      const xhttp = new XMLHttpRequest();
      xhttp.responseType = 'json';
      //Anfrage an MapBox zu Routenanfrage
      xhttp.open('GET', url, true);
      xhttp.onreadystatechange = () => {
        xhttp.onload = () => {
          //Resultat onload
          const jsonResponse = xhttp.response;
          this.routingUserService.setPointsDetailed(jsonResponse.routes[0].legs).then(() => {
            //Distanz und Zeit, Koordinaten der Punkte abfangen berechnen
            const distance = jsonResponse.routes[0].distance * 0.001;
            const duration = jsonResponse.routes[0].duration / 60;
            const coords = jsonResponse.routes[0].geometry;
            const routeCoords = { coordinates: [], type: 'LineString' };
            //Jedee Koordinate in routeCoords hinzufügen [FeinLinienführung -> Mehr Katen des Vectors = Feinere Linie]
            jsonResponse.routes[0].legs.forEach(element => {
              element.steps.forEach(step => {
                step.geometry.coordinates.forEach(coordinate => {
                  routeCoords.coordinates.push(coordinate);
                });
              });
            });
            //onload beendet und if states = true
            if ((xhttp.readyState === 4) && (xhttp.status === 200)) {
              //In Service Zeit und Distanz eintragen
              this.routingUserService.setDuration(duration);
              this.routingUserService.setDistance(distance);
              //drawRouteFunctionMap() ausführen
              cFunction(routeCoords, map);
              //Jeden Punkt hinzuladen
              this.routingUserService.getPoints().then(points => {
                const arr = [];
                points.forEach(p => {
                  arr.push([p.position.longitude, p.position.latitude]);
                });
                arr.push(bbox[0]);
                arr.push(bbox[1]);
                const line = turf.lineString(arr);
                const bboxTurf = turf.bbox(line);
                // Sicht des Nutzers an Start & Endpunkt herauszoomen/hereinzoomen 
                // map.fitBounds(bboxTurf, { padding: { top: 200, bottom: 130, left: 40, right: 40 } });  //Probleme bei Abfragen und Prozess-Warten, führt zu späteren inkonsitenten Auslösen
                //FinishMarker setzen
                this.drawThisFinishMarker(map, arr);  
                resolve();
              });
            }
          });
        };
      };
      xhttp.send();
    });
  }
  //Routen-Linie auf Karte mit Farbe und Layout darstellen und 
  drawRouteFunctionMap(coords, map) {
    //Wenn Map-Layer vorhanden, soll gelöscht werden
    if (map.getLayer('route') !== undefined) {
      map.removeLayer('route');
      map.removeSource('routeSource');
    }
    //Map-Source  get Koordinaten
    map.addSource('routeSource', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: coords } });
    //Map-Layer mit Routen-Koordinaten hinzufügen
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
    //AssemblyPoints und route Bewegen
    map.moveLayer('route', 'assemblyPoints');
  }

  //Ziel-Marker hinzufügen
  drawFinishMarker(): Promise<boolean> {
    return new Promise(resolve => {
      this.drawExistingAssemblyPointRoute().then(x => {
        if (x !== false && x.assemblyPoints !== undefined && x.assemblyPoints.length > 0) {
          let i = 0;
          const apMarker = this.assemblyPointMarkers;
          const length = x.assemblyPoints.length;
          x.assemblyPoints.forEach(apPoint => {
            apMarker.forEach(apM => {
              if (apPoint.name === apM.properties.title && apPoint.position.longitude === apM.geometry.coordinates[0]
                && apPoint.position.latitude === apM.geometry.coordinates[1]) {
                apM.properties.iconName = apPoint.iconName;
                apM.properties.textField = apPoint.textField;
                this.routingUserService.setPoints(new RoutingGeoAssemblyPoint(apM.properties.latitude, apM.properties.longitude,
                  apM.properties.title, apPoint.available, apM.properties.textField, apM.properties.iconName));
                i++;
              } else {
                if (apM.properties.textField === '' && apM.properties.iconName !== 'marker_CAP') {
                  apM.properties.iconName = 'marker_UNAP';
                }
              }
            });
            if (length.toString() === apPoint.textField) {
              apPoint.available.forEach(x => {
                this.routingUserService.getPoints().then(point => {
                  if (x !== point.name) {
                    apMarker.forEach(apM => {
                      if (apM.properties.title === x && apM.properties.textField === '') {
                        apM.properties.iconName = 'marker_DAP';
                      }
                    });
                  }
                });
              });
            }
            if (i === length) {
              this.assemblyPointMarkers = apMarker;
              this.routingUserService.getPoints().then(() => {
                this.drawUpdateChooseAssemblyPoints();
                this.map.on('click', 'assemblyPoints', this.drawChooseAssemblyPoints);
                this.drawThisFinishMarker(this.map);
                resolve(true);
              });
            }
          });
        } else {
          this.map.on('click', 'assemblyPoints', this.drawChooseAssemblyPoints);
          this.drawThisFinishMarker(this.map);
          resolve(false);
        }
      });
    });
  }


  drawExistingAssemblyPointRoute(): Promise<any> {
    return new Promise(resolve => {
      this.mapIntegration.checkifRouteExists().then(x => {
        if (x === false) {
          resolve(false);
        } else {
          resolve(x.value);
        }
      });
    });
  }

  //FinishMarker der Karte hinzufügen
  drawThisFinishMarker(map, pointArray?) {
    this.routingUserService.getPoints().then(points => {
      this.routingUserService.getfinishPoint().then(finishPoint => {
        if (map.getLayer('finishMarker') !== undefined) {
          let finishPointSource;
          let finishPointdata;
          finishPointSource = map.getSource('finishMarker') as mapboxgl.GeoJSONSource;
          finishPointdata = new PointMarker(Array(new GeoPointMarker(finishPoint[0])));

          finishPointSource.setData(finishPointdata);
        } else {
          this.routingUserService.getstartPoint().then(startpoint => {
            if (map.getSource('finishMarker') !== undefined) {
              this.map.removeSource('finishMarker');
            }
            map.addSource('finishMarker', {
                type: 'geojson',
                data: { type: 'FeatureCollection', features: [] }
              });

            let finishPointSource: mapboxgl.GeoJSONSource;
            let finishPointdata;
            finishPointSource = map.getSource('finishMarker') as mapboxgl.GeoJSONSource;
            if (pointArray !== undefined) {
              console.log(pointArray);
              finishPointdata = new PointMarker(Array(new GeoPointMarker(pointArray)));
              const arr = [startpoint[0], pointArray, finishPoint];
              const line = turf.lineString(arr);
              const bbox = turf.bbox(line);

              console.log('DrawThisFinishPointMarker1' + bbox);
              finishPointSource.setData(finishPointdata);
              map.fitBounds(bbox, { padding: { top: 200, bottom: 130, left: 40, right: 40 } });
            } else {
              finishPointdata = new PointMarker(Array(new GeoPointMarker(finishPoint[0])));
              const arr = [];
              points.forEach(p => {
                arr.push([p.position.longitude, p.position.latitude]);
              });
              arr.push(finishPoint[0]);
              arr.push(startpoint[0]);
              const line = turf.lineString(arr);
              const bboxTurf = turf.bbox(line);
              console.log('DrawThisFinishPointMarker2' + bboxTurf);
              finishPointSource.setData(finishPointdata);
              map.fitBounds(bboxTurf, { padding: { top: 200, bottom: 130, left: 40, right: 40 } });
            }

            console.log(this.map.hasImage('target'));
            if (this.map.hasImage('target') === true) {
              this.mapDrawFinishMarkerHelper();
            } else {
              const img = new Image(62.7, 75);
              img.src = 'assets/icon/ziel.svg';
              img.onload = () => {
                if (this.map.hasImage('target') === true) {
                  this.map.removeImage('target');
                }
                this.map.addImage('target', img);
                this.mapDrawFinishMarkerHelper();
              };
            }
          });

        }
      });
    });

  }
  //Finish-Marker - HelperFunktion
  //Fügt der Karte das Objekt/Layer des FinishMarkers mit Image hinzu
  mapDrawFinishMarkerHelper(): Promise<any> {
    return new Promise(resolve => {
      if (this.map.getLayer('finishMarker') !== undefined) {
        this.map.removeLayer('finishMarker');
        resolve(this.map.addLayer({
          id: 'finishMarker',
          source: 'finishMarker',
          type: 'symbol',
          layout: {
            visibility: 'visible',
            'icon-image': 'target',
            'icon-size': 0.5,
            'icon-allow-overlap': true,
            'icon-offset': [0, -30]
          },
        }));
      } else {
        resolve(this.map.addLayer({
          id: 'finishMarker',
          source: 'finishMarker',
          type: 'symbol',
          layout: {
            visibility: 'visible',
            'icon-image': 'target',
            'icon-size': 0.5,
            'icon-allow-overlap': true,
            'icon-offset': [0, -30]
          },
        }));
      }
    });
  }

  //Route von Karte löschen
  removeRoute(): Promise<any> {
    return new Promise(resolve => {
      this.routingActive = false;
      this.assemblyPointMarkers = this.mapDataFetchService.aps;

      if (this.map.getLayer('finishMarker') !== undefined) {
        this.map.removeLayer('finishMarker');
        this.map.removeSource('finishMarker');
      }
      if (this.map.getLayer('route') !== undefined) {
        this.map.removeLayer('route');
        this.map.removeSource('routeSource');
      }
      resolve();
    });
  }

  //Alle AssemblyPoints von Karte löschen bzw. durch Aktualisierung der Aps ersetzen
  removeAllPoints(): Promise<any> {
    return new Promise(resolve => {
      if (this.tempSaveingassemblyPointMarkers != undefined) {
        const temp = this.tempSaveingassemblyPointMarkers;
        temp.forEach(element => {
          element.properties.iconName = 'marker_DAP';
          element.properties.textField = '';
        });
        this.assemblyPointMarkers = temp;
        this.tempSaveingassemblyPointMarkers = undefined;
        this.drawUpdateChooseAssemblyPoints();
        resolve();
      } else {
        const temp = this.assemblyPointMarkers;
        temp.forEach(element => {
          element.properties.iconName = 'marker_DAP';
          element.properties.textField = '';
        });
        this.assemblyPointMarkers = temp;
        this.drawUpdateChooseAssemblyPoints();
        resolve();
      }
    });
  }

  //Disable Auswahl von AssemblyPoints -> Zurücksetzen der temp. AssemblyPoint Markers
  disableFutureChooseAssemblyPoints(): Promise<any> {
    return new Promise(resolve => {
      const temp = this.assemblyPointMarkers;
      temp.forEach(element => {
        if (element.properties.iconName !== 'marker_CAP') {
          element.properties.iconName = 'marker_UNAP';
          element.properties.textField = '';
        }
      });
      this.assemblyPointMarkers = temp;
      this.disableAssemblyClick();
      this.drawUpdateChooseAssemblyPoints();
      resolve();

    });
  }
  //Aktivieren der Auswahlmöglichkeit von AssemblyPoints
  enableFutureChooseAssemblyPoints(): Promise<any> {
    return new Promise(resolve => {
      const temp = this.assemblyPointMarkers;
      let num = 0;
      this.routingUserService.getPoints().then(x => {
        num = Number(x[x.length - 1].textField);
        // console.log(x);
        temp.forEach(element => {
           x[x.length - 1].available.forEach(ava => {
             if (element.properties.title === ava) {
               console.log(ava);
               if (element.properties.textField === '') {
                element.properties.iconName = 'marker_DAP';
                element.properties.textField = '';
               }
             }
           });
        });
        if (this.map.getLayer('route') !== undefined) {
          this.map.removeLayer('route');
          this.map.removeSource('routeSource');
        }
        this.assemblyPointMarkers = temp;
        this.map.on('click', 'assemblyPoints', this.drawChooseAssemblyPoints);
        this.drawUpdateChooseAssemblyPoints();
        resolve();
      });
    });
  }
}
