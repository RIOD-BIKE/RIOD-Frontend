import { BehaviorSubject } from 'rxjs';
import { DisplayService } from './../../../services/display/display.service';
import { RoutingGeoAssemblyPoint } from 'src/app/Classess/map/map';
import { MapDataFetchService } from './../../../services/map-data-fetch/map-data-fetch.service';
import { Component, OnInit, Directive, ViewChild, Input, ElementRef } from '@angular/core';
import { MapBoxComponent } from 'src/app/Components/map-box/map-box.component';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MainMenuComponent } from 'src/app/Components/main-menu/main-menu.component';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { ModalController, PopoverController, AnimationController } from '@ionic/angular';
import { TutorialOverlay1Component } from '../../../Components/tutorial/tutorial-overlay1/tutorial-overlay1.component';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RouterInfoInBottomComponent } from 'src/app/Components/router-info-in-bottom/router-info-in-bottom.component';
import { RouterStartComponent } from 'src/app/Components/router-start/router-start.component';
import { SearchBarComponent } from 'src/app/Components/search-bar/search-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { RidingInfoComponent } from 'src/app/Components/riding-info/riding-info.component';
import { MapIntegrationService } from 'src/app/services/map-integration/map-integration.service';
import { UsersDataFetchService } from 'src/app/services/users-data-fetch/users-data-fetch.service';

 

@Component({
  selector: 'app-map-start',
  templateUrl: './map-start.page.html',
  styleUrls: ['./map-start.page.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})


export class MapStartPage implements OnInit {

  public showRidingToggle: boolean = true;
  public showMain: boolean = false;
  public showRouterInfo: boolean=false;
  private showRide: boolean= false;
  @Input() private zIndexRT: number=1;
  @Input() public showType: string = '';
  private showIndicatorScreen = false;
  @ViewChild('indicatorScreen') indicatorScreen: ElementRef;

  public searchbar = false;
  public closeWindow = true;

 constructor(private popoverController:PopoverController, private routingUserService: RoutingUserService, private mapBox: MapBoxComponent,
             private statusBar: StatusBar, private mainMenu: MainMenuComponent, private modalController: ModalController,
             private mapDataFetch: MapDataFetchService,private routerInfo:RouterInfoInBottomComponent,routerStart:RouterStartComponent,private searchBar: SearchBarComponent,
             private userDataFetch:UsersDataFetchService,private animationController: AnimationController, private displayService: DisplayService, private mapIntegration:MapIntegrationService) {
  this.init();
 }
 init() {
  this.statusBar.overlaysWebView(false);
  this.statusBar.backgroundColorByHexString('#383838');
  this.mapBox.setupMap();
  //this.presentModal();
  this.routingUserService.getDisplayTypeObs().subscribe(x=>{
    console.log(x);
    if(x=='Start'){
     this.showType="";
    }
     if(x=='Route_Info'){
       this.routingUserService.setDisplayRoutingStart(true);
       this.mapBox.disableFutureChooseAssemblyPoints();
       this.showType="showMain";
     }
    if(x=='Main'){
      this.showType="showMain";
    }
    if(x=='routeStarted'){
      this.showType="showRouterInfo";
    }

  })
 }

  ngOnInit() {
    // when more than 1 AP selected hide searchbar and show cancel button
    this.routingUserService.getPoints().then( () => {
      this.routingUserService.pointsBehaviorSubject.subscribe( value => {
          if ( value === undefined) {
            this.hideSearchbar(false, true);
          } else if (value.length >= 2) {
            this.hideSearchbar(true, false);
          } else {
            this.hideSearchbar(false, true);
          }
      });
    });
  }

  closeView() {
    this.userDataFetch.rtdb_getDetailsAP_unsub();
    this.routingUserService.setDisplayManuelShow();
    this.mapIntegration.deleteAllRTDB_Entries();
    this.mainMenu.closeView();
    this.routingUserService.setDisplayType('Start');
    this.routingUserService.setDisplayRoutingStart(false);
    this.routingUserService.resetAll();
    this.mapBox.removeRoute();
    this.mapBox.disableAssemblyClick().then(() => {
      this.mapBox.updateAssemblyPoints();
      this.mapBox.moveMapToCurrent();
      this.routingUserService.routeFinished.next(true);
    });
  }

  hideSearchbar(searchbar: boolean, closeWindow: boolean) {
    this.searchbar = searchbar;
    this.closeWindow = closeWindow;

  }

  switchIndicatorIcon(switchCase: boolean){
    document.getElementById("toggleIndicator").hidden = switchCase;
  }


  locateDevice() {
    this.mapBox.moveMapToCurrent();
  }

  setChildView(){
    this.setShowMain();
  }



  setShowRouterInfoBottom():Promise<any>{
    return new Promise(resolve => {
      this.showRidingToggle=false;
    this.showRouterInfo= true;
    resolve();
    });
  }


  setShowMain(): Promise<any>{
    return new Promise(resolve => {
      this.mainMenu.setUpStart();
      this.showMain = true;
      this.showRidingToggle = false;
      this.showRouterInfo=false;
      resolve();
    });
  }

  setShowStart(): Promise<any>{
    return new Promise(resolve => {
    this.showMain = false;
    this.showRidingToggle = false;
    this.showRouterInfo=false;
    resolve();
    });
  }

  public toggleShowIndicatorScreen() {
    this.zIndexRT=11;
    const animation = this.animationController.create()
      .addElement(this.indicatorScreen.nativeElement)
      .duration(250)
      .easing('ease-in-out');
    if (this.showIndicatorScreen) {
      
      animation.fromTo('transform', 'translateY(0%)', 'translateY(100%)')
    } else {
      animation.fromTo('transform', 'translateY(100%)', 'translateY(0%)')
    }
    this.showIndicatorScreen = !this.showIndicatorScreen;
    this.displayService.setIsIndicatorScreenVisible(this.showIndicatorScreen);
    animation.play();
  }
  async presentModalTutorial() {
    const modal = await this.modalController.create({
      component: TutorialOverlay1Component
    });
    return await modal.present();
  }



  DEMOsendToRTDB() {
    this.mapDataFetch.sendUserPosition();
  }

  setShowChange(){
    
  }

}
