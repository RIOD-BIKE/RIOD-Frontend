import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up-tab3',
  templateUrl: './sign-up-tab3.page.html',
  styleUrls: ['./sign-up-tab3.page.scss'],
})
export class SignUpTab3Page implements OnInit {
  private vNumb:number;

  constructor(private router: Router, private authService: AuthService) { }
  

  ngOnInit() { 
  }

  // verifyUser(verifyNumber:number){
  //   this.authService.sendVerification(verifyNumber).then(x=>{
  //   if(x==true){
  //     this.router.navigate(['/sign-up-tab4']);
  //   } else if(x==false){
  //     //fehlerfall abfangen
  //   }
  //   });
  // }

  async verifyUser(code: number) {
    try {
      await this.authService.checkVerficationCode(code);
      this.router.navigate(['/sign-up-tab4']);
    } catch (e) {
      // TODO: Display error to user
      console.log(`Error verifyUser: ${e}`);
    }
  }

}
