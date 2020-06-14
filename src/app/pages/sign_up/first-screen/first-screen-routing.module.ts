import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FirstScreenPage } from './first-screen.page';

const routes: Routes = [
  {
    path: '',
    component: FirstScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FirstScreenPageRoutingModule {}
