import { ModalController } from '@ionic/angular';
import { ButtonOverlayComponent } from '../button-overlay/button-overlay.component';
import { Component, OnInit, Input } from '@angular/core';

import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { UserService } from 'src/app/services/user/user.service';
import { MapBoxComponent } from '../map-box/map-box.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';


@Component({
  selector: 'router-start',
  templateUrl: './router-start.component.html',
  styleUrls: ['./router-start.component.scss'],
})
export class RouterStartComponent implements OnInit {
  private duration:number;
  private distance:number;
  private infoArray=["null1","null2"];

  constructor(private mainMenu:MainMenuComponent,private mapBox: MapBoxComponent, private routingUserService: RoutingUserService, private userService:UserService, private modalController :ModalController,private search:SearchBarComponent) { }

  ngOnInit() {
    this.routingUserService.getDistance();
  }

  closeView(){
    this.mainMenu.closeView();
    this.routingUserService.resetAll();
    this.mapBox.removeRoute();
    // this.mapStart.setShowStart();
    this.mapBox.disableAssemblyClick().then(() => {
    this.mapBox.updateAssemblyPoints();
    });
    this.search.reset();
  }

  startRoute(){
    this.routingUserService.getPoints().then(x => {
      let pointString = '';
      for(let i =0; i<x.length;i++){
        if (x[i].name !== ('+++')) {
          pointString += (x[i].position.longitude + ',' + x[i].position.latitude + ';');
        }
      }
      this.mapBox.drawRoute(pointString).then(() => {
        this.routingUserService.getDuration().then(x => {
          this.routingUserService.getDistance().then(y => {
            this.infoArray=[x + ' Minuten' , '(' + y + ' km)'];
          });
        });
      });
      this.routingUserService.setDisplayType('Route_Info');
    });
  }

  saveRoute(){
    this.presentModal();
    this.routingUserService.getfinishPoint().then(x => {
      this.routingUserService.getPoints().then(y => {
        this.userService.saveRoute(x, y);
      });
    });
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ButtonOverlayComponent
    });
    return await modal.present();
  }
}
