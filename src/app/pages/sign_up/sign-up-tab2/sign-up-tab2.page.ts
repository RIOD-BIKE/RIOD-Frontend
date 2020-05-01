import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-tab2',
  templateUrl: './sign-up-tab2.page.html',
  styleUrls: ['./sign-up-tab2.page.scss'],
})
export class SignUpTab2Page implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  DEMONextPage(){
    this.router.navigate(['/sign-up-tab3']);
  }
}
