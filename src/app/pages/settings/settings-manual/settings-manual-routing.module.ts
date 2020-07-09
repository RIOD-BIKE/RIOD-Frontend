import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsManualPage } from './settings-manual.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsManualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsManualPageRoutingModule {}
