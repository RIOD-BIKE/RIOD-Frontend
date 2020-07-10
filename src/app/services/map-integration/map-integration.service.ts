import { RoutingGeoAssemblyPoint, MapboxOutput, Feature, PolygonAssemblyPoint } from '../../Classess/map/map';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
const MAP_KEY = 'map-reload-token';
import * as turf from '@turf/turf';
import { RoutingUserService } from '../routing-user/routing-user.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})

export class MapIntegrationService {
  constructor(private userService: UserService, private storage: Storage, private routingUserService: RoutingUserService, private http: HttpClient) {
  }

  private apsBoundaryData: number[] = [];
  private apDetail;

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
              if (endPosData[0] == endPosParam[0] && endPosData[1] == endPosParam[1]) {
                this.storage.set(routeExists.key, {startPosition, endPosition, assemblyPoints, duration, distance});
                resolve('Route Updated');
              }
              if (endPosData[0] != endPosParam[0] || endPosData[1] != endPosParam[1]) {
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
          if (i + 1 == length || i == length) {resolve(rLength); }
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
      let endPointExists;
      let tempSaveResolveData;
      endPointExists = false;
      this.storage.length().then(length => {
        this.storage.forEach((value, key, index) => {
          const str = key.slice(0, -1);
          if (str == 'Route_') {
            const endPosData = value.endPosition[0];
            const endPosParam = endPosition[0];
            this.checkAddressProximity(endPosData, endPosParam).then(isEndNear => {
              if (isEndNear == true) {
                if (endPosData[0] == endPosParam[0] && endPosParam[1] == endPosData[1]) {
                  endPointExists = true;
                }
                this.checkAddressProximity(value.startPosition[0], startPosition[0]).then(isStartNear => {
                  if (isStartNear == true) {
                    if (endPointExists == true) {
                      resolve({value, key, index});
                    } else {
                      i++;
                      tempSaveResolveData = {value, key, index};
                      if (length == i + 1) {
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
          if (length == i + 1 || i == length) {
            if (tempSaveResolveData != undefined && endPointExists == false) {
              resolve(tempSaveResolveData);
            } else {
              resolve(false);
            }
          }
        });
      });
    });
  }

  checkAddressProximity(address1, address2): Promise<boolean> {
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
        if (time == 0) {
          dLongN = 400;
        }
        if (time == 1) {
          dLongN = 400;
          dLatN = -400;
        }
        if (time == 2) {
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
          if (str == 'Route_') {
            if (arr.some(route => route.endPosition[1] == value.endPosition[1])) {
            } else {
              arr.push(value);
            }
          }
          i++;
          if (i == length) {
            resolve(arr);
          }
        });
      });
    });
  }



  checkGPSChangeRoutingPosition(): Promise<any> {
    return new Promise(resolve => {
      this.routingUserService.getBoundingArray().then((boundingArray) => {
          // for time that Interval living -> Go through and check if Position is inside bbox of AP
          setInterval(() => {
            const userPosition = this.userService.behaviorMyOwnPosition.value;
            const pt = turf.point([userPosition.coords.longitude, userPosition.coords.latitude]);
            // go through bboxArray
            for (let i = 0; i < boundingArray.length; i++) {
              // check if position is inside of Element i-BBOX / is near i-AssemblyPoint
              const bool = turf.booleanPointInPolygon(pt, boundingArray[i].polygon);
              // yes inside
              if (bool == true) {
                if (!this.apsBoundaryData.includes(i)) {  // check if number is included inside local Array
                  if (i + 2 >= boundingArray.length) {  // check if the momentary AssemblyPoint where the User is the second-last one before the finish / next AP ends route via RIOD-Together
                    this.apsBoundaryData.push(i);
                    this.userService.updateNextApTimingToRTDB(userPosition.timestamp, boundingArray[i].duration, boundingArray[i].name, 'lastAP'); // write to RTDB last
                  } else {
                    this.apsBoundaryData.push(i); // is just a regular next AP - so write inside the APName of RTDB, the duration till you are there[inside the next sub-AP] and the current timestamp
                    this.userService.updateNextApTimingToRTDB(userPosition.timestamp, boundingArray[i].duration, boundingArray[i].name, boundingArray[i + 1].name);
                  }
                }
                if (this.apsBoundaryData.length > 1) {
                  this.apsBoundaryData.reverse();
                  const n = this.apsBoundaryData.pop();
                  if (n + 2 >= boundingArray.length) {
                    this.userService.deleteOldApTimingtoRTDB(boundingArray[n].name, 'lastAP');
                  } else {
                    this.userService.deleteOldApTimingtoRTDB(boundingArray[n].name, boundingArray[n + 1].name);
                  }
                }
              }
            }
            // Send Position to RTDB
          }, 5000); // every 5 sec
      });
    });
  }

    // can be used for other locations when parameters are defined
    calculateBBBox(latitude, longitude) {
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
        return this.http.get('https://api.mapbox.com/geocoding/v5/mapbox.places#/' + query +
        '.json?autocomplete?types=address&country=de&bbox=' + bbox[0] + ',' + bbox[1] + ',' + bbox[2] + ',' + bbox[3] +
        '&access_token=' + environment.mapbox.accessToken)
        .pipe(map((res: MapboxOutput) => {
        return res.features;
      }));

    }
}
