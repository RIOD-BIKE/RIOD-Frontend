import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tutorial-overlay2',
  templateUrl: './tutorial-overlay2.component.html',
  styleUrls: ['./tutorial-overlay2.component.scss'],
})
export class TutorialOverlay2Component implements OnInit {
  @ViewChild('mySlider', { static: true }) slides: IonSlides;

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
  this.modalController.dismiss({
      'dismissed': true
    });
  }

  swipeNext() {
    this.slides.slideNext();
  }

}
