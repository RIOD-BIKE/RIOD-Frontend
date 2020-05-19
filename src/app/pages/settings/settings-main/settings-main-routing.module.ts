import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsMainPage } from './settings-main.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsMainPageRoutingModule {}
