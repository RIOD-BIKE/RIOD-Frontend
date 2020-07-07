import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.page.html',
  styleUrls: ['./settings-main.page.scss'],
})
export class SettingsMainPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToSettingsMainDropbox(){
    this.router.navigate(['/settings-main-dropbox']);
  }

}
