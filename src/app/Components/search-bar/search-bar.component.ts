import { Component, OnInit,Input, NgZone } from '@angular/core';
import { MapBoxComponent } from '../map-box/map-box.component';
import { MapIntegrationService, Feature  } from 'src/app/services/map-integration/map-integration.service';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';


@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Input() searchBarInputV = '';
  public addressesString: string[][] = [];
  constructor(private routingUserService: RoutingUserService,
              private mapIntegration: MapIntegrationService, private mapBox: MapBoxComponent, private change:NgZone) { }

  ngOnInit() {

  }

  search(event) {
    const searchTerm = this.searchBarInputV.toLowerCase();
    if(searchTerm && searchTerm.length > 0) {
      this.mapIntegration.searchAddress(searchTerm).subscribe((features: Feature[]) => {
        this.addressesString = features.map(feat => [feat.geometry.coordinates, feat.place_name]);
      });
    }
  }

  onSelect(address: any){
    this.routingUserService.setFinishPoint(address).then(() => {
      this.routingUserService.deleteAllPoints().then(() => {
        this.mapBox.removeRoute().then(() => {
          this.mapBox.disableAssemblyClick().then(() => {
            this.mapBox.updateAssemblyPoints();
            this.routingUserService.getfinishPoint().then(x => {
              this.mapBox.drawFinishMarker();
              this.addressesString = [];
              // this.mapStart.setShowMain();
              this.routingUserService.setDisplayType('Main');
            });
          });
        });
      });
    });
  }



  reset() {
    console.log('hup');
    this.searchBarInputV = '';
    console.log(this.searchBarInputV);
    this.change.run(() => {
      this.searchBarInputV = '';
    });

  }

}
