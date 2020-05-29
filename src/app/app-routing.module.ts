
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'map-start', pathMatch: 'full',
  // canActivate: [AuthGuard],
  // data:{role:'USER', authGuradRedirect:'sing-up-tab1'} 
  },
  {
    path: 'map-main',
    loadChildren: () => import('./pages/map/map-main/map-main.module').then( m => m.MapMainPageModule),
    // canActivate: [AuthGuard],
    // data:{role:'USER'}
  },
  {
    path: 'settings-main',
    loadChildren: () => import('./pages/settings/settings-main/settings-main.module').then( m => m.SettingsMainPageModule),
    // canActivate: [AuthGuard],
    // data:{role:'USER'}
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
    loadChildren: () => import('./pages/sign_up/sign-up-tab4/sign-up-tab4.module').then( m => m.SignUpTab4PageModule),
    // canActivate: [AuthGuard],
    // data:{role:'USER'}
  },
  {
    path: 'map-start',
    loadChildren: () => import('./pages/map/map-start/map-start.module').then( m => m.MapStartPageModule),
    // canActivate: [AuthGuard],
    // data:{role:'USER'}
  },
  {
    path: 'indicator-single1',
    loadChildren: () => import('./pages/indicator/indicator-single1/indicator-single1.module').then( m => m.IndicatorSingle1PageModule),
    // canActivate: [AuthGuard],
    // data:{role:'USER'}
  },
  {
    path: 'indicator-gruppe',
    loadChildren: () => import('./pages/indicator/indicator-gruppe/indicator-gruppe.module').then( m => m.IndicatorGruppePageModule),
    // canActivate: [AuthGuard],
    // data:{role:'USER'}
  },
  {
    path: 'indicator-single2',
    loadChildren: () => import('./pages/indicator/indicator-single2/indicator-single2.module').then( m => m.IndicatorSingle2PageModule),
    // canActivate: [AuthGuard],
    // data:{role:'USER'}
  },
  {
    path: 'settings-main-dropbox',
    loadChildren: () => import('./pages/settings/settings-main-dropbox/settings-main-dropbox.module').then( m => m.SettingsMainDropboxPageModule),
    // canActivate: [AuthGuard],
    // data:{role:'USER'}
  },
  {
    path: 'map-ride',
    loadChildren: () => import('./pages/map/map-ride/map-ride.module').then( m => m.MapRidePageModule),
    // canActivate: [AuthGuard],
    // data:{role:'USER'}
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
