import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { RideIndicatorAssemblyComponent } from './Components/ride-indicator-assembly/ride-indicator-assembly.component';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {environment} from '../environments/environment';
import { AngularFirestoreModule  } from '@angular/fire/firestore';
import { IonicStorageModule } from '@ionic/storage';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TutorialOverlay1Component } from './Components/tutorial/tutorial-overlay1/tutorial-overlay1.component';
import { TutorialOverlay2Component } from './Components/tutorial/tutorial-overlay2/tutorial-overlay2.component';
import { ButtonOverlayComponent } from './Components/button-overlay/button-overlay.component';
import { ExplainSlidesComponent } from './Components/explain-slides/explain-slides.component';
import { SearchBarMainMapComponent } from './Components/search-bar-main-map/search-bar-main-map.component';
import { RideIndicatorFinalComponent } from './Components/ride-indicator-final/ride-indicator-final.component';
import { RideIndicatorFreeComponent } from './Components/ride-indicator-free/ride-indicator-free.component';
import { CommonModule } from '@angular/common';  

@NgModule({
  declarations: [
    AppComponent, TutorialOverlay1Component, TutorialOverlay2Component, ButtonOverlayComponent, ExplainSlidesComponent, SearchBarMainMapComponent,
    RideIndicatorFinalComponent, RideIndicatorFreeComponent, RideIndicatorAssemblyComponent],
  entryComponents: [
    TutorialOverlay1Component, TutorialOverlay2Component, ButtonOverlayComponent, ExplainSlidesComponent, RideIndicatorFinalComponent,
    RideIndicatorFreeComponent, RideIndicatorAssemblyComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '_localRoutesDB',
      driverOrder: ['indexeddb', 'sqlite', 'websql'],

    }),
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NoopAnimationsModule,
    CommonModule
  ],

  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NativeGeocoder,
    NativeAudio,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FirebaseAuthentication
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
