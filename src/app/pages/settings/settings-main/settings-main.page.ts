import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth/auth.service';
import { UsersDataFetchService } from './../../../services/users-data-fetch/users-data-fetch.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.page.html',
  styleUrls: ['./settings-main.page.scss'],
})
export class SettingsMainPage implements OnInit {

  name: string;
  phone: string;

  constructor(private router: Router, private userDateFetch: UsersDataFetchService, private authService: AuthService, private navController: NavController) { }

  async ngOnInit() {
    this.name = await this.userDateFetch.firestore_getName(this.authService.getCurrentUID());
  }

  cancel() {
    this.navController.back();
  }

  async save() {
    await this.userDateFetch.firestore_setName(this.authService.getCurrentUID(), this.name);
    this.cancel();
  }
}
