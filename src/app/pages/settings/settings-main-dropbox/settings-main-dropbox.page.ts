import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersDataFetchService } from 'src/app/services/users-data-fetch/users-data-fetch.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform, AlertController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-settings-main-dropbox',
  templateUrl: './settings-main-dropbox.page.html',
  styleUrls: ['./settings-main-dropbox.page.scss'],
})
export class SettingsMainDropboxPage implements OnInit {

  public rangeVolume: string;
  public uid: string;
  public name: string;
  public contact: string;
  public display = true;
  public gps = true;
  public vibration = true;
  public specialAvatarURL: string;

  constructor(public platform: Platform, private userDataFetch: UsersDataFetchService, private authService: AuthService,
    private router: Router, private alertController: AlertController, private navController: NavController, private http: HttpClient) {
    this.platform.ready().then(() => {
      this.rangeVolume = "5";
    });
  }

  async ngOnInit() {
    this.specialAvatarURL = await this.userDataFetch.storage_getSpecialAvatar();
    this.uid = await this.authService.getCurrentUID();
    this.name = await this.userDataFetch.firestore_getName(this.uid);
    this.contact = await this.userDataFetch.firestore_getContact(this.uid);
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Achtung!',
      message: 'Bist du sicher, dass du deinen Account unwiederbringlich löschen willst? Diese kann nicht rückgängig gemacht werden!',
      buttons: [
        {
          text: 'Account löschen',
          handler: async () => {
            // TODO: Spinner?
            const uid = await this.authService.getCurrentUID();
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

  goToManualPage() {
    // this.router.navigate(['/settings-manual']);
    this.navController.navigateForward('settings-manual');
  }

  openUserSettings() {
    this.navController.navigateForward('settings-main');
  }

  cancel() {
    // this.router.navigate(['/map-start']);
    this.navController.back();
  }
}
