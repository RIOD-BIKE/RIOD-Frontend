import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndicatorSingle1PageRoutingModule } from './indicator-single1-routing.module';

import { IndicatorSingle1Page } from './indicator-single1.page';
import { ComponentsModule } from 'src/app/Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndicatorSingle1PageRoutingModule,
    ComponentsModule
  ],
  declarations: [IndicatorSingle1Page]
})
export class IndicatorSingle1PageModule {}
