import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-manual',
  templateUrl: './settings-manual.page.html',
  styleUrls: ['./settings-manual.page.scss'],
})
export class SettingsManualPage implements OnInit {

  constructor(private router: Router, private navCtrl: NavController) { }

  ngOnInit() {
  }

  back() {
    this.navCtrl.back();

  }

  goToMapMain() {
    this.router.navigate(['/map-main']);
  }

  goToMapStart() {
    this.router.navigate(['/map-start']);
  }

}
