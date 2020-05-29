import { ThirdParties } from './../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import * as firebase from 'firebase';
import { NavController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sign-up-tab2',
  templateUrl: './sign-up-tab2.page.html',
  styleUrls: ['./sign-up-tab2.page.scss'],
})
export class SignUpTab2Page implements OnInit {



  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(private router: Router, private authService: AuthService) { 
    !firebase.apps.length ? firebase.initializeApp(environment.firebase) : firebase.app();
    // this.init();
    }
    
    init(){
      
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible'
    });
    }
  ngOnInit() {
    this.init();
  }


  // signIn(phoneNumber: number){
  //   const appVerifier = this.recaptchaVerifier;
  //   const phoneNumberString = "+" + phoneNumber;
  //   this.authService.getVerification(phoneNumberString,appVerifier).then(x=>{
  //     if(x==true){  //Rückgabewert ob SMS Send
  //     this.router.navigate(['/sign-up-tab3']); // TODO: Errors catchen
  //     }
  //   });

  // }

  async signIn(phoneNumber: string) {
    try {
      await this.authService.requestPhoneVerification(phoneNumber);
      this.router.navigate(['/sign-up-tab3']);
    } catch (e) {
      // TODO: Display error to user
      console.log(`Error signIn: ${e}`);
    }
  }

  async signInGoogle() {
    try {
      await this.authService.handleThirdPartySignIn(ThirdParties.Google);
      this.router.navigate(['/sign-up-tab4']);
    } catch (e) {
      // TODO: Display error to user
      console.log(`Error signInGoogle: ${e}`);
    }
  }

  async signInFacebook() {
    try {
      await this.authService.handleThirdPartySignIn(ThirdParties.Facebook);
      this.router.navigate(['/sign-up-tab4']);
    } catch (e) {
      // TODO: Display error to user
      console.log(`Error signInFacebook: ${e}`);
    }
  }

  async signInTwitter() {
    try {
      await this.authService.handleThirdPartySignIn(ThirdParties.Twitter);
      this.router.navigate(['/sign-up-tab4']);
    } catch (e) {
      // TODO: Display error to user
      console.log(`Error signInTwitter: ${e}`);
    }
  }
}
