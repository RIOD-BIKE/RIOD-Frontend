import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUpTab4Page } from './sign-up-tab4.page';

const routes: Routes = [
  {
    path: '',
    component: SignUpTab4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpTab4PageRoutingModule {}
