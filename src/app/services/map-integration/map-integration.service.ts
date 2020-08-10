import { RoutingGeoAssemblyPoint, MapboxOutput, Feature, PolygonAssemblyPoint } from '../../Classess/map/map';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { map, withLatestFrom, timeInterval } from 'rxjs/operators';
const MAP_KEY = 'map-reload-token';
import * as turf from '@turf/turf';
import { RoutingUserService } from '../routing-user/routing-user.service';
import { UserService } from '../user/user.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { interval } from 'rxjs';
import { UsersDataFetchService } from '../users-data-fetch/users-data-fetch.service';
import { MapDataFetchService } from '../map-data-fetch/map-data-fetch.service';
@Injectable({
  providedIn: 'root'
})

export class MapIntegrationService {
  constructor(private MapDataFetchService: MapDataFetchService, private userDataFetchService: UsersDataFetchService,
              private userService: UserService, private storage: Storage, private routingUserService: RoutingUserService,
              private http: HttpClient) {
  }

  private apsBoundaryData: number = null;
  private apsVisitedData: number[] = [];
  private apDetail;
  private lastVisitedAP: string[] = [];
  private nextVisitAP: string[] = [];
  private activeBoundary = false;
  private commandRun = false;
  private commandRunInside = false;
  private ended = false;
  private tempBounding;
  private subscription = null;
  private APsubscription = false;
  public CurrentApNumber: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public ToApNumber: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  saveRouteOffline(startPosition: number[], endPosition: RoutingGeoAssemblyPoint, assemblyPoints: RoutingGeoAssemblyPoint[], duration: number, distance: number): Promise<any> {
    return new Promise(resolve => {
      const i = 0;
      this.checkifRouteExists().then(routeExists => {
        this.checkSavedRouteLength().then(rLength => {
          this.storage.forEach((value, key, index) => {
            const str = 'Route_' + (rLength + 1);
            if (routeExists == false) {
              const str = 'Route_' + (rLength + 1);
              this.storage.set(str, {startPosition, endPosition, assemblyPoints, duration, distance});
              resolve('New Route Saved');
            } else {
              const endPosData = routeExists.value.endPosition[0];
              const endPosParam = endPosition[0];
              if (endPosData[0] === endPosParam[0] && endPosData[1] === endPosParam[1]) {
                this.storage.set(routeExists.key, {startPosition, endPosition, assemblyPoints, duration, distance});
                resolve('Route Updated');
              }
              if (endPosData[0] !== endPosParam[0] || endPosData[1] !== endPosParam[1]) {
                this.storage.set(str, {startPosition, endPosition, assemblyPoints, duration, distance});
                resolve('New Route Saved');
              }
            }
          });
        });
      });
    });
  }

  checkSavedRouteLength(): Promise<number> {
    return new Promise(resolve => {
      let rLength = 0;
      let i = 0;
      this.storage.length().then(length => {
        this.storage.forEach((value, key, index) => {
          const str = key.slice(0, -1);
          if (str === 'Route_') {rLength += 1; }
          i++;
          if (i + 1 === length || i === length) {resolve(rLength); }
        });
      });
    });
  }

  checkifRouteExists(): Promise<any> {
    return new Promise(resolve => {
      this.routingUserService.getstartPoint().then(startPosition => {
        this.routingUserService.getfinishPoint().then(endPosition => {
          this.checkifRouteExistsHelper(startPosition, endPosition).then(x => {
            resolve(x);
          });
        });
      });
    });
  }

  checkifRouteExistsHelper(startPosition, endPosition): Promise<any> {
    return new Promise(resolve => {
      let i = 0;
      let endPointExists: boolean;
      let tempSaveResolveData: { value: any; key: string; index: Number; };
      endPointExists = false;
      this.storage.length().then(length => {
        this.storage.forEach((value, key, index) => {
          const str = key.slice(0, -1);
          if (str === 'Route_') {
            const endPosData = value.endPosition[0];
            const endPosParam = endPosition[0];
            this.checkAddressProximity(endPosData, endPosParam).then(isEndNear => {
              if (isEndNear === true) {
                if (endPosData[0] === endPosParam[0] && endPosParam[1] === endPosData[1]) {
                  endPointExists = true;
                }
                this.checkAddressProximity(value.startPosition[0], startPosition[0]).then(isStartNear => {
                  if (isStartNear === true) {
                    if (endPointExists === true) {
                      resolve({value, key, index});
                    } else {
                      i++;
                      tempSaveResolveData = {value, key, index};
                      if (length === i + 1) {
                        resolve(tempSaveResolveData);
                      }
                    }
                  } else {
                    i++;
                  }
                });
              } else {
                i++;
              }
            });
          } else {
            i++;
          }
          if (length === i + 1 || i === length) {
            if (tempSaveResolveData !== undefined && endPointExists === false) {
              resolve(tempSaveResolveData);
            } else {
              resolve(false);
            }
          }
        });
      });
    });
  }

