
import { Component, OnInit } from '@angular/core';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MapBoxComponent } from 'src/app/Components/map-box/map-box.component';
import { ModalController } from '@ionic/angular';
import { TutorialOverlay2Component } from 'src/app/Components/tutorial/tutorial-overlay2/tutorial-overlay2.component';

@Component({
  selector: 'app-map-main',
  templateUrl: './map-main.page.html',
  styleUrls: ['./map-main.page.scss'],
})
export class MapMainPage implements OnInit {

  constructor(private mapBox: MapBoxComponent,private statusBar: StatusBar, private modalController:ModalController ) { }

  ngOnInit() {
    this.statusBar.overlaysWebView(true);
    this.statusBar.backgroundColorByHexString('#44000000');
    this.mapBox.setupMap();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: TutorialOverlay2Component
    });
    return await modal.present();
  }


}
