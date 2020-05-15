import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpTab2PageRoutingModule } from './sign-up-tab2-routing.module';

import { SignUpTab2Page } from './sign-up-tab2.page';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignUpTab2PageRoutingModule,
    ReactiveFormsModule,
		NgxIntlTelInputModule,
  ],
  declarations: [SignUpTab2Page]
})
export class SignUpTab2PageModule {}
