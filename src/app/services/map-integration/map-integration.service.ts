import { UserService } from './../user/user.service';
import { RoutingGeoAssemblyPoint,MapboxOutput,Feature } from '../../Classess/map/map';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
const MAP_KEY = 'map-reload-token';
import * as turf from '@turf/turf'
import { RoutingUserService } from '../routing-user/routing-user.service';

@Injectable({
  providedIn: 'root'
})

export class MapIntegrationService {
  private bbMinLongi: number;
  private bbMinLati: number;
  private bbMaxLongi: number;
  private bbMaxLati: number;

  constructor(private storage: Storage, private routingUserService: RoutingUserService,
              private http: HttpClient, private userService: UserService) {
  }
  saveRouteOffline(startPosition: number[], endPosition: RoutingGeoAssemblyPoint, assemblyPoints: RoutingGeoAssemblyPoint[],
                   duration: number, distance: number): Promise<any> {
    return new Promise(resolve => {
      let i=0;
      this.checkifRouteExists().then(routeExists=>{
        this.checkSavedRouteLength().then(rLength=>{
          this.storage.forEach((value,key,index)=>{
            let str = "Route_"+(rLength+1);
            if(routeExists==false){
              let str = "Route_"+(rLength+1);
                 this.storage.set(str,{startPosition,endPosition,assemblyPoints,duration,distance})
                resolve("New Route Saved"); 
            }
            else{
              let endPosData=routeExists.value.endPosition[0];
              let endPosParam=endPosition[0];
              if(endPosData[0]==endPosParam[0] && endPosData[1]==endPosParam[1]){
                this.storage.set(routeExists.key,{startPosition,endPosition,assemblyPoints,duration,distance});
                resolve("Route Updated");
              } 
              if(endPosData[0]!=endPosParam[0] || endPosData[1]!=endPosParam[1]){
                this.storage.set(str,{startPosition,endPosition,assemblyPoints,duration,distance});
                resolve("New Route Saved");
              }
            }
          })
        })
      })
    });
  }

  checkSavedRouteLength():Promise<number>{     
    return new Promise(resolve => {
      var rLength=0;
      var i=0;
      this.storage.length().then(length=>{
        this.storage.forEach((value,key,index)=>{
          let str = key.slice(0, -1); 
          if(str === "Route_"){rLength+=1;}
          i++;
          if(i+1==length || i==length){resolve(rLength);}
        });
      });
    });
  }

  checkifRouteExists():Promise<any>{
    return new Promise(resolve => {
      this.routingUserService.getstartPoint().then(startPosition=>{
        this.routingUserService.getfinishPoint().then(endPosition=>{
          this.checkifRouteExistsHelper(startPosition,endPosition).then(x=>{
            console.log(startPosition+" | "+ endPosition + " | "+x)
            resolve(x);
          })
        })
      })
    })
  }

  checkifRouteExistsHelper(startPosition,endPosition):Promise<any>{
    return new Promise(resolve => {
      let i=0;
      let endPointExists;
      let tempSaveResolveData;
      endPointExists=false;
      this.storage.length().then(length=>{
        this.storage.forEach((value,key,index)=>{
          let str = key.slice(0, -1); 
          if(str == "Route_"){
            let endPosData=value.endPosition[0];
            let endPosParam=endPosition[0];
            this.checkAddressProximity(endPosData,endPosParam).then(isEndNear=>{
              if(isEndNear==true){
                if(endPosData[0] ==endPosParam[0] && endPosParam[1]==endPosData[1]){
                  endPointExists=true;
                }
                this.checkAddressProximity(value.startPosition[0],startPosition[0]).then(isStartNear=>{
                  if(isStartNear==true){
                    if(endPointExists==true){
                      resolve({value:value,key:key,index:index});
                    } else{
                      i++
                      tempSaveResolveData={value:value,key:key,index:index};
                      if(length==i+1){
                        resolve(tempSaveResolveData);
                      }
                    } 
                  }else{
                    i++;
                  }
                })
              } else{
                i++;
              }
            })             
          }else{
            i++; 
          }
          if(length==i+1||i==length){
            if(tempSaveResolveData!=undefined && endPointExists==false){
              resolve(tempSaveResolveData);
            }else{
              resolve(false); 
            }
          }
        });
      })
    })
  }

  checkAddressProximity(adress1, adress2): Promise<boolean> {
    return new Promise(resolve => {
      const pt = turf.point(adress2);
      const polygon = [];
      let dLatN = 400;
      let dLongN = -400;
      for(let time = 0; time < 4 ; time++) {
        let R=6378137;
        let dLat =dLatN/R;
        let dLon =dLongN/(R*Math.cos(Math.PI*adress1[0]/180));
        polygon.push([adress1[0]+dLat*180/Math.PI, adress1[1]+dLon*180/Math.PI]);
        if(time==0){
          dLongN=400;
        }
        if(time==1){
          dLongN=400;
          dLatN=-400;
        }
        if(time==2){
          dLongN=-400;
        }
      }
      var poly = turf.polygon([[polygon[0],polygon[1],polygon[2],polygon[3],polygon[0]]]);
      resolve(turf.booleanPointInPolygon(pt,poly));
    });
  }

  // can be used for other locations when parameters are defined
  async calculateBBBox() {
    const myPosition = await this.userService.getUserPosition();

    const latD = this.deg2rad(myPosition.position.latitude);
    const lonD = this.deg2rad(myPosition.position.longitude);
    // halfSide is half-length of boundingbox in meteres
    const halfSide = 1000 * 20;

    // Radius of Earth at given latitude
    const radius = this.WGS84EarthRadius(latD);
    // Radius of the parallel at given latitude
    const pradius = radius * Math.cos(latD);

    this.bbMinLongi = this.rad2deg(lonD - halfSide / radius);
    this.bbMinLati = this.rad2deg(latD - halfSide / radius);
    this.bbMaxLongi = this.rad2deg(lonD + halfSide / pradius);
    this.bbMaxLati = this.rad2deg(latD + halfSide / pradius);
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

  searchAddress(query: string){
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

    this.calculateBBBox();
    // TODO: include BBbox coordinates into url

    return this.http.get(url + query + '.json?autocomplete?types=address&country=de&access_token=' + environment.mapbox.accessToken)
      .pipe(map((res: MapboxOutput) => {
        return res.features;
    }));
  }
}
