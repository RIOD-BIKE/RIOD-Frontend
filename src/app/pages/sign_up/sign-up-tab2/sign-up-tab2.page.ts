import { ThirdParties } from './../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@Component({
  selector: 'app-sign-up-tab2',
  templateUrl: './sign-up-tab2.page.html',
  styleUrls: ['./sign-up-tab2.page.scss'],
})
export class SignUpTab2Page implements OnInit {
  public phoneNumber = '';

  constructor(private router: Router, private authService: AuthService, private alertController: AlertController) {
    !firebase.apps.length ? firebase.initializeApp(environment.firebase) : firebase.app();
  }

  ngOnInit() {
  }

  async signIn(phoneNumber: string) {
    const formattedNumber = parsePhoneNumberFromString(phoneNumber, 'DE');
    if (!formattedNumber) {
      const alert = await this.alertController.create({
        header: 'Ungültige Nummer',
        message: 'Leider ist die eingegebene Telefonnummer ungültig. Bitte überprüfe die Eingabe!',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }
    try {
      await this.authService.requestPhoneVerification(formattedNumber.number.toString());
      this.router.navigate(['/sign-up-tab3']);
    } catch (e) {
      console.log(`Error signIn: ${e}`);
      this.showLoginError('Telefonnummer');
    }
  }

  async signInGoogle() {
    try {
      await this.authService.handleThirdPartySignIn(ThirdParties.Google);
      this.router.navigate(['/sign-up-tab4']);
    } catch (e) {
      console.log(`Error signInGoogle: ${e}`);
      this.showLoginError('Google');
    }
  }

  async signInFacebook() {
    try {
      await this.authService.handleThirdPartySignIn(ThirdParties.Facebook);
      this.router.navigate(['/sign-up-tab4']);
    } catch (e) {
      console.log(`Error signInFacebook: ${e}`);
      this.showLoginError('Facebook');
    }
  }

  async signInTwitter() {
    try {
      await this.authService.handleThirdPartySignIn(ThirdParties.Twitter);
      this.router.navigate(['/sign-up-tab4']);
    } catch (e) {
      console.log(`Error signInTwitter: ${e}`);
      this.showLoginError('Twitter');
    }
  }

  async showLoginError(service: string) {
    const alert = await this.alertController.create({
      header: 'Fehler',
      message: 'Leider ist ein Fehler beim Login via ' + service + ' aufgetreten.',
      buttons: ['Ok']
    });
    await alert.present();
  }
}