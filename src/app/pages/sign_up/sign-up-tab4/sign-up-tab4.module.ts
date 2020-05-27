import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpTab4PageRoutingModule } from './sign-up-tab4-routing.module';

import { SignUpTab4Page } from './sign-up-tab4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignUpTab4PageRoutingModule
  ],
  declarations: [SignUpTab4Page]
})
export class SignUpTab4PageModule {}
