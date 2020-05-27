import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonSlides} from '@ionic/angular';

@Component({
  selector: 'app-tutorial-overlay1',
  templateUrl: './tutorial-overlay1.component.html',
  styleUrls: ['./tutorial-overlay1.component.scss'],
})
export class TutorialOverlay1Component implements OnInit {
  @ViewChild('mySlider', { static: true }) slides: IonSlides;

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
  this.modalController.dismiss({
      'dismissed': true
    });
  }

  swipeNext(){
    this.slides.slideNext();
  }

}
