import { MapDataFetchService } from './../../services/map-data-fetch/map-data-fetch.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Status } from 'src/app/services/status-audio/status-audio.service';

@Component({
  selector: 'app-ride-indicator',
  templateUrl: './ride-indicator.component.html',
  styleUrls: ['./ride-indicator.component.scss'],
})
export class RideIndicatorComponent implements OnInit {

  statusColor: string;

  constructor(private modalController: ModalController, private mapDataFetch: MapDataFetchService) { }

  async ngOnInit() {
    this.mapDataFetch.activeClusterStatus.subscribe(status => {
      if (status === Status.ALONE) {
        this.statusColor = '#ffe500';
      } else if (status === Status.GROUP) {
        this.statusColor = '#00eeff';
      } else if (status === Status.ASSOCIATION) {
        this.statusColor = '#ff1ad9';
      }
    });
    // uncomment for a little party
    // setInterval(() => {
    //   this.statusColor = `rgb(${ Math.floor((Math.random() * 255) + 1) }, ${ Math.floor((Math.random() * 255) + 1) }, ${ Math.floor((Math.random() * 255) + 1) })`;
    // }, 50);
  }
}
