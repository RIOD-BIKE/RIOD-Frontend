import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapRidePageRoutingModule } from './map-ride-routing.module';

import { MapRidePage } from './map-ride.page';
import { ComponentsModule } from 'src/app/Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapRidePageRoutingModule,
    ComponentsModule
  ],
  declarations: [MapRidePage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MapRidePageModule {}
