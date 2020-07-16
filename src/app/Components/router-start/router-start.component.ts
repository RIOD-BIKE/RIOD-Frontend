import { VibrationService } from './../../services/vibration-service/vibration.service';
import { StatusAudioService } from './../../services/status-audio/status-audio.service';
import { ModalController } from '@ionic/angular';
import { ButtonOverlayComponent } from '../button-overlay/button-overlay.component';
import { Component, OnInit, Input } from '@angular/core';

import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { UserService } from 'src/app/services/user/user.service';
import { MapBoxComponent } from '../map-box/map-box.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { MapIntegrationService } from 'src/app/services/map-integration/map-integration.service';
import { distance } from '@turf/turf';


@Component({
  selector: 'router-start',
  templateUrl: './router-start.component.html',
  styleUrls: ['./router-start.component.scss'],
})
export class RouterStartComponent implements OnInit {
  private duration: number;
  private distance: number;

  constructor(private mapIntegration:MapIntegrationService, private mainMenu:MainMenuComponent,
    private mapBox: MapBoxComponent, private routingUserService: RoutingUserService,
    private userService:UserService, private modalController :ModalController,private search:SearchBarComponent,
    private statusAudio: StatusAudioService, private vibrationService: VibrationService) { }
// TODO: move statusAudio & vibrationService somewhere else?

  ngOnInit() {
    this.routingUserService.getDistance();
  }

  closeView() {
    this.routingUserService.setDisplayType('Start');
    this.routingUserService.resetAll();
    this.mapBox.removeRoute();
    this.mapBox.disableAssemblyClick().then(() => {
    this.mapBox.updateAssemblyPoints();
    this.mapBox.moveMapToCurrent();
    this.routingUserService.routeFinished.next(true);
    });
  }

  startRoute(){
    this.routingUserService.getPoints().then(points => {
     //missing this.mapIntegration.saveRouteOffline()
      let pointString = '';
      for(let i =0; i<points.length;i++){
          pointString += (points[i].position.longitude + ',' + points[i].position.latitude + ';');
      }
      this.mapBox.drawRoute(pointString).then(() => {

      });
      this.routingUserService.setDisplayType('Route_Info');
    });
  }

  saveRoute(){
    this.presentModal();
    this.routingUserService.getfinishPoint().then(x => {
      this.routingUserService.getPoints().then(y => {
        this.userService.saveShortcut(x, y);
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
