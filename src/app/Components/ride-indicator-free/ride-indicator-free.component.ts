import { MapDataFetchService } from './../../services/map-data-fetch/map-data-fetch.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { RideIndicatorAssemblyComponent } from '../ride-indicator-assembly/ride-indicator-assembly.component';
import { animate } from '@angular/animations';

@Component({
  selector: 'ride-indicator-free',
  templateUrl: './ride-indicator-free.component.html',
  styleUrls: ['./ride-indicator-free.component.scss'],
})
export class RideIndicatorFreeComponent implements OnInit {

  showAssembly = false;
  showFinal = true;
  statusColor: string;
  constructor(private modalController: ModalController, private mapDataFetch: MapDataFetchService) { }

  async ngOnInit() {
    this.mapDataFetch.getUserClusterStatus().subscribe(isInCluster => {
      if (!isInCluster) {
        this.statusColor = '#ffe500';
        console.log('User is alone :(');
        return;
      }
      // TODO: subscribe to activeCluster to retrieve updates on its size
      // const count = this.mapDataFetch.getActiveClusterCount();
      const count = 16;
      if (count >= 5 && count <= 15) {
        this.statusColor = '#00eeff';
        console.log('User in a group.');
      } else if (count > 15) {
        this.statusColor = '#ff1ad9';
        console.log('User is in an association!');
      }
    });
    // uncomment for a little party
    // setInterval(() => {
    //   this.statusColor = `rgb(${ Math.floor((Math.random() * 255) + 1) }, ${ Math.floor((Math.random() * 255) + 1) }, ${ Math.floor((Math.random() * 255) + 1) })`;
    // }, 50);
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

}
