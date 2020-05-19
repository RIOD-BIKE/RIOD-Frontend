import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUpTab1Page } from './sign-up-tab1.page';

const routes: Routes = [
  {
    path: '',
    component: SignUpTab1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpTab1PageRoutingModule {}