  checkAddressProximity(address1: number[], address2: turf.helpers.Position): Promise<boolean> {
    return new Promise(resolve => {
      const pt = turf.point(address2);
      const polygon = [];
      let dLatN = 400;
      let dLongN = -400;
      for (let time = 0; time < 4; time++) {
        const R = 6378137;
        const dLat = dLatN / R;
        const dLon = dLongN / (R * Math.cos(Math.PI * address1[0] / 180));
        polygon.push([address1[0] + dLat * 180 / Math.PI, address1[1] + dLon * 180 / Math.PI]);
        if (time === 0) {
          dLongN = 400;
        }
        if (time === 1) {
          dLongN = 400;
          dLatN = -400;
        }
        if (time === 2) {
          dLongN = -400;
        }
      }
      const poly = turf.polygon([[polygon[0], polygon[1], polygon[2], polygon[3], polygon[0]]]);
      resolve(turf.booleanPointInPolygon(pt, poly));
    });
  }

  getAllSavedRoutes(): Promise<any> {
    return new Promise(resolve => {
      const arr = [];
      let i = 0;
      this.storage.length().then(length => {
        this.storage.forEach((value, key, index) => {
          const str = key.slice(0, -1);
          if (str === 'Route_') {
            if (arr.some(route => route.endPosition[1] === value.endPosition[1])) {
            } else {
              arr.push(value);
            }
          }
          i++;
          if (i === length) {
            resolve(arr);
          }
        });
      });
    });
  }



