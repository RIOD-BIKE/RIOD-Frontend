import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import * as firebase from 'firebase';
import { NavController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up-tab2',
  templateUrl: './sign-up-tab2.page.html',
  styleUrls: ['./sign-up-tab2.page.scss'],
})
export class SignUpTab2Page implements OnInit {



  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(private router: Router, private authService: AuthService) { firebase.initializeApp(environment.firebase);}

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }


  signIn(phoneNumber: number){
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
    this.authService.getVerification(phoneNumberString,appVerifier).then(x=>{
      if(x==true){
      this.router.navigate(['/sign-up-tab3']);
      }
    });

  }
}
