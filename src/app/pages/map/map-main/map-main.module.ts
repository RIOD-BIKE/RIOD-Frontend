import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapMainPageRoutingModule } from './map-main-routing.module';

import { MapMainPage } from './map-main.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { MapBoxComponent } from 'src/app/components/map-box/map-box.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MapMainPageRoutingModule,

  ],
  declarations: [MapMainPage],
  entryComponents: [MapBoxComponent],
  providers: []
})
export class MapMainPageModule {}
