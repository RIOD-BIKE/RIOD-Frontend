import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FirstScreenPageRoutingModule } from './first-screen-routing.module';

import { FirstScreenPage } from './first-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FirstScreenPageRoutingModule
  ],
  declarations: [FirstScreenPage]
})
export class FirstScreenPageModule {}
