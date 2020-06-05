import { Component, OnInit,Input } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { MapBoxComponent } from '../map-box/map-box.component';
import { RoutingGeoAssemblyPoint } from 'src/app/Classess/map/map';
import { MapIntegrationService, Feature } from 'src/app/services/map-integration/map-integration.service';
import { MapStartPage } from 'src/app/pages/map/map-start/map-start.page';
@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {

  private AssemblyPoint_1: RoutingGeoAssemblyPoint;
  private AssemblyPoint_2: RoutingGeoAssemblyPoint;
  private AssemblyPoint_3: RoutingGeoAssemblyPoint;
  public addressesString: any[] = []; // [8.063165,52.281136]["Richardstraße 9, 49074 Osnabrück, Germany"];
  private addresses: string[] = [];
  private timeCounter: number;
  private distanceCounter: number;
  private start: string;
  public newStart: any;
  @Input() public selectedAddresses: string;

  constructor(private mapIntegration: MapIntegrationService, private mapBox: MapBoxComponent,
              private userService: UserService, private routingUserService: RoutingUserService) {
    this.init();
  }

  setUpStart() {
    this.routingUserService.getfinishPoint().then( x => {
      // x is Array [0]==coordinates | [1] ==AdressName
    if(this.userService.getfirstTimeCalling() == true) {
      this.userService.getUserPosition().then( () => {
        this.start = this.userService.behaviorMyOwnPosition.value;
        console.log(this.start + 'NewlyDrawn');
      });
    } else {
      this.start = this.userService.behaviorMyOwnPosition.value;
      console.log(this.start + 'GetValueGPS');
    }
    });
    // Create 2 Markers Start/Finish --> Problem: Feature Udates, whe changing Start/Finish Positions
  }

  init() {
    this.routingUserService.getCenterPointObs().subscribe((y) => {

      // Set Values AssemblyPoints 1-3
      console.log('Set values......');
    });
  }

  chooseAP() {
    this.mapBox.toggleAssemblyPointLayerVisibility();
    console.log('Choose AssemblyPoint');
  }

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if(searchTerm && searchTerm.length > 0) {
      this.mapIntegration.searchAddress(searchTerm).subscribe((features: Feature[]) => {
        console.log(features);
        this.addresses = features.map(feat => feat.place_name);
        this.addressesString = features.map(feat => [feat.geometry.coordinates, feat.place_name]);
        console.log(this.addressesString);
      });
    } else {
      this.addresses = [];
    }
  }

  onSelect(address: any) {
    this.routingUserService.setFinishPoint(address).then( () => {
      this.selectedAddresses = address[1];
      this.addresses = [];
      this.addressesString = [];
    });
    // Change to Show options --> Animation
  }


  ngOnInit() { }




}
