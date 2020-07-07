import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-settings-main-dropbox',
  templateUrl: './settings-main-dropbox.page.html',
  styleUrls: ['./settings-main-dropbox.page.scss'],
})
export class SettingsMainDropboxPage implements OnInit {
  rangeVolume:string;
  constructor(public platform:Platform, private router: Router) { 
  	this.platform.ready().then(()=>{
  		this.rangeVolume = "5";
  	})
  }

  ngOnInit() {
  }

  goToManualPage(){
    this.router.navigate(['/settings-manual']);
  }

  goToSettingsMain() {
    this.router.navigate(['/settings-main']);
  }

}
