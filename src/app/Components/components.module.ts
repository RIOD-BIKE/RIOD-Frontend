import { MapBoxComponent } from './map-box/map-box.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RouterInfoInBottomComponent } from './router-info-in-bottom/router-info-in-bottom.component';
import { SearchBarComponent } from './search-bar/search-bar.component'
import { RidingToggleComponent } from './riding-toggle/riding-toggle.component';
import { RideIndicatorAssemblyComponent } from './ride-indicator-assembly/ride-indicator-assembly.component';
import { RideIndicatorFinalComponent } from './ride-indicator-final/ride-indicator-final.component';
import { RideIndicatorFreeComponent } from './ride-indicator-free/ride-indicator-free.component';
import { RideMapAssemblyComponent } from './ride-map-assembly/ride-map-assembly.component';
import { RideMapFinalComponent } from './ride-map-final/ride-map-final.component';



import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@NgModule({

    declarations: [MapBoxComponent, MainMenuComponent, RouterInfoInBottomComponent, SearchBarComponent, RidingToggleComponent, RideIndicatorAssemblyComponent, RideIndicatorFinalComponent, RideIndicatorFreeComponent, RideMapAssemblyComponent, RideMapFinalComponent],
    imports: [IonicModule],
    exports: [MapBoxComponent, MainMenuComponent, RouterInfoInBottomComponent, SearchBarComponent, RidingToggleComponent, RideIndicatorAssemblyComponent, RideIndicatorFinalComponent, RideIndicatorFreeComponent, RideMapAssemblyComponent, RideMapFinalComponent],
    providers:[MapBoxComponent]

  })
  export class ComponentsModule {}
  