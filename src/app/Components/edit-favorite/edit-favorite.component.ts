import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-edit-favorite',
  templateUrl: './edit-favorite.component.html',
  styleUrls: ['./edit-favorite.component.scss'],
})
export class EditFavoriteComponent implements OnInit {

  constructor(
    private modalController: ModalController,
    private routingUserService: RoutingUserService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getAllShortcuts()
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  back(){
    this.dismiss();
  }
}
