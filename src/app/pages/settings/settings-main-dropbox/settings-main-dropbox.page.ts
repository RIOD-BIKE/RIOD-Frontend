import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-settings-main-dropbox',
  templateUrl: './settings-main-dropbox.page.html',
  styleUrls: ['./settings-main-dropbox.page.scss'],
})
export class SettingsMainDropboxPage implements OnInit {
  rangeVolume:string;
  constructor(public platform:Platform) { 
  	this.platform.ready().then(()=>{
  		this.rangeVolume = "5";
  	})
  }

  ngOnInit() {
  }

}
