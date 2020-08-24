import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonReorderGroup } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { iconShortcut, miniShortcut } from 'src/app/Classess/map/map';

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
  public hideReorder = true;

  constructor(
    private modalController: ModalController,
    private userService: UserService,

  ) { }

  ngOnInit() {

    this.loadShortcuts();
  }

  loadShortcuts() {
    this.userService.getAllShortcuts().then((allShortcuts) => {
      let temp: iconShortcut[] = [];
      temp = allShortcuts;
      for (const route of temp) {
        const splitString = route.address.split(',');
        const splitPLz = splitString[2].toString().split(' ');

        const city = splitPLz[1];
        const street = splitString[0] + ', ' + splitString[1];

        this.favorList.push(new miniShortcut(route.iconName, street, city, route));
      }
    });
  }

  changeSequence() {
    this.hideTrash = !this.hideTrash;
    this.hideChange = !this.hideChange;
    this.hideSave = !this.hideSave;
    this.hideReorder = !this.hideReorder;
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
    this.userService.saveAllShortcuts(newIconOrder).then(() => {
      this.back();
    });
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
  saveRoute() {}
}
