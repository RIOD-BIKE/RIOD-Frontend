import { element } from 'protractor';
import { RoutingGeoAssemblyPoint } from 'src/app/Classess/map/map';
import { VibrationService } from './../../services/vibration-service/vibration.service';
import { StatusAudioService } from './../../services/status-audio/status-audio.service';
import { ModalController } from '@ionic/angular';
import { ButtonOverlayComponent } from '../button-overlay/button-overlay.component';
import { Component, OnInit, Input, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { UserService } from 'src/app/services/user/user.service';
import { MapBoxComponent } from '../map-box/map-box.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { MapIntegrationService } from 'src/app/services/map-integration/map-integration.service';
import { distance } from '@turf/turf';
import { GestureController } from '@ionic/angular';
import { Gesture, GestureConfig } from '@ionic/core';
import { addIcons } from 'ionicons';
import { trash, create } from 'ionicons/icons';



@Component({
  selector: 'router-start',
  templateUrl: './router-start.component.html',
  styleUrls: ['./router-start.component.scss'],
})
export class RouterStartComponent implements OnInit, AfterViewInit {

  constructor(private mapIntegration: MapIntegrationService, private mainMenu: MainMenuComponent,
    private mapBox: MapBoxComponent, private routingUserService: RoutingUserService,
    private userService: UserService, private modalController: ModalController, private search: SearchBarComponent,
    private statusAudio: StatusAudioService, private vibrationService: VibrationService,
    private gestureCtrl: GestureController, private element: ElementRef, private renderer: Renderer2) { }

  // private duration: number;
  // private distance: number;
  // private count: any;
  // private moveOn: any = true;
  private state = 'bottom';
  @Input() handleHeight = 100;
  public infoArray = [];
  public disableCreateButton = true;

  private seletectedAPs: RoutingGeoAssemblyPoint[];


  // TODO: move statusAudio & vibrationService somewhere else?

  ngOnInit() {

    addIcons({
      'ios-trash-outline': trash,
      'ios-create-outline': create
    });

    // get routing info
    this.routingUserService.getDurationasSub().subscribe(duration => {
      this.routingUserService.getDistanceasSub().subscribe(distance => {
        if (duration != null && distance != null) {
          this.infoArray = [duration.valueOf() + ' Minuten' , '(' + distance.valueOf() + ' km)'];
        }
      });
    });

    // check if routing finished/aborted
    this.routingUserService.routeFinished.subscribe( value => {
      if (value) {
        // reset slider view
        this.changeViewCreateStart(false, true);
      }
    });

    // TODO subscribe this.routingUserService.getPoints() >= 2
    // this.changeButtons(true);
    //else
    // this.changeButtons(false);

  }

// close the view & reset
  closeView() {
    this.mainMenu.closeView();
    this.infoArray = [];
    this.routingUserService.setDisplayType('Start');
    this.routingUserService.resetAll();
    this.mapBox.removeRoute();
    this.mapBox.disableAssemblyClick().then(() => {
      this.mapBox.updateAssemblyPoints();
      this.mapBox.moveMapToCurrent();
      // indicates if routing is finished/aborted
      this.routingUserService.routeFinished.next(true);
    });
  }

  // calculate route with selected APs
  startRoute() {
    this.routingUserService.getPoints().then(points => {
      // missing this.mapIntegration.saveRouteOffline()
      let pointString = '';
      for (let i = 0; i < points.length; i++) {
        pointString += (points[i].position.longitude + ',' + points[i].position.latitude + ';');
      }
      this.mapBox.drawRoute(pointString).then(() => {

      });
    });
    this.changeViewCreateStart(true, false);
  }

  // start the navigation
  startNavi() {
    this.routingUserService.getPoints().then(points => {
      this.routingUserService.getDuration().then(duration => {
        this.routingUserService.getDistance().then(dist => {
          this.routingUserService.getfinishPoint().then(fin => {
            this.routingUserService.getstartPoint().then(start => {
              let pointString = '';
              for (const each of points) {
                pointString += (each.position.longitude + ',' + each.position.latitude + ';');
              }
              this.mapIntegration.saveRouteOffline(start, fin, points, duration, dist).then(returnMessage => {
                console.log(returnMessage);
              });
              this.mapBox.drawRoute(pointString).then(() => {
                // MUST CHECK IF ROUTE THAT IS ALREADY DRAWN IS IDENTICAL TO NEW DRAWING ROUTE
                this.routingUserService.setDisplayType("routeStarted");
                //console.log('new Route drawn');
              });
            });
          });
        });
      });
    });
  }

  // change view of slider component creating route or start navigation
  changeViewCreateStart(createR: boolean, startN: boolean) {
    const createRoute = document.getElementById('selectAP');
    createRoute.hidden = createR;
    const startNavi = document.getElementById('startRoute');
    startNavi.hidden = startN;
  }

  // change buttons if more than 2 APs selected
  changeButtons(twoAP: boolean) {
    const createButton = document.getElementById('createRouteButton');
    const cancel = document.getElementById('cancel');
    const trashy = document.getElementById('trash');
    // const placeholderDiv
    // const selectedAPs

    if (twoAP) {
      this.disableCreateButton = false;
      cancel.hidden = true;
      trashy.hidden = false;
      // placeholderDiv hidden true
      // selectedAPs hidden false
    } else {
      this.disableCreateButton = true;
      cancel.hidden = false;
      trashy.hidden = true;
      // placeholderDiv hidden false
      // selectedAPs hidden true
    }
  }

  saveRoute() {
    this.presentModal();
    this.routingUserService.getfinishPoint().then(x => {
      this.routingUserService.getPoints().then(y => {
       // this.userService.saveShortcut(x, y); 
       //Muss mit IconName und Koordinaten erzeugt werden



      });
    });
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ButtonOverlayComponent
    });
    return await modal.present();
  }

  // delete all selected APs
  deleteAPPoints() {
    // delete all selected AP Points
  }

  slideUp() {
    // const textIN = document.getElementById('infoTextIN');
    // textIN.hidden = true;
    // const textOUT = document.getElementById('infoTextOUT');
    // textOUT.hidden = false;

    // const trashy = document.getElementById('trash');
    // trashy.hidden = false;
    // const cancel = document.getElementById('cancel');
    // cancel.hidden = true;
  }

  slideDown() {
    // const textIN = document.getElementById('infoTextIN');
    // textIN.hidden = false;
    // const textOUT = document.getElementById('infoTextOUT');
    // textOUT.hidden = true;

    // const trashy = document.getElementById('trash');
    // trashy.hidden = true;
    // const cancel = document.getElementById('cancel');
    // cancel.hidden = false;
  }

  // slider logic
  async ngAfterViewInit() {
    const windowHeight = window.innerHeight;
    const drawerHeight = windowHeight - this.handleHeight;
    // const drawerHeight = windowHeight - 118; 
    this.renderer.setStyle(this.element.nativeElement, 'top', windowHeight - this.handleHeight + 'px');

    const options: GestureConfig = {
      el: document.querySelector('#header'),
      direction: 'y',
      gestureName: 'slide-drawer-swipe',
      onStart: (ev) => {
        // do something as the gesture begins
        this.renderer.setStyle(this.element.nativeElement, 'transition', 'none');
      },
      onMove: (ev) => {
        // do something in response to movement        
        if (ev.deltaY < 0 && this.state === 'bottom') {
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(${ev.deltaY}px)`);

        } else if (this.state === 'top') {
          // element size is -76 then deltaY subtraction. ex. calc (2 - 76) = -74 means downward movement.
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(calc(${ev.deltaY}px - ${windowHeight - drawerHeight}px))`);
        }

      },
      onEnd: (ev) => {
        // do something when the gesture ends
        this.renderer.setStyle(this.element.nativeElement, 'transition', '0.3s ease-out');
        if (ev.deltaY < -(windowHeight / 20) && this.state === 'bottom') {
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(-${windowHeight - drawerHeight}px)`);
          this.state = 'top';
          this.slideUp();
        } else if (ev.deltaY < (windowHeight / 20) && this.state === 'top') {
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(-${windowHeight - drawerHeight}px)`);
          this.state = 'top';
          this.slideUp();
        } else if (ev.deltaY > (windowHeight / 20) && this.state === 'top') {
          this.renderer.setStyle(this.element.nativeElement, 'transform', 'translateY(0px)');
          this.state = 'bottom';
          this.slideDown();
        } else {
          this.renderer.setStyle(this.element.nativeElement, 'transform', 'translateY(0px)');
          this.state = 'bottom';
          this.slideDown();
        }
      }
    };
    const gesture: Gesture = await this.gestureCtrl.create(options);
    gesture.enable();
  }
}
