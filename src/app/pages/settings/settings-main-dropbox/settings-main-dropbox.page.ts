import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersDataFetchService } from 'src/app/services/users-data-fetch/users-data-fetch.service';
import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-settings-main-dropbox',
  templateUrl: './settings-main-dropbox.page.html',
  styleUrls: ['./settings-main-dropbox.page.scss'],
})
export class SettingsMainDropboxPage implements OnInit {

  rangeVolume: string;
  name: string;

  constructor(public platform: Platform, private userDataFetch: UsersDataFetchService, private authService: AuthService,
    private router: Router, private alertController: AlertController, private navController: NavController) {
    this.platform.ready().then(() => {
      this.rangeVolume = "5";
    })
  }

  async ngOnInit() {
    this.name = await this.userDataFetch.firestore_getName(this.authService.getCurrentUID());
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Achtung!',
      message: 'Bist du sicher, dass du deinen Account unwiederbringlich löschen willst? Diese kann nicht rückgängig gemacht werden!',
      buttons: [
        {
          text: 'Account löschen',
          handler: async () => {
            const uid = this.authService.getCurrentUID();
            await this.userDataFetch.rtdb_wipeUser(uid);
            await this.userDataFetch.firestore_wipeUser(uid);
            await this.authService.deleteUser();
            await this.authService.signout();
            console.log(`Wiped ${uid} from RTDB & Firestore`);
            this.router.navigate(['first-screen']);
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel',
        }
      ]
    });
    await alert.present();
  }

  openUserSettings() {
    this.navController.navigateForward('settings-main');
  }

  cancel() {
    this.navController.back();
  }
}
