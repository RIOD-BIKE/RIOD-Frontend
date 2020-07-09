import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsManualPageRoutingModule } from './settings-manual-routing.module';

import { SettingsManualPage } from './settings-manual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsManualPageRoutingModule
  ],
  declarations: [SettingsManualPage]
})
export class SettingsManualPageModule {}
