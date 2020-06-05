import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapMainPageRoutingModule } from './map-main-routing.module';

import { MapMainPage } from './map-main.page';
import { ComponentsModule } from 'src/app/Components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MapMainPageRoutingModule,
  ],
  declarations: [MapMainPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MapMainPageModule {}
