import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";


@Component({
  selector: 'app-sign-up-tab1',
  templateUrl: './sign-up-tab1.page.html',
  styleUrls: ['./sign-up-tab1.page.scss'],
})
export class SignUpTab1Page implements OnInit {

  constructor(private router: Router) { }
  
  ngOnInit() {
  }

  DEMONextPage(){
    this.router.navigate(['/sign-up-tab2']);
  }

}
