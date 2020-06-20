import { UsersDataFetchService } from 'src/app/services/users-data-fetch/users-data-fetch.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';


@Component({
  selector: 'app-explain-slides',
  templateUrl: './explain-slides.component.html',
  styleUrls: ['./explain-slides.component.scss'],
})
export class ExplainSlidesComponent implements OnInit {
  @ViewChild('mySlider', { static: true }) slides: IonSlides;
  hidePrev: boolean = false;
  hideNext: boolean = true;
  trenner: boolean = true;
  showQuestion: boolean = false;
  currentIndex: Number = 0;
  name: string;
  contact: string;

  constructor(public modalController: ModalController, private router: Router, private authService: AuthService, private userDataFetch: UsersDataFetchService, private alertController: AlertController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  swipeNext() {
    this.slides.slideNext();
  }

  back() {
    this.slides.slidePrev();
  }


  slideChanged() {
    var slide1 = document.getElementById("slide1");
    var slide2 = document.getElementById("slide2");
    var slide3 = document.getElementById("slide3");
    var slide4 = document.getElementById("slide4");
    var slide5 = document.getElementById("slide5");
    this.slides.getActiveIndex().then(
      (index: Number) => {
        this.currentIndex = index;
        if (this.currentIndex == 0) {
          slide2.style.backgroundColor = 'black';
          slide3.style.backgroundColor = 'black';
          slide4.style.backgroundColor = 'black';
          slide5.style.backgroundColor = 'black';
        } else if (this.currentIndex == 1) {
          slide2.style.backgroundColor = 'yellow';
          slide3.style.backgroundColor = 'black';
          slide4.style.backgroundColor = 'black';
          slide5.style.backgroundColor = 'black';
        } else if (this.currentIndex == 2) {
          slide2.style.backgroundColor = 'yellow';
          slide3.style.backgroundColor = 'cyan';
          slide4.style.backgroundColor = 'black';
          slide5.style.backgroundColor = 'black';
        } else if (this.currentIndex == 3) {
          slide2.style.backgroundColor = 'yellow';
          slide3.style.backgroundColor = 'cyan';
          slide4.style.backgroundColor = 'fuchsia';
          slide5.style.backgroundColor = 'black';
        } else if (this.currentIndex == 4) {
          slide2.style.backgroundColor = 'yellow';
          slide3.style.backgroundColor = 'cyan';
          slide4.style.backgroundColor = 'fuchsia';
          slide5.style.backgroundColor = 'white';
        }
      });

    this.slides.isEnd().then((istrue) => {
      if (istrue) {
        this.hideNext = false;
        this.trenner = false;
        this.showQuestion = true;
      } else {
        this.hideNext = true;
        this.hidePrev = true;
        this.trenner = true;
        this.showQuestion = false;
      }
    });

    this.slides.isBeginning().then((istrue) => {
      if (istrue) {
        this.hidePrev = false;
      } else {
        if (this.trenner == true) {
          this.hideNext = true;
        }
        this.hidePrev = true;
      }
    });
  }

  reachedStart() {
    this.hidePrev = true;
  }

  reachedEnd() {
    this.hideNext = false;
  }

  async signUp() {
    try {
      await this.authService.handleAnonymousSignIn();
      if (this.name) await this.userDataFetch.firestore_setName(await this.authService.getCurrentUID(), this.name);
      if (this.contact) await this.userDataFetch.firestore_setContact(await this.authService.getCurrentUID(), this.contact);
      this.modalController.dismiss();
      this.router.navigate(['map-start']);
    } catch (e) {
      console.log("Error SignIn: ", e);
      const alert = await this.alertController.create({
        header: 'Fehler',
        message: 'Leider ist ein Fehler beim Anmelden aufgetreten.',
        buttons: ['OK']
      });
      await alert.present();
    }

  }
}
