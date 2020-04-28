import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-tab4',
  templateUrl: './sign-up-tab4.page.html',
  styleUrls: ['./sign-up-tab4.page.scss'],
})
export class SignUpTab4Page implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  DEMONextPage(){
    this.router.navigate(['/sign-up-tab1']);
  }

}
