import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RideIndicatorFinalComponent } from '../ride-indicator-final/ride-indicator-final.component';
import { RideIndicatorFreeComponent } from '../ride-indicator-free/ride-indicator-free.component';
import { RideIndicatorAssemblyComponent } from './../ride-indicator-assembly/ride-indicator-assembly.component';

@Component({
  selector: 'riding-toggle',
  templateUrl: './riding-toggle.component.html',
  styleUrls: ['./riding-toggle.component.scss'],
})
export class RidingToggleComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  async showIndicatorScreen() {
      const modal = await this.modalController.create({
        // component: RideIndicatorFinalComponent
        // component: RideIndicatorAssemblyComponent
        component: RideIndicatorFreeComponent
      });
      return await modal.present();
  }
}
