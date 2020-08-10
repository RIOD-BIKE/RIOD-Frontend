import { ModalController } from '@ionic/angular';
import { ButtonOverlayComponent } from './../button-overlay/button-overlay.component';
import { Component, OnInit, Input, ViewChild, SystemJsNgModuleLoader } from '@angular/core';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { MapBoxComponent } from '../map-box/map-box.component';
import { MapIntegrationService } from 'src/app/services/map-integration/map-integration.service';
import { Feature, iconShortcut, recentShortcut } from '../../Classess/map/map';
import { UserService } from 'src/app/services/user/user.service';
import { NavController } from '@ionic/angular';
import { UsersDataFetchService } from 'src/app/services/users-data-fetch/users-data-fetch.service';
import { EditFavoriteComponent } from '../edit-favorite/edit-favorite.component';
import { resolve } from 'url';


@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  public addressesString: recentShortcut[] = [];
  @Input() shortcuts: iconShortcut[] = [];
  @Input() recentRoutes: recentShortcut[] = [];
  public specialAvatarURL = '../../../assets/settings/profile-pic.jpg';
  @Input() searchBarInputV = '';
  public iconNew: any = '';
  @ViewChild('inputField') inputField: any;
  searchBarOpen = false;
  public hideIcon = true;
  private selectedRoute: string[];
  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private routingUserService: RoutingUserService,
    private mapBox: MapBoxComponent,
    private modalController: ModalController,
    private mapIntegration: MapIntegrationService,
    private userDataFetch: UsersDataFetchService
  ) {}

  async ngOnInit() {
    this.favorUpdate();
    this.userService.updateFavor.subscribe((a) => {
      if (a) {
        this.favorUpdate().then(l => {
        });
      }
    });
  }

   favorUpdate(): Promise<any> {
    return new Promise<any>(resolve => {
   this.routingUserService.routeFinished.subscribe((value) => {
    if (value) {
      document.getElementById('saveBtn').hidden = true;
      this.clear();
      this.routingUserService.setRouteFinished();
    }
  });

   this.userService.getAllShortcuts().then((allShortcuts) => {

    this.shortcuts = allShortcuts;
    console.log(this.shortcuts.length);
    if (this.shortcuts.length == 0) {
      document.getElementById('with-content').hidden = true;
      document.getElementById('edit-no-content').hidden = false;
    } else {
      document.getElementById('with-content').hidden = false;
      document.getElementById('edit-no-content').hidden = true;
    }
  });
   this.mapIntegration.getAllSavedRoutes().then((allSavedRoutes) => {
    const temp = [];
    for (const route of allSavedRoutes) {
      const checkArray = this.shortcuts.filter(
        (e) => e['address'] === route.endPosition[1]
      );
      const splitString = route.endPosition[1].split(',');
      const splitPLz = splitString[1].toString().split(' ');
      const city = splitPLz[2];
      const street = splitString[0];
      if (checkArray.length >= 1) {
        temp.push(
          new recentShortcut(
            checkArray[0].iconName,
            street,
            city,
            route.endPosition[1],
            route.endPosition[0]
          )
        );
      } else {
        temp.push(
          new recentShortcut(
            'null',
            street,
            city,
            route.endPosition[1],
            route.endPosition[0]
          )
        );
      }
    }
    temp.reverse();
    this.recentRoutes = temp.slice(0, 8);
  });
   document.getElementById('recent-results').hidden = true;

   this.userDataFetch.storage_getSpecialAvatar().then(x => {
      this.specialAvatarURL = x;
    });
    resolve;
  });
  }

  back() {

    this.searchBarOpen = false;
    document.getElementById('edit-with-content').hidden = true;
    document.getElementById('no-recent-content').hidden = true;
    document.getElementById('recent-results').hidden = true;
    document.getElementById('search-results').hidden = true;
    document.getElementById('back').style.display = 'none';
    document.getElementById('cross').hidden = true;
    document.getElementById('with-content').hidden = false;
    document.getElementById('wrap').style.width = '100%';
    if (this.searchBarInputV.length > 0) {
      console.log('should be vissible');
      document.getElementById('saveBtn').hidden = false;
      document.getElementById('avaBtn').hidden = true;
    } else {
      document.getElementById('saveBtn').hidden = true;
      document.getElementById('avaBtn').hidden = false;
    }
    const over = document.getElementById('over');
    over.style.height = 'auto';
    over.style.borderBottomLeftRadius = '10px';
    over.style.borderBottomRightRadius = '10px';
    if (this.shortcuts.length == 0) {
      // document.getElementById("no-content").hidden = false;
      // document.getElementById("edit-no-content").hidden = true;
    } else {
      // document.getElementById("no-content").hidden = true;
      // document.getElementById("edit-no-content").hidden = false;
    }
    if (this.iconNew != '' && this.searchBarInputV.length > 0) {
      console.log('this.ICONNEW != \'\'');
      this.hideIcon = false;
      document.getElementById('saveBtn').hidden = true;
      document.getElementById('cross').hidden = true;
      document.getElementById('avaBtn').hidden = true;

    } else {
      if (this.searchBarInputV.length < 1) {
        this.iconNew = '';
        console.log('this.ICONNEW22 != \'\'');
        document.getElementById('saveBtn').hidden = true;
        this.hideIcon = true;
        document.getElementById('avaBtn').hidden = false;
      } else {
        console.log('this.ICONNEW33 != \'\'');
        document.getElementById('saveBtn').hidden = false;
        this.hideIcon = true;
        document.getElementById('avaBtn').hidden = true;
      }
    }
    this.routingUserService.setDisplaySwitchCase(true);
  }

  onTouchSearch() {
    this.routingUserService.setDisplaySwitchCase(false);

    document.getElementById('saveBtn').hidden = true;
    this.mapIntegration.getAllSavedRoutes().then((allSavedRoutes) => {
      const temp = [];
      for (const route of allSavedRoutes) {
        const checkArray = this.shortcuts.filter(
          (e) => e['address'] === route.endPosition[1]
        );
        const splitString = route.endPosition[1].split(',');
        const splitPLz = splitString[1].toString().split(' ');
        const city = splitPLz[2];
        const street = splitString[0];
        if (checkArray.length >= 1) {
          temp.push(
            new recentShortcut(
              checkArray[0].iconName,
              street,
              city,
              route.endPosition[1],
              route.endPosition[0]
            )
          );
        } else {
          temp.push(
            new recentShortcut(
              'null',
              street,
              city,
              route.endPosition[1],
              route.endPosition[0]
            )
          );
        }
      }
      temp.reverse();
      this.recentRoutes = temp.slice(0, 8);
    });
    this.searchBarOpen = true;

    document.getElementById('saveBtn').hidden = true;
    if (this.addressesString.length == 0 && this.searchBarInputV.length == 0) {
      document.getElementById('recent-results').hidden = true;
      document.getElementById('search-results').hidden = true;
      document.getElementById('cross').hidden = true;
    } else {
      if (this.recentRoutes.length > 0) {
        document.getElementById('recent-results').hidden = false;
      }
      document.getElementById('search-results').hidden = false;
      document.getElementById('cross').hidden = false;
      this.hideIcon = true;

    }

    if (this.searchBarInputV.length <= 2 && this.recentRoutes.length == 0) {
      document.getElementById('no-recent-content').hidden = false;
    } else {
      document.getElementById('no-recent-content').hidden = true;
    }

    const wrap = document.getElementById('wrap');
    wrap.style.width = '85%';
    wrap.style.marginLeft = '10px';
    wrap.style.float = 'right';
    wrap.style.transitionDuration = '0.2s';
    const arrow = document.getElementById('arrow');
    arrow.style.position = 'fixed';
    arrow.style.float = 'left';
    arrow.style.display = 'block';
    arrow.style.visibility = 'visible';
    if (this.shortcuts.length != 0) {
      document.getElementById('edit-with-content').hidden = false;
    }
    document.getElementById('avaBtn').hidden = true;
    this.hideIcon = true;
    document.getElementById('back').style.display = 'block';

    const over = document.getElementById('over');
    over.style.height = '100vh';
    over.style.borderBottomLeftRadius = '0px';
    over.style.borderBottomRightRadius = '0px';
    over.style.transition = '2s !important';
    if (this.shortcuts.length == 0) {
      // document.getElementById("no-content").hidden = true;
      // document.getElementById("edit-no-content").hidden = false;
      // document.getElementById("with-content").hidden = true;
    } else {
      // document.getElementById("edit-no-content").hidden = true;
      // document.getElementById("with-content").hidden = false;
    }
  }

  search() {
    if (this.searchBarInputV == '') {
      this.addressesString = [];
      this.searchBarInputV = '';
      if (this.recentRoutes.length > 0) {
        document.getElementById('recent-results').hidden = false;
        document.getElementById('no-recent-content').hidden = true;
      } else {
        document.getElementById('recent-results').hidden = true;
        document.getElementById('no-recent-content').hidden = false;
      }
      document.getElementById('no-address').hidden = true;
    }
    const searchTerm = this.searchBarInputV.toLocaleLowerCase();
    // SearchString is not Empty -> Display Cross //could be improved -> html <ion-input debounde="400"[<- Problem, only 400ms function play] \>
    if (searchTerm.length > 0) {
      document.getElementById('cross').hidden = false;
    } else {
      document.getElementById('cross').hidden = true;
    }
    // Searchterm valid for GeoSearch-MapBox
    if (searchTerm.length > 2) {

      document.getElementById('no-recent-content').hidden = true;
      document.getElementById('recent-results').hidden = true;
      document.getElementById('search-results').hidden = false;

      this.mapIntegration
        .searchAddress(searchTerm)
        .subscribe((features: Feature[]) => {
          const tempArray = [];
          const temp = features.map((feat) => [
            feat.geometry.coordinates,
            feat.place_name,
            feat.properties.address,
          ]);
          temp.forEach((con) => {
            // filter recent Routes with Search Results -> First Step for adding Similar Results from recent Routes to Search Results for similar Address
            const checkArray = this.recentRoutes.filter((e) => {
              // check if searched Result is min. 70% similar to recentRoutes [IonicStorage]
              if (
                this.similar(
                  e['address'].split(', ')[0].toString(),
                  con[1].split(', ')[0].toString()
                ) > 70
              ) {
                return true;
              } else {
                return false;
              }
            });

            const splitString = con[1].split(',');
            const splitPLz = splitString[1].toString().split(' ');
            const city = splitPLz[2];
            const street = splitString[0];
            if (/^\d+$/.test(street) == false) {
              if (checkArray.length >= 1) {
                // IF-Case for their are similar Routes to the searchResults -> Then musst add to HTML
                if (con[2] != undefined) {
                  // outdated -> place_name[0]/[1] <-- If Result of GeoSearch is place or only street Adress
                  tempArray.push(
                    new recentShortcut('null', street, con[2], con[1], con[0])
                  );
                } else {
                  tempArray.push(
                    new recentShortcut('null', street, city, con[1], con[0])
                  );
                }
              } else {
                if (con[2] != undefined) {
                  tempArray.push(
                    new recentShortcut('null', street, con[2], con[1], con[0])
                  );
                } else {
                  tempArray.push(
                    new recentShortcut('null', street, city, con[1], con[0])
                  );
                }
              }
            }
          });
          if (tempArray.length > 0) {
            document.getElementById('no-address').hidden = true;
          } else {
            document.getElementById('no-address').hidden = false;
          }
          if (
            JSON.stringify(this.addressesString) !=
            JSON.stringify(tempArray.slice(0, 11))
          ) {
            // similar/-same Result-Arrays are not updating FrontEnd [animation]
            this.addressesString = tempArray.slice(0, 11);
          }
        });
    }
  }

  // check Address-String similarity
  similar(a: string | any[], b: string | any[]) {
    let equivalency = 0;
    const minLength = a.length > b.length ? b.length : a.length;
    const maxLength = a.length < b.length ? b.length : a.length;
    for (let i = 0; i < minLength; i++) {
      if (a[i] == b[i]) {
        equivalency++;
      }
    }
    const weight = equivalency / maxLength;
    return weight * 100;
  }

  onSelect(coords: string, address: string, street: string, city: string, icon: string) {
    document.getElementById('cross').hidden = true;
    this.back();
    this.iconNew = icon;
    console.log(this.iconNew);
    if (icon == '') {
      console.log('nulllslls');
      this.hideIcon = true;
      document.getElementById('saveBtn').hidden = true;
      document.getElementById('cross').hidden = true;
      document.getElementById('avaBtn').hidden = true;

    } else {
      document.getElementById('saveBtn').hidden = true;
      document.getElementById('cross').hidden = true;
      document.getElementById('avaBtn').hidden = true;

      this.hideIcon = false;
      // this.iconNew ="";

    }
    this.routingUserService.setDisplaySwitchCase(true);
    this.routingUserService.setFinishPoint([coords, address]).then(() => {
      this.routingUserService.deleteAllPoints().then(() => {
        this.mapBox.removeRoute().then(() => {
          this.mapBox.disableAssemblyClick().then(() => {
            this.mapBox.updateAssemblyPoints();
            this.mapBox.drawFinishMarker().then((x) => {
              if (x == true) {
                this.routingUserService.getPoints().then((points) => {
                  let pointString = '';
                  for (let i = 0; i < points.length; i++) {
                    pointString +=
                      points[i].position.longitude +
                      ',' +
                      points[i].position.latitude +
                      ';';
                  }
                  this.mapBox.drawRoute(pointString).then(() => {

                    this.routingUserService.setDisplayType('Route_Info');
                    this.searchBarOpen = false;
                  });
                });
              } else {

                this.routingUserService.setDisplayType('Main');
                this.searchBarOpen = false;
              }
              this.searchBarInputV = address;
              this.selectedRoute = [address, street, city, coords];
              this.userService.behaviorFavorite.next(this.selectedRoute);
            });
          });
        });
      });
    });
  }

  isSearchEmpty(searchBarInputV: string) {
    if (
      searchBarInputV != '' &&
      searchBarInputV.length >= 3 &&
      this.addressesString.length >= 1
    ) {
      return true;
    }
    return false;
  }

  clear() {

    this.searchBarInputV = '';
    this.addressesString = [];
    console.log(this.searchBarOpen);
    if (this.searchBarOpen == true) {
      this.search;
    } else {
      this.iconNew = '';
      this.searchBarInputV = '';
      this.back;

      document.getElementById('avaBtn').hidden = false;
      this.hideIcon = true;

    }
  }

  saveRoute() {
    this.presentModal();
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ButtonOverlayComponent,
    });
    return await modal.present();
  }
  editFavor() {
    this.editModal();
  }

  async editModal() {
    const modal2 = await this.modalController.create({
      component: EditFavoriteComponent,
    });
    return await modal2.present();
  }

  openSettings() {
    this.navCtrl.navigateForward('settings-main-dropbox');
  }
}
