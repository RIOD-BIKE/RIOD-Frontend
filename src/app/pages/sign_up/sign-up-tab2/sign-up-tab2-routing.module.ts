import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUpTab2Page } from './sign-up-tab2.page';

const routes: Routes = [
  {
    path: '',
    component: SignUpTab2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpTab2PageRoutingModule {}
