import { ModalController } from "@ionic/angular";
import { ButtonOverlayComponent } from "./../button-overlay/button-overlay.component";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { RoutingUserService } from "src/app/services/routing-user/routing-user.service";
import { MapBoxComponent } from "../map-box/map-box.component";
import { MapIntegrationService } from "src/app/services/map-integration/map-integration.service";
import { Feature, iconShortcut, recentShortcut } from "../../Classess/map/map";
import { UserService } from "src/app/services/user/user.service";
import { NavController } from "@ionic/angular";
import { UsersDataFetchService } from "src/app/services/users-data-fetch/users-data-fetch.service";

@Component({
  selector: "search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"],
})
export class SearchBarComponent implements OnInit {
  public addressesString: recentShortcut[] = [];
  @Input() shortcuts: iconShortcut[] = [];
  @Input() recentRoutes: recentShortcut[] = [];
  public specialAvatarURL = "../../../assets/settings/profile-pic.jpg";
  @Input() searchBarInputV = "";
  @ViewChild("inputField") inputField;
  searchBarOpen = false;
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
    this.routingUserService.routeFinished.subscribe((value) => {
      if (value == true) {
        this.clear();
        this.routingUserService.setRouteFinished();
      }
    });
    // Temp before saving and edit components are available
    this.shortcuts.push(
      new iconShortcut(
        "home-outline",
        1,
        "Klingensberg 9, 49074 Osnabrück, Germany",
        [8.04098, 52.279913]
      )
    );
    this.shortcuts.push(
      new iconShortcut(
        "briefcase-outline",
        2,
        "Barbarastraße 20, 49076 Osnabrück, Germany",
        [8.022824, 52.284357]
      )
    );
    this.shortcuts.push(
      new iconShortcut(
        "heart-outline",
        3,
        "Jakobstraße, 49074 Osnabrück, Germany",
        [8.0425307, 52.2787108]
      )
    );
    this.search();
    this.userService.getAllShortcuts().then((allRoutes) => {
      if (allRoutes.length > 0) {
        // this.shortcuts=allRoutes; //override temporary
      }
      if (this.shortcuts.length == 0) {
        document.getElementById("with-content").hidden = true;
        document.getElementById("edit-no-content").hidden = false;
      } else {
        document.getElementById("with-content").hidden = false;
        document.getElementById("edit-no-content").hidden = true;
      }
    });
    this.mapIntegration.getAllSavedRoutes().then((allSavedRoutes) => {
      const temp = [];
      for (const route of allSavedRoutes) {
        const checkArray = this.shortcuts.filter(
          (e) => e["address"] === route.endPosition[1]
        );
        const splitString = route.endPosition[1].split(",");
        const splitPLz = splitString[1].toString().split(" ");
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
              "null",
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
    document.getElementById("recents-results").hidden = true;

    this.userDataFetch.storage_getSpecialAvatarURL().then((url) => {
      this.specialAvatarURL = url;
    });
  }

  back() {
    this.searchBarOpen = false;
    document.getElementById("recents-results").hidden = true;
    document.getElementById("search-results").hidden = true;
    document.getElementById("back").style.display = "none";
    document.getElementById("cross").hidden = true;
    document.getElementById("no-recent-content").hidden = true;
    document.getElementById("with-content").hidden = false;
    document.getElementById("wrap").style.width = "100%";
    if(this.searchBarInputV.length != 0){
      document.getElementById("saveBtn").hidden = false;
      document.getElementById("avaBtn").hidden = true;
    } else {
      document.getElementById("saveBtn").hidden = true;
      document.getElementById("avaBtn").hidden = false;
    }
    const over = document.getElementById("over");
    over.style.height = "auto";
    over.style.borderBottomLeftRadius = "10px";
    over.style.borderBottomRightRadius = "10px";
    if (this.shortcuts.length == 0) {
      document.getElementById("no-content").hidden = false;
      document.getElementById("edit-no-content").hidden = false;
    } else {
      document.getElementById("no-content").hidden = true;
      document.getElementById("edit-no-content").hidden = true;
    }
  }

  onTouchSearch() {
    this.mapIntegration.getAllSavedRoutes().then((allSavedRoutes) => {
      const temp = [];
      for (const route of allSavedRoutes) {
        const checkArray = this.shortcuts.filter(
          (e) => e["address"] === route.endPosition[1]
        );
        const splitString = route.endPosition[1].split(",");
        const splitPLz = splitString[1].toString().split(" ");
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
              "null",
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
    if (this.searchBarInputV.length > 0) {
      if (this.addressesString.length == 0) {
        document.getElementById("search-results").hidden = true;
      } else {
        document.getElementById("search-results").hidden = false;
      }
      document.getElementById("no-recent-content").hidden = true;
      document.getElementById("cross").hidden = false;
    } else {
      if (this.recentRoutes.length > 0) {
        document.getElementById("recents-results").hidden = false;
        document.getElementById("no-recent-content").hidden = true;
      } else {
        if (this.addressesString.length == 0) {
          document.getElementById("recents-results").hidden = true;
        }
        document.getElementById("no-recent-content").hidden = false;
      }
    }
    if (this.addressesString.length == 0) {
      document.getElementById("search-results").hidden = true;
    }
    const wrap = document.getElementById("wrap");
    wrap.style.width = "85%";
    wrap.style.marginLeft = "10px";
    wrap.style.float = "right";
    wrap.style.transitionDuration = "0.2s";
    const arrow = document.getElementById("arrow");
    arrow.style.position = "fixed";
    arrow.style.float = "left";
    arrow.style.display = "block";
    arrow.style.visibility = "visible";

    document.getElementById("avaBtn").hidden = true;

    document.getElementById("back").style.display = "block";

    const over = document.getElementById("over");
    over.style.height = "100vh";
    over.style.borderBottomLeftRadius = "0px";
    over.style.borderBottomRightRadius = "0px";
    over.style.transition = "2s !important";
    if (this.shortcuts.length == 0) {
      document.getElementById("no-content").hidden = true;
      document.getElementById("edit-no-content").hidden = false;
      document.getElementById("with-content").hidden = true;
    } else {
      document.getElementById("edit-no-content").hidden = true;
      document.getElementById("with-content").hidden = false;
    }
  }

  search() {
    // SearchString is again empty
    if (this.searchBarInputV == "") {
      this.addressesString = [];
      this.searchBarInputV = "";
      if (this.recentRoutes.length > 0) {
        document.getElementById("recents-results").hidden = false;
      } else {
        document.getElementById("recents-results").hidden = true;
      }
      document.getElementById("no-address").hidden = true;
    }
    const searchTerm = this.searchBarInputV.toLocaleLowerCase();
    // SearchString is not Empty -> Display Cross //could be improved -> html <ion-input debounde="400"[<- Problem, only 400ms function play] \>
    if (searchTerm.length > 0) {
      document.getElementById("cross").hidden = false;
    } else {
      document.getElementById("cross").hidden = true;
    }
    // Searchterm valid for GeoSearch-MapBox
    if (searchTerm.length > 2) {
      if (this.searchBarInputV != "") {
        document.getElementById("no-recent-content").hidden = true;
        document.getElementById("recents-results").hidden = true;
        document.getElementById("search-results").hidden = false;
      }
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
                  e["address"].split(", ")[0].toString(),
                  con[1].split(", ")[0].toString()
                ) > 70
              ) {
                return true;
              } else {
                return false;
              }
            });

            const splitString = con[1].split(",");
            const splitPLz = splitString[1].toString().split(" ");
            const city = splitPLz[2];
            const street = splitString[0];
            if (/^\d+$/.test(street) == false) {
              if (checkArray.length >= 1) {
                // IF-Case for their are similar Routes to the searchResults -> Then musst add to HTML
                if (con[2] != undefined) {
                  // outdated -> place_name[0]/[1] <-- If Result of GeoSearch is place or only street Adress
                  tempArray.push(
                    new recentShortcut("null", street, con[2], con[1], con[0])
                  );
                } else {
                  tempArray.push(
                    new recentShortcut("null", street, city, con[1], con[0])
                  );
                }
              } else {
                if (con[2] != undefined) {
                  tempArray.push(
                    new recentShortcut("null", street, con[2], con[1], con[0])
                  );
                } else {
                  tempArray.push(
                    new recentShortcut("null", street, city, con[1], con[0])
                  );
                }
              }
            }
          });
          if (tempArray.length > 0) {
            document.getElementById("no-address").hidden = true;
          } else {
            document.getElementById("no-address").hidden = false;
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
  similar(a, b) {
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

  onSelect(coords, address, street, city) {
    this.routingUserService.setFinishPoint([coords, address]).then(() => {
      this.routingUserService.deleteAllPoints().then(() => {
        this.mapBox.removeRoute().then(() => {
          this.mapBox.disableAssemblyClick().then(() => {
            this.mapBox.updateAssemblyPoints();
            this.mapBox.drawFinishMarker().then((x) => {
              if (x == true) {
                this.routingUserService.getPoints().then((points) => {
                  let pointString = "";
                  for (let i = 0; i < points.length; i++) {
                    pointString +=
                      points[i].position.longitude +
                      "," +
                      points[i].position.latitude +
                      ";";
                  }
                  this.mapBox.drawRoute(pointString).then(() => {
                    this.back();
                    this.routingUserService.setDisplayType("Route_Info");
                  });
                });
              } else {
                this.back();
                this.routingUserService.setDisplayType("Main");
                this.searchBarOpen = false;
              }
              this.searchBarInputV = address;
              console.log(city);
              this.selectedRoute = [address, street, city];
              console.log(this.selectedRoute);
              this.userService.behaviorFavorite.next(this.selectedRoute);
            });
          });
        });
      });
    });
  }

  isSearchEmpty(searchBarInputV: string) {
    if (
      searchBarInputV != "" &&
      searchBarInputV.length >= 3 &&
      this.addressesString.length >= 1
    ) {
      return true;
    }
    return false;
  }

  clear() {
    this.searchBarInputV = "";
    this.addressesString = [];
    if (this.searchBarOpen == true) {
      if (this.recentRoutes.length > 0) {
        document.getElementById("recents-results").hidden = false;
      } else {
        document.getElementById("recents-results").hidden = true;
        document.getElementById("no-recent-content").hidden = false;
      }
      document.getElementById("cross").hidden = true;

      this.inputField.setFocus();
      document.getElementById("no-address").hidden = true;
    } else {
      document.getElementById("recents-results").hidden = true;
    }
    document.getElementById("search-results").hidden = true;
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

  openSettings() {
    this.navCtrl.navigateForward("settings-main-dropbox");
  }
}
