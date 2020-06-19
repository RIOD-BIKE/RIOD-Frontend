import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { RoutingGeoAssemblyPoint } from 'src/app/Classess/map/map';




@Injectable({
  providedIn: 'root'
})
export class RoutingUserService {


  private finishPoint: any = null;
  private startPoint: any = null;
  private duration: any = null;
  private distance: any = null;
  private points: RoutingGeoAssemblyPoint [] = [];
  private centerPoint: BehaviorSubject<RoutingGeoAssemblyPoint> = new BehaviorSubject<RoutingGeoAssemblyPoint>(null);
  private displayType: BehaviorSubject<string> = new BehaviorSubject<string>('MainView');
  constructor(private userService: UserService) { }

  getDisplayType(): Promise<any> {
    return new Promise(resolve => {
        resolve(this.displayType);
    });
  }

  setDisplayType(dataPoint): Promise<any> {
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
      if (this.finishPoint != null) {
        resolve(this.finishPoint);
      }
      resolve(false);
    });
  }
  getDuration(): Promise<any> {
    return new Promise(resolve => {
      console.log(this.duration);
      if (this.duration != null) {
        resolve(this.duration);
      }
      resolve(false);
    });
  }
  getDistance(): Promise<any> {
    return new Promise(resolve => {
      if (this.distance != null) {
        resolve(this.distance);
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

  getstartPoint(): Promise<any>{
    return new Promise(resolve => {
      if(this.startPoint !== undefined) {
        resolve(this.startPoint);
      } else{
        this.setStartPoint().then(() => {
          resolve(this.startPoint);
        });
      }
    });
  }

  // SearchBar and Modifier in Routing-Detail-View use
  setFinishPoint(dataPoint): Promise<any> {
    return new Promise(resolve => {
      this.finishPoint = dataPoint;

      console.log('FinishPoint nexted: '+dataPoint);
      resolve(true);
    });
  }

  setDuration(dataPoint?: number): Promise<any> {
    console.log('check1');
    return new Promise(resolve => {
      try{
      if (dataPoint != null) {
        const temp = (Math.round(dataPoint * 100) / 100).toFixed(0);  //toFixed(2) = 2 decimal Places
        this.duration=temp;
        console.log('Duration set to: '+this.duration);
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
        this.distance = temp;
        console.log('Distance set to: '+this.distance);
        resolve(true);
      }
    } catch(e) {
      console.log(e);
      resolve(false);
    }

    });
  }
  setPoints(dataPoint?): Promise<any>{
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

  deletePoints(pointNumber:number):Promise<any>{
    return new Promise(resolve => {
      try{
        if(pointNumber!=null){
          let t = this.points.length;
          for(let i=pointNumber;i<=t;i++){
            //löschen aller Einträge bis PointNUmber-1
            for(let k = 0;k<this.points.length;k++){
              if(this.points[k].textField==i.toString()){
                this.points.splice(k,1);
              }
            }
          }
          resolve();

        }
      }catch(e){
      console.log(e);
      resolve(false);
      }
    });
  }

  deleteAllPoints(): Promise<any>{
    return new Promise(resolve => {
      this.points = [];
      resolve();
    });
  }

  setStartPoint(dataPoint?): Promise<any> {
    return new Promise(resolve => {
      if(dataPoint !== undefined){
        this.startPoint = dataPoint;
        console.log('Startpoint nexted: '+ this.startPoint);
        resolve();
      } else{
        const temp = this.userService.behaviorMyOwnPosition.getValue().coords;
        this.startPoint = [[temp.longitude,temp.latitude]];
        console.log(`Startpoint Own GPS nexted: ${this.startPoint}`);
        resolve();
      }
    });
  }




  addAssemblyPoint(dataPoint: RoutingGeoAssemblyPoint): Promise<any> {
    return new Promise(resolve => {
    console.log("NewAssemblyPointAdded"+dataPoint);
    this.centerPoint.next(dataPoint);
    console.log(this.centerPoint.value);
    resolve(this.centerPoint);
    });
  }

  getCenterPointObs(): Observable<RoutingGeoAssemblyPoint> {
    console.log("getPointObs");
    return this.centerPoint.asObservable();
  }
}
