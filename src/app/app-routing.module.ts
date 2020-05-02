
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'sign-up-tab1', pathMatch: 'full' },
  {
    path: 'map-main',
    loadChildren: () => import('./pages/map/map-main/map-main.module').then( m => m.MapMainPageModule)
  },
  {
    path: 'settings-main',
    loadChildren: () => import('./pages/settings/settings-main/settings-main.module').then( m => m.SettingsMainPageModule)
  },

  {
    path: 'sign-up-tab1',
    loadChildren: () => import('./pages/sign_up/sign-up-tab1/sign-up-tab1.module').then( m => m.SignUpTab1PageModule)
  },
  {
    path: 'sign-up-tab2',
    loadChildren: () => import('./pages/sign_up/sign-up-tab2/sign-up-tab2.module').then( m => m.SignUpTab2PageModule)
  },
  {
    path: 'sign-up-tab3',
    loadChildren: () => import('./pages/sign_up/sign-up-tab3/sign-up-tab3.module').then( m => m.SignUpTab3PageModule)
  },
  {
    path: 'sign-up-tab4',
    loadChildren: () => import('./pages/sign_up/sign-up-tab4/sign-up-tab4.module').then( m => m.SignUpTab4PageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
