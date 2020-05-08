import { Component, OnInit } from '@angular/core';
import { MapBoxComponent } from '../../../Components/map-box/map-box.component';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-map-start',
  templateUrl: './map-start.page.html',
  styleUrls: ['./map-start.page.scss'],
})
export class MapStartPage implements OnInit {

 constructor(private mapBox: MapBoxComponent,private statusBar: StatusBar ) { }

  ngOnInit() {
    this.statusBar.overlaysWebView(true);
    this.statusBar.backgroundColorByHexString('#44000000');
    this.mapBox.setupMap();
  }


}
