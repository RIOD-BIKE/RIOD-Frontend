import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonSlides} from '@ionic/angular';


@Component({
  selector: 'app-explain-slides',
  templateUrl: './explain-slides.component.html',
  styleUrls: ['./explain-slides.component.scss'],
})
export class ExplainSlidesComponent implements OnInit {
  @ViewChild('mySlider', { static: true }) slides: IonSlides;

  constructor(public modalController: ModalController, private router: Router) { }

  ngOnInit() {}

  dismiss() {
  this.modalController.dismiss({
      'dismissed': true
    });
  }

  swipeNext() {
    this.slides.slideNext();
  }

  back(){
    this.slides.slidePrev();
  }

  goToSignUp() {
    this.dismiss();
    this.router.navigate(['/sign-up-tab2']);
  }

}
