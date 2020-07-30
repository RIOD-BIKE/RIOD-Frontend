import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { RoutingUserService } from "src/app/services/routing-user/routing-user.service";
import { UserService } from "src/app/services/user/user.service";

@Component({
  selector: "app-button-overlay",
  templateUrl: "./button-overlay.component.html",
  styleUrls: ["./button-overlay.component.scss"],
})
export class ButtonOverlayComponent implements OnInit {
  public city: any = "";
  public street: any = "";
  public favorite: any = "";
  public saveAddress: any = "";
  public plz: any = [];
  
  
  constructor(
    private modalController: ModalController,
    private routingUserService: RoutingUserService,
    private userService: UserService
  ) {}

  ngOnInit() {
  
    this.street = this.userService.behaviorFavorite.value[1];
    this.city = this.userService.behaviorFavorite.value[2];
    this.plz = this.userService.behaviorFavorite.value[3];
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  saveIconAddress(iconNumber) {
    this.routingUserService.getfinishPoint().then((address) => {
      console.log(iconNumber + " " + address);
      this.favorite = iconNumber;
      this.saveAddress = address[1];
    });
  }
  saveFavor(){ 
    console.log(this.saveAddress + " " + this.favorite);
    this.userService.saveShortcut(this.saveAddress, this.favorite, this.plz );
    this.userService.updateFavor.next(true);
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
