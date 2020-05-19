import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapStartPage } from './map-start.page';

const routes: Routes = [
  {
    path: '',
    component: MapStartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapStartPageRoutingModule {}
