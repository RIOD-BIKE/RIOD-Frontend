import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsMainPageRoutingModule } from './settings-main-routing.module';

import { SettingsMainPage } from './settings-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsMainPageRoutingModule
  ],
  declarations: [SettingsMainPage]
})
export class SettingsMainPageModule {}
