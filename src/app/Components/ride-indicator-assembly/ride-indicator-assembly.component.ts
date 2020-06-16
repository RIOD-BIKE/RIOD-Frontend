import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ride-indicator-assembly',
  templateUrl: './ride-indicator-assembly.component.html',
  styleUrls: ['./ride-indicator-assembly.component.scss'],
})
export class RideIndicatorAssemblyComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  async dismiss() {
    await this.modalController.dismiss();
  }

}
