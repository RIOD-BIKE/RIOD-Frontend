import { MapStartPage } from 'src/app/pages/map/map-start/map-start.page';
import { RideIndicatorComponent } from './../ride-indicator/ride-indicator.component';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RideIndicatorFinalComponent } from '../ride-indicator-final/ride-indicator-final.component';
import { RideIndicatorFreeComponent } from '../ride-indicator-free/ride-indicator-free.component';
import { RideIndicatorAssemblyComponent } from './../ride-indicator-assembly/ride-indicator-assembly.component';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';

@Component({
  selector: 'riding-toggle',
  templateUrl: './riding-toggle.component.html',
  styleUrls: ['./riding-toggle.component.scss'],
})
export class RidingToggleComponent implements OnInit {

  constructor(private mapStart: MapStartPage, private routingUserService: RoutingUserService) { }

  ngOnInit() {
    this.routingUserService.getDisplaySwitchCase().subscribe(x=>{
      console.log(x);
    if(x==true){
      this.toggleVisibility(false);
    } else{
      this.toggleVisibility(true);
    }
  });
  }

  async showIndicatorScreen() {
    this.mapStart.toggleShowIndicatorScreen();
  }


  toggleVisibility(switchCase:boolean){
    document.getElementById("toggle").hidden = switchCase;
  }
}
