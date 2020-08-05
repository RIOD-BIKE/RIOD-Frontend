import { EditFavorSequenceComponent } from './edit-favor-sequence/edit-favor-sequence.component';
import { EditFavoriteComponent } from './edit-favorite/edit-favorite.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RideIndicatorComponent } from './ride-indicator/ride-indicator.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RouterInfoInBottomComponent } from './router-info-in-bottom/router-info-in-bottom.component';
import { SearchBarComponent } from './search-bar/search-bar.component'
import { RidingToggleComponent } from './riding-toggle/riding-toggle.component';
import { NgModule, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RideMapAssemblyComponent } from './ride-map-assembly/ride-map-assembly.component';
import { RideMapFinalComponent } from './ride-map-final/ride-map-final.component';
import { WaitingAtAsSmallComponent } from './waiting-at-as-small/waiting-at-as-small.component';
import { RouterStartComponent } from './router-start/router-start.component';
import { BrowserModule } from '@angular/platform-browser';
import { RidingInfoComponent } from './riding-info/riding-info.component';
  import { from } from 'rxjs';
@NgModule({
  declarations: [MapBoxComponent, MainMenuComponent, RouterInfoInBottomComponent, SearchBarComponent,
    RidingToggleComponent,EditFavorSequenceComponent,
    RideMapAssemblyComponent, RideMapFinalComponent, WaitingAtAsSmallComponent, RouterStartComponent, RidingInfoComponent, RideIndicatorComponent, EditFavoriteComponent],
  imports: [IonicModule, CommonModule, FormsModule],
  exports: [MapBoxComponent, MainMenuComponent, RouterInfoInBottomComponent, SearchBarComponent,
    RidingToggleComponent,EditFavorSequenceComponent,
    RideMapAssemblyComponent, RideMapFinalComponent, WaitingAtAsSmallComponent, RouterStartComponent, RidingInfoComponent, RideIndicatorComponent, EditFavoriteComponent],
  providers: [MapBoxComponent, MainMenuComponent, RouterInfoInBottomComponent, SearchBarComponent,
    RidingToggleComponent,EditFavorSequenceComponent,
    RideMapAssemblyComponent, RideMapFinalComponent, RouterStartComponent, RideIndicatorComponent, EditFavoriteComponent]
})
export class ComponentsModule { }
