import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndicatorSingle2PageRoutingModule } from './indicator-single2-routing.module';
import { ComponentsModule } from 'src/app/Components/components.module';

import { IndicatorSingle2Page } from './indicator-single2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndicatorSingle2PageRoutingModule,
    ComponentsModule
  ],
  declarations: [IndicatorSingle2Page]
})
export class IndicatorSingle2PageModule {}
