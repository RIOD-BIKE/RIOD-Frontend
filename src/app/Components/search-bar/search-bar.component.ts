import { ModalController } from '@ionic/angular';
import { Component, OnInit,Input, NgZone, HostListener } from '@angular/core';
import { MapBoxComponent } from '../map-box/map-box.component';
import { MapIntegrationService  } from 'src/app/services/map-integration/map-integration.service';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { Feature } from '../../Classess/map/map'
import { feature } from '@turf/turf';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Input() searchBarInputV = '';
  public addressesString: string[][] = [];
  constructor(private routingUserService: RoutingUserService, private modalCtrl: ModalController,
              private mapIntegration: MapIntegrationService, private mapBox: MapBoxComponent, private change:NgZone) { }

  ngOnInit() {
    this.routingUserService.routeFinished.subscribe( value => {
      console.log(value);
      if (value === true) {
        this.clear();
        this.routingUserService.isRouteFinished(false);
      }
    });
  }

  search(event) {
    const searchTerm = this.searchBarInputV.toLowerCase();
    if(searchTerm && searchTerm.length > 0) {
      this.mapIntegration.searchAddress(searchTerm).subscribe((features: Feature[]) => {
        this.addressesString = features.map(feat => [feat.geometry.coordinates, feat.place_name]);
      });
    }
  }

  onSelect(address: string) {
    // console.log(address)
    this.routingUserService.setFinishPoint(address).then(() => {
      this.routingUserService.deleteAllPoints().then(() => {
        this.mapBox.removeRoute().then(() => {
          this.mapBox.disableAssemblyClick().then(() => {
            this.mapBox.updateAssemblyPoints();
            this.routingUserService.getfinishPoint().then(x => {
              this.mapBox.drawFinishMarker().then(x=>{

                if(x == true) {
                  this.routingUserService.getPoints().then(points=>{
                    let pointString = '';
                    for(let i =0; i<points.length;i++){
                        pointString += (points[i].position.longitude + ',' + points[i].position.latitude + ';');
                    }

                    this.mapBox.drawRoute(pointString).then(()=>{
                      this.addressesString = [];
                      // console.log("RouterInfo")
                      this.routingUserService.setDisplayType('Route_Info');
                    });
                  });
                } else {
                  this.addressesString = [];
                  this.routingUserService.setDisplayType('Main');
                }
              });
            });
          });
        });
      });
    });
    this.searchBarInputV = address[1];
  }


  isSearchEmpty(searchBarInputV:string){
    if(searchBarInputV !="" && searchBarInputV.length >= 3 && this.addressesString.length >= 1) {
      return true;
    }
    return false;
  }

  clear() {
    this.searchBarInputV = '';
  }
}
