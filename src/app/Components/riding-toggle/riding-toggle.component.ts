import { MapDataFetchService } from './../../services/map-data-fetch/map-data-fetch.service';
import { MapStartPage } from 'src/app/pages/map/map-start/map-start.page';
import { RideIndicatorComponent } from './../ride-indicator/ride-indicator.component';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { Status } from 'src/app/services/status-audio/status-audio.service';

@Component({
  selector: 'riding-toggle',
  templateUrl: './riding-toggle.component.html',
  styleUrls: ['./riding-toggle.component.scss'],
})
export class RidingToggleComponent implements OnInit {

  public statusColor: string;

  constructor(private mapStart: MapStartPage, private routingUserService: RoutingUserService, private mapDataFetch: MapDataFetchService) { }

  ngOnInit() {
    this.routingUserService.getDisplaySwitchCase().subscribe(x => {
      console.log(x);
      if (x == true) {
        this.toggleVisibility(false);
      } else {
        this.toggleVisibility(true);
      }
    });
    this.mapDataFetch.activeClusterStatus.subscribe(status => {
      if (status === Status.ALONE) {
        this.statusColor = '#ffe500';
      } else if (status === Status.GROUP) {
        this.statusColor = '#00eeff';
      } else if (status === Status.ASSOCIATION) {
        this.statusColor = '#ff1ad9';
      }
    });
  }

  async showIndicatorScreen() {
    this.mapStart.toggleShowIndicatorScreen();
  }


  toggleVisibility(switchCase: boolean) {
    document.getElementById("toggle").hidden = switchCase;
  }
}
