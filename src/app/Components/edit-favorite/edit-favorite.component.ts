import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
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

  constructor(
    private modalController: ModalController,
    private routingUserService: RoutingUserService,
    private userService: UserService,
    private router: Router,
    private navController: NavController

  ) { }

  ngOnInit() {
    this.loadShortcuts();
    this.userService.updateFavor.subscribe( a => {
      if (a) {
        this.userService.getAllShortcuts();
      }
    });
  }

  loadShortcuts() {
    this.userService.getAllShortcuts().then((allShortcuts) => {
      let temp: iconShortcut[] = [];
      temp = allShortcuts;

      for (const route of temp) {
        const splitString = route.address.split(",");
       // console.log(splitString); 
        const splitPLz = splitString[2].toString().split(" ");
        console.log(splitPLz);

        const city = splitPLz[1];
        const street = splitString[0] + ", " + splitString[1]; 

      //  console.log(city + street);
        this.favorList.push(new miniShortcut(route.iconName, street, city, route));
      }
    });
  }

  changeSequence(){
    this.navController.navigateForward('edit-favor-sequence');
  }


  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  back(){
    this.dismiss();
  }
  deleteFavor(shortcut: miniShortcut) {
    this.userService.deleteShortcut(shortcut.icon).then(x => {
      this.userService.updateFavor.next(true);
      this.favorList = this.favorList.filter(item => item !== shortcut);
    });
  }
  saveRoute(){}
}
