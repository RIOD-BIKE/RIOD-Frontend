import { Injectable, ErrorHandler } from '@angular/core';
import * as firebase from 'firebase';
import { NavController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private confirmationResult:firebase.auth.ConfirmationResult;
  constructor(public navCtrl:NavController, public alertCtrl:AlertController) { }


  getVerification(phoneNumberString:string,appVerifier:firebase.auth.RecaptchaVerifier):Promise<boolean>{
    return new Promise(resolve => {
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then( async confirmationResult => {
        this.confirmationResult=confirmationResult;
      resolve(true);
    })
    .catch(function (error) {
      console.error("SMS not sent", error); //TO-DO
      resolve(false);
    });
  });
  }

  sendVerification(verifyNumber:number):Promise<boolean>{
    return new Promise(resolve => {
    this.confirmationResult.confirm(verifyNumber.toString()).then(x=>{
      console.log(x.user);

        //signIn() --> AuthGuard

      resolve(true);
    }).catch(x=>{
      console.log(x); //TO-DO
      resolve(false);
    });
  });
  }

  signIn(){

  }


}
