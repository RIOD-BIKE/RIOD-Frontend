import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapMainPage } from './map-main.page';

const routes: Routes = [
  {
    path: '',
    component: MapMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapMainPageRoutingModule {}