  checkGPSChangeRoutingPosition(): Promise<any> {
    return new Promise(resolve => {
      this.routingUserService.getBoundingArray().then((boundingArray) => {
        this.tempBounding = boundingArray;
          // for time that Interval living -> Go through and check if Position is inside bbox of AP
        this.commandRun = false;
        this.apsBoundaryData = 0;
        this.nextVisitAP = [];
        this.lastVisitedAP = [];
        this.activeBoundary = null;
        let temp = false;
        let checkForNewAP = false;
        const cachePosition = [];
        let lastPosition: any;
        const source = interval(5000);
        this.subscription = source.subscribe(() => {





            // GPS-Blödsinn -> wechseln zwischen APS und senden an Firebase RTDB - Bullshit - Shit Shit and more Shit, but it works
            console.log('Interval Run');
            const userPosition = this.userService.behaviorMyOwnPosition.value;

                // senden an RTDB aktuellen Standort
            if (userPosition === lastPosition) {

            } else {
              this.MapDataFetchService.sendUserPosition();
            }
            lastPosition = userPosition;

            const pt = turf.point([userPosition.coords.longitude, userPosition.coords.latitude]);

            if (this.ended === true) {
              this.deleteAllRTDB_Entries();
              this.subscription.unsubscribe();
              resolve(false);
            } else {
            // go through bboxArray
            for (let i = 0; i < boundingArray.length; i++) {
              // check if position is inside of Element i-BBOX / is near i-AssemblyPoint
              const bool = turf.booleanPointInPolygon(pt, boundingArray[i].polygon);
              // yes inside
              if (bool === true ) {
                if (this.activeBoundary === true) {
                  // wait
                  this.apsBoundaryData = i;
                  console.log('WAITING');

                  if (boundingArray[i].name === 'start') {
                    if (temp === false) {
                      boundingArray.forEach(element => {
                        const bool = turf.booleanPointInPolygon(pt, element.polygon);
                        if (bool === true && element.name != 'start') {
                          console.log('Inside AP and Start');
                          this.userService.updateNextApTimingToRTDB(userPosition.timestamp, 0, boundingArray[i + 1].name, boundingArray[i + 2].name);
                          checkForNewAP = false;
                          this.lastVisitedAP = [ boundingArray[i + 1].name, boundingArray[i + 2].name];
                          temp = true;
                        }
                      });
                    }
                  }

                  if (boundingArray[i].name != 'start' && boundingArray.length == i + 1 ) {
                    console.log('Ziel erreicht');
                    checkForNewAP = false;
                    this.commandRun = true;
                    this.deleteAllRTDB_Entries();
                    this.subscription.unsubscribe();
                    resolve(true);
                  }
                } else {
                  if (this.commandRunInside == false) {
                    if (this.apsBoundaryData == null || this.apsBoundaryData == undefined) {
                      console.log('New Inside Start');

                      this.commandRunInside = true;
                      this.commandRun = false;
                      checkForNewAP = false;
                      const bool = turf.booleanPointInPolygon(pt, boundingArray[i + 1].polygon);
                      if (bool == true) {
                      this.apsBoundaryData = i + 1;
                    } else {
                      this.apsBoundaryData = i;
                    }

                    } else {
                      if (boundingArray[i].name != 'start') {
                        this.CurrentApNumber.next(i);
                      }
                      const n = this.apsBoundaryData;
                      this.apsBoundaryData = i;
                      if (boundingArray.length > n + 2 ) {
                          console.log('NEW INSIDE');
                          this.activeBoundary = true;
                          checkForNewAP = false;
                          if (boundingArray[i].name != this.nextVisitAP[0] && boundingArray[i].name != 'start') {
                            console.log('not expected next AP');
                            console.log(this.nextVisitAP);
                            console.log(this.lastVisitedAP);
                            this.userService.deleteOldApTimingtoRTDB(this.nextVisitAP[0], this.nextVisitAP[1]);
                            this.userService.deleteOldApTimingtoRTDB(this.lastVisitedAP[0], this.lastVisitedAP[1]);
                            this.nextVisitAP = [];
                            }
                          if (boundingArray.length - 2 == i) {
                              this.userService.updateNextApTimingToRTDB(userPosition.timestamp, 0, boundingArray[i].name, 'lastAP');
                              this.nextVisitAP = [boundingArray[i].name, 'lastAP'];
                            } else {
                              this.userService.updateNextApTimingToRTDB(userPosition.timestamp, 0, boundingArray[i].name, boundingArray[i + 1].name);
                            }
                          this.commandRunInside = true;
                          this.commandRun = false;
                          this.apsVisitedData.push(i);

                      }
                    }
                  }
                }

              } else {
                if (this.apsBoundaryData == null) {resolve(false); }
                if (this.commandRun == false) {

                  const bool = turf.booleanPointInPolygon(pt, boundingArray[this.apsBoundaryData].polygon);
                  if (bool != true) {
                    if (this.apsBoundaryData != 0) {
                      const n = this.apsBoundaryData;

                      if (this.APsubscription === true && checkForNewAP === false) {
                        console.log('unsub');
                        this.userDataFetchService.rtdb_getDetailsAP_unsub();
                        this.APsubscription = false;
                      }
                      if (boundingArray.length > n + 2) {
                        console.log('JUST LEFT');
                        console.log(boundingArray[i + 1].name);
                        console.log(n);
                        if (this.APsubscription === false) {
                          if (boundingArray.length > n + 3  ) {
                            console.log('t1');
                            this.ToApNumber.next(n + 1);
                            this.userService.getDetailsToAP(boundingArray[n + 1].name, boundingArray[n + 2].name, true, userPosition.timestamp);
                            this.APsubscription = true;
                            checkForNewAP = true;
                          } else if (boundingArray.length === n + 3) {
                            console.log('t2');
                            this.userService.getDetailsToAP(boundingArray[n + 1].name, boundingArray[n + 2].name, false, userPosition.timestamp);
                            this.APsubscription = true;
                            checkForNewAP = true;
                          }
                        }
                        if (boundingArray[n].name !== 'start') {
                          console.log(this.lastVisitedAP);
                          this.userService.deleteOldApTimingtoRTDB(this.lastVisitedAP[0], this.lastVisitedAP[1]);
                          this.userService.deleteOldApTimingtoRTDB(this.nextVisitAP[0], this.nextVisitAP[1]);
                        }
                        this.ToApNumber.next(n + 1);
                        if (boundingArray.length === n + 3) {

                          this.apsVisitedData.push(i);
                          this.userService.updateNextApTimingToRTDB(userPosition.timestamp, boundingArray[n].duration, boundingArray[n + 1].name, 'lastAP');
                        // this.lastVisitedAP=[boundingArray[i].name,"lastAP"]
                          this.nextVisitAP = [boundingArray[i + 1].name, 'lastAP'];
                        } else {
                        this.userService.updateNextApTimingToRTDB(userPosition.timestamp, boundingArray[n].duration, boundingArray[n + 1].name, boundingArray[n + 2].name);
                      // this.lastVisitedAP=[boundingArray[i+1].name,boundingArray[i + 2].name]
                        this.nextVisitAP = [boundingArray[n + 1].name, boundingArray[n + 2].name];
                        this.lastVisitedAP = [boundingArray[n].name, boundingArray[n + 1].name];
                        }
                        this.apsVisitedData.push(i);
                        this.activeBoundary = false;
                        this.commandRun = true;
                        this.commandRunInside = false;
                      } else {
                        console.log('FINISH LEFT');
                        this.ToApNumber.next(n + 1);
                        this.apsVisitedData.push(i);
                        if (this.lastVisitedAP !== []) {
                          this.userService.deleteOldApTimingtoRTDB(this.lastVisitedAP[0], this.lastVisitedAP[1]);
                          this.lastVisitedAP = [];
                        }
                        if (this.nextVisitAP !== []) {
                          this.userService.deleteOldApTimingtoRTDB(this.nextVisitAP[0], this.nextVisitAP[1]);
                          this.nextVisitAP = [];
                        }
                        this.commandRun = true;
                      }
                      } else {
                          console.log('JUST LEFT Start');
                          this.ToApNumber.next(1);
                          this.userService.updateNextApTimingToRTDB(userPosition.timestamp, boundingArray[0].duration, boundingArray[1].name, boundingArray[ 2].name);
                          this.nextVisitAP = [boundingArray[1].name, boundingArray[2].name];
                          this.activeBoundary = false;
                          this.commandRun = true;
                          this.commandRunInside = false;
                          if (this.APsubscription === false) {
                            if (boundingArray.length > i + 2  ) {
                              console.log('t4');
                              this.userService.getDetailsToAP(boundingArray[i + 1].name, boundingArray[i + 2].name, true, userPosition.timestamp);
                              this.APsubscription = true;
                              checkForNewAP = true;
                            } else if (boundingArray.length === i + 2) {
                              console.log('t5');
                              this.userService.getDetailsToAP(boundingArray[i + 1].name, boundingArray[i + 2].name, false, userPosition.timestamp);
                              this.APsubscription = true;
                              checkForNewAP = true;
                            }
                          }
                        }
                      }
                  }
                }

              }
            }
           });
      });
    });
    }

