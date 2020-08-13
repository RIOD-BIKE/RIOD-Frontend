import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, NavController, IonReorderGroup } from '@ionic/angular';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { UserService } from 'src/app/services/user/user.service';
import { iconShortcut, miniShortcut } from 'src/app/Classess/map/map';
import { LOADIPHLPAPI } from 'dns';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-favorite',
  templateUrl: './edit-favorite.component.html',
  styleUrls: ['./edit-favorite.component.scss'],
})
export class EditFavoriteComponent implements OnInit {
  public favorList: miniShortcut[] = [];
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  public hideTrash = false;
  public hideChange = false;
  public hideSave = true;

  constructor(
    private modalController: ModalController,
    private routingUserService: RoutingUserService,
    private userService: UserService,
    private router: Router,
    private navController: NavController

  ) { }

  ngOnInit() {
    this.loadShortcuts();
    // this.userService.updateFavor.subscribe( a => {
    //   if (a) {
    //     this.userService.getAllShortcuts();
    //   }
    // });
  }

  loadShortcuts() {
    this.userService.getAllShortcuts().then((allShortcuts) => {
      let temp: iconShortcut[] = [];
      temp = allShortcuts;
      console.log(allShortcuts);
      for (const route of temp) {
        console.log(route.address);
        const splitString = route.address.split(",");
       // console.log(splitString); 
        const splitPLz = splitString[2].toString().split(" ");
        // console.log(splitPLz);

        const city = splitPLz[1];
        const street = splitString[0] + ", " + splitString[1]; 

      //  console.log(city + street);
        this.favorList.push(new miniShortcut(route.iconName, street, city, route));
      }
    });
  }

  changeSequence(){
    // this.navController.navigateForward('edit-favor-sequence');
    this.hideTrash = !this.hideTrash;
    this.hideChange = !this.hideChange;
    this.hideSave = !this.hideSave;
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }

  doReorder(ev: any) {
    this.favorList = ev.detail.complete(this.favorList);
  }

// save all changes send icon list with new order to storage
  saveChanges() {
    const newIconOrder: iconShortcut[] = [];
    for (let i = 0; i < this.favorList.length; i++) {
      this.favorList[i].icon.orderNumber = i;
      newIconOrder.push(this.favorList[i].icon);
    }
    console.log(newIconOrder);
    this.userService.saveAllShortcuts(newIconOrder);
    this.back();
  }

  back() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  deleteFavor(shortcut: miniShortcut) {
    this.userService.deleteShortcut(shortcut.icon).then(x => {
      this.userService.updateFavor.next(true);
      this.favorList = this.favorList.filter(item => item !== shortcut);
    });
  }
  saveRoute(){}
}
