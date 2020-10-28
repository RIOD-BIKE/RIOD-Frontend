import { DisplayService } from './../display/display.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { RoutingGeoAssemblyPoint, PolygonAssemblyPoint } from 'src/app/Classess/map/map';
import * as turf from '@turf/turf';



@Injectable({
  providedIn: 'root'
})
export class RoutingUserService {


  private finishPoint: RoutingGeoAssemblyPoint = null;
  private startPoint: any = null;
  private duration: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private distance: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private points: RoutingGeoAssemblyPoint[] = [];
  private centerPoint: BehaviorSubject<RoutingGeoAssemblyPoint> = new BehaviorSubject<RoutingGeoAssemblyPoint>(null);
  private displayType: BehaviorSubject<string> = new BehaviorSubject<string>('MainView');
  private displaySwitchCase: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private displayManuelShow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private displayRoutingStart: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private boundingArray: PolygonAssemblyPoint[] = [];
  private pointsDetailed: any = null;
  public routeFinished: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // TODO maybe replace points with pointsBehaviorSubject
  public pointsBehaviorSubject: BehaviorSubject<RoutingGeoAssemblyPoint[]> = new BehaviorSubject<RoutingGeoAssemblyPoint[]>(null);

  constructor(private userService: UserService, private displayService: DisplayService) { }


  //Bouding Array von Allen Punkten auf X-Route  
  //Start, Finish, Alle Punkte auf Route
  getBoundingArray(): Promise<any> {
    return new Promise(resolve => {
      const tempArray = [];
      this.boundingArray = [];
      this.createPolygon([this.startPoint[0][0], this.startPoint[0][1]]).then(poly => {
        const duration = this.pointsDetailed[0].duration / 60;
        const distance = this.pointsDetailed[0].distance * 0.001;
        tempArray.push(new PolygonAssemblyPoint('start', Number((Math.round(distance * 100) / 100).toFixed(1)),
        Number((Math.round(duration * 100) / 100).toFixed(0)), poly));
      });

      for (let i = 0; i < this.points.length; i++) {
        this.createPolygon([this.points[i].position.longitude, this.points[i].position.latitude]).then(poly => {
            const duration = this.pointsDetailed[i + 1].duration / 60;
            const distance = this.pointsDetailed[i + 1].distance * 0.001;
            tempArray.push(new PolygonAssemblyPoint(this.points[i].name, Number((Math.round(distance * 100) / 100).toFixed(1)),
            Number((Math.round(duration * 100) / 100).toFixed(0)), poly));
          });
        if (i + 1 === this.points.length) {
            this.createPolygon([this.finishPoint[0][0], this.finishPoint[0][1]]).then(poly => {
              const duration = 0;
              const distance = 0;
              const finishAddress = this.finishPoint[1].split(',')[0];
              tempArray.push(new PolygonAssemblyPoint(finishAddress, Number((Math.round(distance * 100) / 100).toFixed(1)),
              Number((Math.round(duration * 100) / 100).toFixed(0)), poly));
              this.boundingArray = tempArray;
              resolve(this.boundingArray);
            });
          }
      }
    });
  }

  //Create Polygonn zu adressenArray
  createPolygon(address: any[]): Promise<any> {
    return new Promise(resolve => {
      const polygon = [];
      let dLatN = 100;
      let dLongN = -100;
      for (let time = 0; time < 4; time++) {
        const R = 6378137;
        const dLat = dLatN / R;
        const dLon = dLongN / (R * Math.cos(Math.PI * address[0] / 180));
        polygon.push([address[0] + dLat * 180 / Math.PI, address[1] + dLon * 180 / Math.PI]);
        if (time === 0) {
          dLongN = 100;
        }
        if (time === 1) {
          dLongN = 100;
          dLatN = -100;
        }
        if (time === 2) {
          dLongN = -100;
        }
      }
      const poly = turf.polygon([[polygon[0], polygon[1], polygon[2], polygon[3], polygon[0]]]);
      resolve(poly);
    });
  }

  setPointsDetailed(points: any): Promise<any> {
    return new Promise(resolve => {
      this.pointsDetailed = points;
      resolve();
    });
  }

