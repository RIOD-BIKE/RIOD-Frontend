import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-button-overlay',
  templateUrl: './button-overlay.component.html',
  styleUrls: ['./button-overlay.component.scss'],
})
export class ButtonOverlayComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss({
        'dismissed': true
      });
    }

}
