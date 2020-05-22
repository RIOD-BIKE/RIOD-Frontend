
import { Component, OnInit } from '@angular/core';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MapBoxComponent } from 'src/app/Components/map-box/map-box.component';
import { ActivatedRoute } from '@angular/router';
import { MainMenuComponent } from 'src/app/Components/main-menu/main-menu.component';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-map-main',
  templateUrl: './map-main.page.html',
  styleUrls: ['./map-main.page.scss'],
})
export class MapMainPage implements OnInit {
  

  constructor(private mapBox: MapBoxComponent,private statusBar: StatusBar, private activatedRoute: ActivatedRoute,private mainMenu: MainMenuComponent, private userService: UserService ) { this.init()}

  init(){
    

    this.statusBar.overlaysWebView(true);
    this.statusBar.backgroundColorByHexString('#44000000');
  }
  ngOnInit() {

   
  
  }


}
