import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpTab2PageRoutingModule } from './sign-up-tab2-routing.module';

import { SignUpTab2Page } from './sign-up-tab2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignUpTab2PageRoutingModule
  ],
  declarations: [SignUpTab2Page]
})
export class SignUpTab2PageModule {}
