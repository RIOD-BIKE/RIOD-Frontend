import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { MapBoxComponent } from '../map-box/map-box.component';
import { Router } from '@angular/router';
import { MapIntegrationService, Feature  } from 'src/app/services/map-integration/map-integration.service';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { MapStartPage } from 'src/app/pages/map/map-start/map-start.page';
@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {

  
  constructor(private mapStart: MapStartPage,private routingUserService: RoutingUserService,private navCtrl: NavController,private modalController: ModalController, private nativeGeocoder: NativeGeocoder, private mapIntegration: MapIntegrationService, private router: Router, private mapBox:MapBoxComponent) { }

  private addresses: string[]=[];   //Simple way -> Should improved with Class Creation
  private addressesString: string[][]=[];

  ngOnInit() {}

  search(event:any){
    const searchTerm= event.target.value.toLowerCase();
    if(searchTerm && searchTerm.length >0){
      this.mapIntegration.searchAddress(searchTerm).subscribe((features:Feature[])=>{
        console.log(features);
       this.addresses=features.map(feat=> feat.place_name);
       this.addressesString = features.map(feat => [feat.geometry.coordinates,feat.place_name]);
       console.log(this.addressesString);
      });
    } else{
      this.addresses=[];
    }
  }

  onSelect(address:any){
    this.routingUserService.setFinishPoint(address).then(()=>{
      this.addresses=[];
      this.addressesString=[];
      this.mapStart.setShowMain();
    });
    // Change to Show options --> Animation 
  }

}
