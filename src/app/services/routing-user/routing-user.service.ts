import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { RoutingGeoAssemblyPoint,PolygonAssemblyPoint } from 'src/app/Classess/map/map';
import * as turf from '@turf/turf'



@Injectable({
  providedIn: 'root'
})
export class RoutingUserService {

 // TODO: fix all type safety

  private finishPoint: RoutingGeoAssemblyPoint = null;
  private startPoint: any= null;
  private duration: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private distance: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private points: RoutingGeoAssemblyPoint[] = [];
  private centerPoint: BehaviorSubject<RoutingGeoAssemblyPoint> = new BehaviorSubject<RoutingGeoAssemblyPoint>(null);
  private displayType: BehaviorSubject<string> = new BehaviorSubject<string>('MainView');
  private boundingArray: PolygonAssemblyPoint[]=[];
  private pointsDetailed: any=null;
  public routeFinished: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private userService: UserService) { }

  getBoundingArray():Promise<any>{
      this.boundingArray=[];
    return new Promise(resolve=>{
      for(let i=0;i<this.points.length;i++){
        this.createPolygon([this.points[i].position.longitude,this.points[i].position.latitude]).then(poly=>{
          const duration = this.pointsDetailed[i].duration/60;
          const distance = this.pointsDetailed[i].distance*0.001;
          this.boundingArray.push(new PolygonAssemblyPoint(this.points[i].name,Number((Math.round(distance * 100) / 100).toFixed(1)),Number((Math.round(duration * 100) / 100).toFixed(0)),poly));
        })
        if(i+1==this.points.length){
          this.createPolygon([this.finishPoint[0][0],this.finishPoint[0][1]]).then(poly=>{
            const duration = this.pointsDetailed[i+1].duration/60;
            const distance = this.pointsDetailed[i+1].distance*0.001;
            let finishAddress = this.finishPoint[1].split(",")[0];
            this.boundingArray.push(new PolygonAssemblyPoint(finishAddress,Number((Math.round(distance * 100) / 100).toFixed(1)),Number((Math.round(duration * 100) / 100).toFixed(0)),poly));
            resolve(this.boundingArray);
          })
        }
      }
    });
  }

  createPolygon(address):Promise<any>{
    return new Promise(resolve => {
      let polygon=[];
      let dLatN=100;
      let dLongN=-100;
      for(let time=0;time<4;time++){
        let R=6378137;
        let dLat =dLatN/R;
        const dLon =dLongN/(R*Math.cos(Math.PI*address[0]/180));
        polygon.push([address[0]+dLat*180/Math.PI, address[1]+dLon*180/Math.PI]);
        if(time==0){
          dLongN=100;
        }
        if(time==1){
          dLongN=100;
          dLatN=-100;
        }
        if(time==2){
          dLongN=-100;
        }
      }
      var poly = turf.polygon([[polygon[0],polygon[1],polygon[2],polygon[3],polygon[0]]]);
      resolve(poly)
    });
  }

  setPointsDetailed(points:any):Promise<any>{
    return new Promise(resolve=>{
      this.pointsDetailed=points;
      resolve();
    });
  }

  getPointsDetailed():Promise<any>{
    return new Promise(resolve=>{
      resolve(this.pointsDetailed);
    });
  }

  getDisplayType(): Promise<any> {
    return new Promise(resolve => {
        resolve(this.displayType);
    });
  }

  setRouteFinished(){
    this.routeFinished.next(false);
  }

  setDisplayType(dataPoint:string): Promise<any> {
    return new Promise(resolve => {
        this.displayType.next(dataPoint);
        resolve(this.displayType);
    });
  }

  getDisplayTypeObs(): Observable<string> {
    return this.displayType.asObservable();
  }

  resetAll(){
    this.setDuration(null);
    this.setDistance(null);
    this.setFinishPoint(undefined);
    this.setStartPoint([]);
    this.setPoints([]);
    this.boundingArray=[];
  }

  getfinishPoint(): Promise<any> {
    return new Promise(resolve => {
      if (this.finishPoint != undefined || this.finishPoint != null) {
        resolve(this.finishPoint);
      }
      resolve(false);
    });
  }

  getDuration(): Promise<any> {
    return new Promise(resolve => {
      if (this.duration != null) {
        resolve(this.duration.getValue());
      }
      resolve(false);
    });
  }

  getDurationasSub(): Observable<string> {
    return this.duration;
  }

  getDistanceasSub(): Observable<string> {
    return this.distance;
  }

  getDistance(): Promise<any> {
    return new Promise(resolve => {
      if (this.distance != null) {
        resolve(this.distance.getValue());
      }
      resolve(false);
    });
  }

  getPoints(): Promise<any> {
    return new Promise(resolve => {
      if (this.points != null) {
        resolve(this.points);
      }
      resolve(false);
    });
  }

  getstartPoint(): Promise<number[]>{
    return new Promise(resolve => {
        this.setStartPoint().then(() => {
          resolve(this.startPoint);
        });
    });
  }

  setFinishPoint(dataPoint): Promise<boolean> {
    return new Promise(resolve => {
      this.finishPoint = dataPoint;
      resolve(true);
    });
  }

  setDuration(dataPoint?: number): Promise<any> {
    return new Promise(resolve => {
      try{
      if (dataPoint != null) {
        const temp = (Math.round(dataPoint * 100) / 100).toFixed(0);  //toFixed(2) = 2 decimal Places
        this.duration.next(temp);
        console.log('Duration set to: ' + this.duration.getValue());
        resolve(true);
      }
    } catch(e) {
        console.log(e);
        resolve(false);
    }
    });
  }

  setDistance(dataPoint?: number): Promise<any> {
    return new Promise(resolve => {
      try {
      if (dataPoint != null){
        const temp = (Math.round(dataPoint * 100) / 100).toFixed(2);
        this.distance.next(temp);
        console.log('Distance set to: ' + this.distance.getValue());
        resolve(true);
      }
    } catch(e) {
        console.log(e);
        resolve(false);
    }
    });
  }

  setPoints(dataPoint?): Promise<boolean>{
    return new Promise(resolve => {
      try{
        if (dataPoint != null){
            if(this.points.includes(dataPoint)){
              resolve(false);
            } else{
              this.points.push(dataPoint);
              resolve(true);
            }
        }
      } catch(e) {
          console.log(e);
          resolve(false);
      }
    });
  }

  deletePoints(pointNumber: number): Promise<boolean> {
    return new Promise(resolve => {
      try{
        if(pointNumber!=null){
          let t = this.points.length;
          for(let i=pointNumber;i<=t;i++){
            for(let k=0;k<this.points.length;k++){
              if(this.points[k].textField==i.toString()){
                this.points.splice(k,1);
              }
            }
          }
          resolve(true);
        }
      }catch(e){
        console.log(e);
        resolve(false);
      }
    });
  }

  deleteAllPoints(): Promise<boolean>{
    return new Promise(resolve => {
      this.points = [];
      resolve(true);
    });
  }

  setStartPoint(dataPoint?): Promise<boolean> {
    return new Promise(resolve => {
      if(dataPoint != undefined){
        this.startPoint = dataPoint;
        resolve(true);
      } else{
          this.startPoint = [[this.userService.behaviorMyOwnPosition.value.coords.longitude,this.userService.behaviorMyOwnPosition.value.coords.latitude]];
          resolve(true);
      }
    });
  }

  addAssemblyPoint(dataPoint: RoutingGeoAssemblyPoint): Promise<any> {
    return new Promise(resolve => {
      this.centerPoint.next(dataPoint);
      resolve(this.centerPoint);
    });
  }

  getCenterPointObs(): Observable<RoutingGeoAssemblyPoint> {
    return this.centerPoint.asObservable();
  }
}
