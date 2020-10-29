import { MapDataFetchService } from './../../services/map-data-fetch/map-data-fetch.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Status } from 'src/app/Classess/map/status';

@Component({
  selector: 'app-ride-indicator',
  templateUrl: './ride-indicator.component.html',
  styleUrls: ['./ride-indicator.component.scss'],
})
export class RideIndicatorComponent implements OnInit {

 public statusColor: string = '#ffe500';

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
      document.getElementById('overID').style.backgroundColor = this.statusColor;
    });

    // uncomment for a little party
    // setInterval(() => {
    //   this.statusColor = `rgb(${ Math.floor((Math.random() * 255) + 1) }, ${ Math.floor((Math.random() * 255) + 1) }, ${ Math.floor((Math.random() * 255) + 1) })`;
    // }, 50);
  }
}
