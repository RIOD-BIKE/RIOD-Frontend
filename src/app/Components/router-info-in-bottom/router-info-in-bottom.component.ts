import { Component, OnInit } from '@angular/core';
import { MapStartPage } from 'src/app/pages/map/map-start/map-start.page';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'router-info-in-bottom',
  templateUrl: './router-info-in-bottom.component.html',
  styleUrls: ['./router-info-in-bottom.component.scss'],
})
export class RouterInfoInBottomComponent implements OnInit {

  constructor(private mapStart: MapStartPage, private routingUserService: RoutingUserService, private userService:UserService) { }

  ngOnInit() {}

  closeView(){
    this.mapStart.setShowStart();
  }

  startRoute(){
    this.routingUserService.displayRoute();
  }

  saveRoute(){
    this.routingUserService.getfinishPoint().then(x=>{
      this.userService.saveRoute(x);
    })
  }

}
