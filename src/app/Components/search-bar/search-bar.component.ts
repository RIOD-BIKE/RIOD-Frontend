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
  locArray = [
    { "name": "home", "street": "Wiesenbachstraße 20b", "city":"Osnabrück" },
    { "name": "work", "street": "Sutthauserstraße 52", "city":"Osnabrück"},
    { "name": "heart", "street": "Heinrichstraße 37", "city":"Osnabrück" }
  ];
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

    if (this.locArray.length == 0) {
      var a = document.getElementById("no-content");
      var b = document.getElementById("with-content");
      var c = document.getElementById("edit-no-content");
      var edit3 = document.getElementById("edit-span");
      a.hidden = false;
      b.hidden = true;
      c.hidden = true;
      edit3.hidden = true;
    } else {
      var a = document.getElementById("no-content");
      var b = document.getElementById("with-content");
      var c = document.getElementById("edit-no-content");
      var edit3 = document.getElementById("edit-span");
      a.hidden = true;
      b.hidden = false;
      c.hidden = true;
      edit3.hidden = true;
    }
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

  back() {
    var back = document.getElementById("back");
    var noContent = document.getElementById("no-content");
    var c = document.getElementById("edit-no-content");
    back.style.display = "none";
    var over = document.getElementById("over");
    var edit3 = document.getElementById("edit-span");
    over.style.height = "auto";
    over.style.borderBottomLeftRadius = "10px";
    over.style.borderBottomRightRadius = "10px";
    edit3.hidden = true;
    if (this.locArray.length == 0) {
      noContent.hidden = false;
      c.hidden = true;
    } else {
      noContent.hidden = true;
    }
  }
  onTouchSearch() {
    var back = document.getElementById("back");
    back.style.display = "block";
    var over = document.getElementById("over");
    over.style.height = "100vh";
    over.style.borderBottomLeftRadius = "0px";
    over.style.borderBottomRightRadius = "0px";
    over.style.transition = "2s !important";
    if (this.locArray.length == 0) {
      var noContent = document.getElementById("no-content");
      var edit1 = document.getElementById("edit-no-content");
      var edit2 = document.getElementById("with-content");
      var edit3 = document.getElementById("edit-span");
      noContent.hidden = true;
      edit1.hidden = false;
      edit2.hidden = true;
      edit3.hidden = true;
    } else {
      var edit1 = document.getElementById("edit-no-content");
      var edit2 = document.getElementById("with-content");
      var edit3 = document.getElementById("edit-span");
      edit1.hidden = true;
      edit2.hidden = false;
      edit3.hidden = false;
    }
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