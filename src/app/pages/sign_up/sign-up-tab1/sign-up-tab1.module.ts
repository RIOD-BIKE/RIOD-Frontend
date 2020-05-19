import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpTab1PageRoutingModule } from './sign-up-tab1-routing.module';

import { SignUpTab1Page } from './sign-up-tab1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignUpTab1PageRoutingModule
  ],
  declarations: [SignUpTab1Page]
})
export class SignUpTab1PageModule {}
