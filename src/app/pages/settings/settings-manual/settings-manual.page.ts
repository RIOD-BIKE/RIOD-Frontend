import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-manual',
  templateUrl: './settings-manual.page.html',
  styleUrls: ['./settings-manual.page.scss'],
})
export class SettingsManualPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['/settings-main-dropbox']);

  }

  goToMapMain() {
    this.router.navigate(['/map-main']);
  }

  goToMapStart() {
    this.router.navigate(['/map-start']);
  }

}
