import { Component, OnInit,Input } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { MapBoxComponent } from '../map-box/map-box.component';
import { Subscription } from 'rxjs';
import { RoutingGeoAssemblyPoint } from 'src/app/Classess/map/map';
import { MapIntegrationService, Feature } from 'src/app/services/map-integration/map-integration.service';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {

  @Input() private selectedAddresses;
  @Input() private selectedStartAddresses;
  

  private addressesString: any[]= [];
  private addressesStartString: any[]= [];
  private points:RoutingGeoAssemblyPoint[]=[];
  private start;
  private addresses;
  private routingAddress;
  private routingStartAddress;

  constructor(private mapIntegration:MapIntegrationService,private mapBox: MapBoxComponent ,private userService: UserService, private routingUserService:RoutingUserService) {  
    //this.init();
    //this.points[0]= new RoutingGeoAssemblyPoint(0,0,"+++",null);

  }

  setUpStart(){
    this.routingUserService.getfinishPoint().then(x => {
      if(this.userService.getfirstTimeCalling() == true) {
        this.userService.getUserPosition().then(() => {
          this.start = this.userService.behaviorMyOwnPosition.value;
        });
      } else {
        this.start = this.userService.behaviorMyOwnPosition.value;
      }
    })
  }

  init(){
    this.routingUserService.getCenterPointObs().subscribe((newAP) => {
      for(let i = 0; i < this.points.length && i <= 2; i++) {
        if(this.points[i].name === '+++') {
          for(let y=0;y<this.points.length;y++) {
            if (this.points[y].name === newAP.name) {
              console.log('CATCH - Dieser AP ist schon ausgewählt worden');
              return;
              }else {
                this.points[i] = newAP;
                if (i < 2) {
                  // this.points[i+1]=new RoutingGeoAssemblyPoint(0,0,"+++",null);
                }
                this.routingUserService.setPoints(newAP);
                return;
              }
            }
        }
      }
    });
  }

  chooseAP(){
    this.mapBox.toggleAssemblyPointLayerVisibility();
    console.log('Choose AssemblyPoint');
  }

  searchStart(event: any) {
    if (this.routingStartAddress != this.selectedStartAddresses){
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length >0) {
      this.mapIntegration.searchAddress(searchTerm).subscribe((features: Feature[]) => {
        console.log(features);
        this.addresses = features.map(feat => feat.place_name);
        this.addressesStartString = features.map(feat => [feat.geometry.coordinates, feat.place_name]);
        console.log(this.addressesStartString);
      });
    } else{
      this.addresses=[];
    }
    }
  }
  onStartSelect(address: any) {
  
     this.routingUserService.setStartPoint().then(() => {
      this.selectedStartAddresses = address[1];
      this.routingStartAddress = address[1];

      this.routingUserService.setStartPoint(address);
      this.routingUserService.getstartPoint().then(x => {
        console.log(x);
      })
      console.log('Selected StartPoint' + this.routingUserService.getstartPoint());
      this.addresses = [];
      this.addressesStartString = [];
    });
  }

 

  search(event: any) {
    if (this.routingAddress != this.selectedAddresses) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapIntegration.searchAddress(searchTerm).subscribe((features: Feature[]) => {
        console.log(features);
        this.addresses = features.map(feat => feat.place_name);
        this.addressesString = features.map(feat => [feat.geometry.coordinates,feat.place_name]);
        console.log(this.addressesString);
      });
    } else {
      this.addresses = [];
    }
    }
  }

  onSelect(address: any) {
    this.routingUserService.setFinishPoint(address).then( () => {
      this.selectedAddresses = address[1];
      this.routingAddress = address[1];
      
      console.log('Selected FinishPoint' + this.routingUserService.getfinishPoint());
      this.addresses = [];
      this.addressesString = [];
    });
  }
  closeView() {
    this.addressesStartString = [];
    this.addressesString = [];
    this.points = [];
    this.routingStartAddress = null;
    this.routingAddress = null;
    console.log('closed');

  }


  ngOnInit() { }





}
