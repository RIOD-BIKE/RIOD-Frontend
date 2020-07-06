import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { RoutingGeoAssemblyPoint } from 'src/app/Classess/map/map';




@Injectable({
  providedIn: 'root'
})
export class RoutingUserService {


  private finishPoint: RoutingGeoAssemblyPoint = null;
  private startPoint: any= null;
  private duration: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private distance: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private points: RoutingGeoAssemblyPoint [] = [];
  private centerPoint: BehaviorSubject<RoutingGeoAssemblyPoint> = new BehaviorSubject<RoutingGeoAssemblyPoint>(null);
  private displayType: BehaviorSubject<string> = new BehaviorSubject<string>('MainView');

  public routeFinished: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private userService: UserService) { }

  getDisplayType(): Promise<any> {
    return new Promise(resolve => {
        resolve(this.displayType);
    });
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
    this.setStartPoint(undefined);
    this.setPoints([]);
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

  // SearchBar and Modifier in Routing-Detail-View use
  setFinishPoint(dataPoint): Promise<boolean> {
    return new Promise(resolve => {
      this.finishPoint = dataPoint;
      resolve(true);
    });
  }

  setDuration(dataPoint?: number): Promise<any> {
    console.log('check1');
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
        const temp = this.userService.behaviorMyOwnPosition.getValue().coords;
        this.startPoint = [[temp.longitude,temp.latitude]];
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