  getPointsDetailed(): Promise<any> {
    return new Promise(resolve => {
      resolve(this.pointsDetailed);
    });
  }

  getDisplayType(): Promise<any> {
    return new Promise(resolve => {
        resolve(this.displayType);
    });
  }


  setRouteFinished() {
    this.routeFinished.next(false);
  }

  setDisplayType(dataPoint: string): Promise<any> {
    if (dataPoint === 'routeStarted') { this.displayService.setIsRouting(true); }
    return new Promise(resolve => {
        this.displayType.next(dataPoint);
        resolve(this.displayType);
    });
  }

  getDisplayTypeObs(): Observable<string> {
    return this.displayType.asObservable();
  }

  //Alle Lokale Variablen für Routing zurücksetzen
  resetAll() {
    this.setDuration(null);
    this.setDistance(null);
    this.setFinishPoint(undefined);
    this.setStartPoint([]);
    this.deleteAllPoints();
    this.boundingArray = [];
    this.displayService.setIsRouting(false);
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
        // TODO testing
        this.pointsBehaviorSubject.next(this.points);
        resolve(this.points);
      }
      resolve(false);
    });
  }

  getstartPoint(): Promise<number[]> {
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
      try {
      if (dataPoint != null) {
        const temp = (Math.round(dataPoint * 100) / 100).toFixed(0);  // toFixed(2) = 2 decimal Places
        this.duration.next(temp);
        resolve(true);
      }
    } catch (e) {
        console.log(e);
        resolve(false);
    }
    });
  }

  setDistance(dataPoint?: number): Promise<any> {
    return new Promise(resolve => {
      try {
      if (dataPoint != null) {
        const temp = (Math.round(dataPoint * 100) / 100).toFixed(2);
        this.distance.next(temp);
        resolve(true);
      }
    } catch (e) {
        console.log(e);
        resolve(false);
    }
    });
  }

  setPoints(dataPoint?: RoutingGeoAssemblyPoint): Promise<boolean> {
    return new Promise(resolve => {
      try {
        if (dataPoint != null) {
            if (this.points.includes(dataPoint)) {
              resolve(false);
            } else {
              this.points.push(dataPoint);
                // TODO testing
              this.pointsBehaviorSubject.next(this.points);
              resolve(true);
            }
        }
      } catch (e) {
          console.log(e);
          resolve(false);
      }
    });
  }

  deletePoints(pointNumber: number): Promise<boolean> {
    return new Promise(resolve => {
      try {
        if (pointNumber != null) {
          const t = this.points.length;
          for (let i = pointNumber; i <= t; i++) {
            for (let k = 0; k < this.points.length; k++) {
              if (this.points[k].textField == i.toString()) {
                this.points.splice(k, 1);
              }
            }
          }
          resolve(true);
        }
      } catch (e) {
        console.log(e);
        resolve(false);
      }
    });
  }

  deleteAllPoints(): Promise<boolean> {
    return new Promise(resolve => {
      this.points = [];
      // TEsting
      this.pointsBehaviorSubject.next([]);
      resolve(true);
    });
  }

  setStartPoint(dataPoint?: any[]): Promise<boolean> {
    return new Promise(resolve => {
      if (dataPoint != undefined) {
        this.startPoint = dataPoint;
        resolve(true);
      } else {
          this.startPoint = [[this.userService.behaviorMyOwnPosition.value.coords.longitude, this.userService.behaviorMyOwnPosition.value.coords.latitude]];
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



  getDisplayManuelShow(): Observable<boolean> {
    return this.displayManuelShow.asObservable();
  }
  setDisplayManuelShow() {
    this.displayManuelShow.next(true);
  }

  getDisplaySwitchCase(): Observable<boolean> {
    return this.displaySwitchCase.asObservable();
  }
  setDisplaySwitchCase(switchCase: boolean) {
    this.displaySwitchCase.next(switchCase);
  }

  setDisplayRoutingStart(switchCase: boolean) {
    this.displayRoutingStart.next(switchCase);
  }

  getDisplayRoutingStart(): Observable<boolean> {
    return this.displayRoutingStart.asObservable();
  }

}
