import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUpTab3Page } from './sign-up-tab3.page';

const routes: Routes = [
  {
    path: '',
    component: SignUpTab3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpTab3PageRoutingModule {}
