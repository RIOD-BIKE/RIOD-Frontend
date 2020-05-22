import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { RoutingGeoAssemblyPoint } from 'src/app/Classess/map/map';



@Injectable({
  providedIn: 'root'
})
export class RoutingUserService {


  private finishPoint:any=null;
  private startPoint:any=null;
  private centerPoint:BehaviorSubject<RoutingGeoAssemblyPoint>=new BehaviorSubject<RoutingGeoAssemblyPoint>(null);
  constructor(private userService: UserService) { }


  getfinishPoint():Promise<any>{
    return new Promise(resolve => {
      if (this.finishPoint!==null){
        resolve(this.finishPoint);
      }
      resolve(false);
    });
  }

  getstartPoint():Promise<any>{
    return new Promise(resolve => {
      if(this.startPoint!==null){
        resolve(this.startPoint);
      }
    });
  }

  displayRoute():Promise<any>{
    return new Promise(resolve => {
    
      resolve();
    });
  }


  createRoute():Promise<any>{
    return new Promise(resolve => {

      resolve();
    });
  }


  //SearchBar and Modifier in Routing-Detail-View use
  setFinishPoint(dataPoint):Promise<any>{
    return new Promise(resolve => {
      //this.finishPoint= dataPoint;
      this.finishPoint=[[8.063165,52.281136],["Richardstraße 9, 49074 Osnabrück, Germany"]];  //TEMP - To not obstruct view, because in Main-menu overview Variable wont update with ngModel from start() function
      console.log("FinishPoint nexted: "+dataPoint);
      resolve();
    });
  }

  setStartPoint(dataPoint?):Promise<any>{
    return new Promise(resolve => {
      if(dataPoint){
        this.startPoint= dataPoint;
        
        console.log("Startpoint nexted: "+this.startPoint);
      } else{
        this.startPoint=this.userService.behaviorMyOwnPosition.value;
        console.log("Startpoint Own GPS nexted: "+this.startPoint);
      }
      resolve();
    });
  }

  printStartFinishPoint():Promise<any>{
    return new Promise(resolve => {

      resolve();
    });
  }



  addAssemblyPoint(dataPoint:RoutingGeoAssemblyPoint){
    console.log("NewAssemblyPointAdded"+dataPoint);
    this.centerPoint.next(dataPoint);
    console.log(this.centerPoint.value);
  }

  getCenterPointObs(): Observable<RoutingGeoAssemblyPoint> {
    console.log("getPointObs");
    return this.centerPoint.asObservable();
  }
}
