import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ride-indicator-final',
  templateUrl: './ride-indicator-final.component.html',
  styleUrls: ['./ride-indicator-final.component.scss'],
})
export class RideIndicatorFinalComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  async dismiss() {
    await this.modalController.dismiss();
  }
}
