import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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

  verifyUser(){
    const verifyNumber=this.vNumb;
    this.authService.sendVerification(verifyNumber).then(x=>{
      if(x==true){
        this.router.navigate(['/sign-up-tab4']);
      }
    });
  }

}
