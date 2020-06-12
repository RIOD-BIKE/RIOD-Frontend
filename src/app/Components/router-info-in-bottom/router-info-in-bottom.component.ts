import { Component, OnInit, Input } from '@angular/core';
import { MapStartPage } from 'src/app/pages/map/map-start/map-start.page';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { UserService } from 'src/app/services/user/user.service';
import { MapBoxComponent } from '../map-box/map-box.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';


@Component({
  selector: 'router-info-in-bottom',
  templateUrl: './router-info-in-bottom.component.html',
  styleUrls: ['./router-info-in-bottom.component.scss'],
})
export class RouterInfoInBottomComponent implements OnInit {
  private duration:number;
  private distance:number;
  private infoArray=["null1","null2"];
  constructor(private mapStart: MapStartPage,private mainMenu:MainMenuComponent,private mapBox: MapBoxComponent, private routingUserService: RoutingUserService, private userService:UserService) { }

  ngOnInit() {
    this.routingUserService.getDistance();
  }

  closeView(){
  
    this.mainMenu.closeView();
    this.routingUserService.setDuration(null);
    this.routingUserService.setDistance(null);
    this.routingUserService.setFinishPoint(undefined);
    this.routingUserService.setStartPoint(undefined);
    this.routingUserService.setPoints([]);
    this.mapBox.removeRoute();
    this.mapStart.setShowStart();
  }

  startRoute(){
    this.routingUserService.getPoints().then(x=>{
      let pointString="";
      for(let i =0; i<x.length;i++){
        if(x[i].name!=("+++")){
          pointString+= (x[i].position.longitude+","+x[i].position.latitude+";");
        }
      }
      this.mapBox.drawRoute(pointString).then(()=>{
        this.routingUserService.getDuration().then(x=>{
          this.routingUserService.getDistance().then(y=>{
            this.infoArray=[x+" Minuten","("+y+" km)"];
          });
        });      
      });
    });
  }

  saveRoute(){
    this.routingUserService.getfinishPoint().then(x=>{
      this.routingUserService.getPoints().then(y=>{
        this.userService.saveRoute(x,y);
      })
      
    })
  }

}
