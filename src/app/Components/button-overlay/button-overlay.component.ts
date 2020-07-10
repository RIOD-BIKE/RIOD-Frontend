import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-button-overlay',
  templateUrl: './button-overlay.component.html',
  styleUrls: ['./button-overlay.component.scss'],
})
export class ButtonOverlayComponent implements OnInit {

  constructor(private modalController: ModalController,private routingUserService:RoutingUserService,private userService:UserService) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss({
        'dismissed': true
      });
    }


    saveIconAddress(iconNumber){
    this.routingUserService.getfinishPoint().then(address => {
      console.log(iconNumber)
      this.userService.saveShortcut(address,iconNumber);
    });
  }

}
