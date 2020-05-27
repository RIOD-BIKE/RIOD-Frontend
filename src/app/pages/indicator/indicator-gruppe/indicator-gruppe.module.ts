import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndicatorGruppePageRoutingModule } from './indicator-gruppe-routing.module';

import { IndicatorGruppePage } from './indicator-gruppe.page';
import { ComponentsModule } from 'src/app/Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndicatorGruppePageRoutingModule,
    ComponentsModule
  ],
  declarations: [IndicatorGruppePage]
})
export class IndicatorGruppePageModule {}
