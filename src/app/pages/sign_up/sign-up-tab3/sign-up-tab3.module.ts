import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpTab3PageRoutingModule } from './sign-up-tab3-routing.module';

import { SignUpTab3Page } from './sign-up-tab3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignUpTab3PageRoutingModule
  ],
  declarations: [SignUpTab3Page]
})
export class SignUpTab3PageModule {}