    deleteAllRTDB_Entries() {
      if (this.lastVisitedAP !== []) {
        this.userService.deleteOldApTimingtoRTDB(this.lastVisitedAP[0], this.lastVisitedAP[1]);
        this.lastVisitedAP = [];
      }
      if (this.nextVisitAP !== []) {
        this.userService.deleteOldApTimingtoRTDB(this.nextVisitAP[0], this.nextVisitAP[1]);
        this.nextVisitAP = [];
      }
      if (this.subscription != null) {
        this.subscription.unsubscribe();
      }
      this.lastVisitedAP = [];
      this.nextVisitAP = [];
      this.ended = true;
      this.apsBoundaryData = null;
      this.commandRun = false;
      this.apsBoundaryData = null;
      this.apsVisitedData = [];
      this.commandRunInside = false;
      this.activeBoundary = null;
      this.commandRun = false;
      this.commandRunInside = false;
      this.ended = false;
      this.ToApNumber.next(null);
      this.CurrentApNumber.next(null);
    }

    // can be used for other locations when parameters are defined
    calculateBBBox(latitude: number, longitude: number) {
      const bbox = [];
      const latD = this.deg2rad(latitude);
      const lonD = this.deg2rad(longitude);
      // halfSide is half-length of boundingbox in meteres
      const halfSide = 1000 * 20;

      // Radius of Earth at given latitude
      const radius = this.WGS84EarthRadius(latD);
      // Radius of the parallel at given latitude
      const pradius = radius * Math.cos(latD);

      bbox.push(this.rad2deg(lonD - halfSide / radius));
      bbox.push(this.rad2deg(latD - halfSide / radius));
      bbox.push(this.rad2deg(lonD + halfSide / pradius));
      bbox.push(this.rad2deg(latD + halfSide / pradius));
      return(bbox);
    }

    // Earth radius at a given latitude, according to the WGS-84 ellipsoid [m]
    WGS84EarthRadius(lati: number): number {
      const WGS84A = 6378137.0;
      const WGS84B = 6356752.3;

      const An = WGS84A * WGS84B * Math.cos(lati);
      const Bn = WGS84B * WGS84B * Math.sin(lati);
      const Ad = WGS84A * Math.cos(lati);
      const Bd = WGS84B * Math.sin(lati);
      return Math.sqrt((An * An + Bn * Bn) / (Ad * Ad + Bd * Bd));
    }

    // degrees to radians
    deg2rad(degrees: number): number {
      return Math.PI * degrees / 180.0;
    }

    // radians to degrees
    rad2deg(radians: number): number {
      return 180.0 * radians / Math.PI;
    }

    searchAddress(query: string) {
        const myPosition = this.userService.behaviorMyOwnPosition.value;
        const bbox = this.calculateBBBox(myPosition.coords.latitude, myPosition.coords.longitude);
        return this.http.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + query +
        '.json?autocomplete?types=address&country=de&bbox=' + bbox[0] + ',' + bbox[1] + ',' + bbox[2] + ',' + bbox[3] +
        '&access_token=' + environment.mapbox.accessToken)
        .pipe(map((res: MapboxOutput) => {
        return res.features;
      }));
      }
}
