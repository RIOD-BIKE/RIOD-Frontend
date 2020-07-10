import { ModalController } from '@ionic/angular';
import { ButtonOverlayComponent } from './../button-overlay/button-overlay.component';
import { Component, OnInit, Input, Output } from '@angular/core';
import { MapStartPage } from 'src/app/pages/map/map-start/map-start.page';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { UserService } from 'src/app/services/user/user.service';
import { MapBoxComponent } from '../map-box/map-box.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { EventEmitter } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { MapIntegrationService } from 'src/app/services/map-integration/map-integration.service';



@Component({
  selector: 'router-info-in-bottom',
  templateUrl: './router-info-in-bottom.component.html',
  styleUrls: ['./router-info-in-bottom.component.scss'],
})
export class RouterInfoInBottomComponent implements OnInit {
  private duration: number;
  private distance: number;
  public infoArray = [];

  constructor(private mainMenu: MainMenuComponent, private mapBox: MapBoxComponent, private routingUserService: RoutingUserService,
              private userService: UserService, private modalController: ModalController, private mapIntegration: MapIntegrationService) { }

  ngOnInit() {
    this.routingUserService.getDurationasSub().subscribe(duration => {
      this.routingUserService.getDistanceasSub().subscribe(distance => {
        if (duration != null && distance != null) {
          this.infoArray = [duration.valueOf() + ' Minuten' , '(' + distance.valueOf() + ' km)'];
        }
      });
    });
  }

  closeView() {
    this.mainMenu.closeView();
    this.infoArray = [];
    this.routingUserService.resetAll();
    this.mapBox.removeRoute();
    this.mapBox.disableAssemblyClick().then(() => {
    this.mapBox.updateAssemblyPoints();
    });
    this.routingUserService.setDisplayType('Start');
    this.mapBox.moveMapToCurrent();
    this.routingUserService.routeFinished.next(true);
  }

  startRoute() {
    this.routingUserService.getPoints().then(points => {
      this.routingUserService.getDuration().then(duration => {
        this.routingUserService.getDistance().then(dist => {
          this.routingUserService.getfinishPoint().then(fin => {
            this.routingUserService.getstartPoint().then(start => {
              let pointString = '';
              for (const each of points) {
                pointString += (each.position.longitude + ',' + each.position.latitude + ';');
              }
              this.mapIntegration.saveRouteOffline(start, fin, points, duration, dist).then(returnMessage => {
                console.log(returnMessage);
              });
              this.mapBox.drawRoute(pointString).then(() => {
                // MUST CHECK IF ROUTE THAT IS ALREADY DRAWN IS IDENTICAL TO NEW DRAWING ROUTE
                this.routingUserService.setDisplayType("routeStarted");
                //console.log('new Route drawn');
              });
            });
          });
        });
      });
    });
}

  saveRoute() {
    this.presentModal();
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ButtonOverlayComponent
    });
    return await modal.present();
  }
}
