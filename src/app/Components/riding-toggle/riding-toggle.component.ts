import { MapDataFetchService } from './../../services/map-data-fetch/map-data-fetch.service';
import { MapStartPage } from 'src/app/pages/map/map-start/map-start.page';
import { RideIndicatorComponent } from './../ride-indicator/ride-indicator.component';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { Status } from 'src/app/Classess/map/status';

@Component({
  selector: 'riding-toggle',
  templateUrl: './riding-toggle.component.html',
  styleUrls: ['./riding-toggle.component.scss'],
})
export class RidingToggleComponent implements OnInit {

  public statusColor: string = "url('../../../assets/icon/map-riod.svg')";
  public urlBefore: string ="url('../../../assets/icon/riod.svg')";

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
        this.statusColor = "url('../../../assets/icon/map-riod.svg')";
        this.urlBefore = "url('../../../assets/icon/riod.svg')";
      } else if (status === Status.GROUP) {
        this.statusColor = "url('../../../assets/icon/map-riod1.svg')";
        this.urlBefore = "url('../../../assets/icon/riod1.svg')";
      } else if (status === Status.ASSOCIATION) {
        this.statusColor = "url('../../../assets/icon/map-riod2.svg')";
        this.urlBefore = "url('../../../assets/icon/riod2.svg')";
      }
      
      //console.log("hahah" +this.statusColor);
      
      const toggleBackground = document.getElementById('toggleBtn');
      toggleBackground.style.backgroundImage = this.statusColor;
      
      
    });
  }

  async showIndicatorScreen() {
    this.mapStart.toggleShowIndicatorScreen();
  }


  toggleVisibility(switchCase: boolean) {
    document.getElementById("toggle").hidden = switchCase;
  }
}
