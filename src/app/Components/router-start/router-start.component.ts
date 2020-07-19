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
import { trash } from 'ionicons/icons';



@Component({
  selector: 'router-start',
  templateUrl: './router-start.component.html',
  styleUrls: ['./router-start.component.scss'],
})
export class RouterStartComponent implements OnInit, AfterViewInit {
  private duration: number;
  private distance: number;
  // private count: any;
  // private moveOn: any = true;
  private state = 'bottom';
  @Input() handleHeight = 100;
  lastLeg:boolean = true;
  sammelpunktLeg: boolean = false;
  timeToTarget: string = "3MIN";

  private seletectedAPs: RoutingGeoAssemblyPoint [];

  constructor(private mapIntegration: MapIntegrationService, private mainMenu: MainMenuComponent,
              private mapBox: MapBoxComponent, private routingUserService: RoutingUserService,
              private userService: UserService, private modalController: ModalController, private search: SearchBarComponent,
              private statusAudio: StatusAudioService, private vibrationService: VibrationService,
              private gestureCtrl: GestureController, private element: ElementRef, private renderer: Renderer2) { }
// TODO: move statusAudio & vibrationService somewhere else?

  ngOnInit() {
    this.routingUserService.getDistance();

    addIcons({
      'ios-trash-outline': trash
    });

    // this.routingUserService.getPoints().
  }

  closeView() {
    this.routingUserService.setDisplayType('Start');
    this.routingUserService.resetAll();
    this.mapBox.removeRoute();
    this.mapBox.disableAssemblyClick().then(() => {
    this.mapBox.updateAssemblyPoints();
    this.mapBox.moveMapToCurrent();
    this.routingUserService.routeFinished.next(true);
    });
  }

  startRoute(){
    this.routingUserService.getPoints().then(points => {
     //missing this.mapIntegration.saveRouteOffline()
      let pointString = '';
      for(let i =0; i<points.length;i++){
          pointString += (points[i].position.longitude + ',' + points[i].position.latitude + ';');
      }
      this.mapBox.drawRoute(pointString).then(() => {

      });
      this.routingUserService.setDisplayType('Route_Info');
    });
  }

  saveRoute(){
    this.presentModal();
    this.routingUserService.getfinishPoint().then(x => {
      this.routingUserService.getPoints().then(y => {
        this.userService.saveShortcut(x, y);
      });
    });
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ButtonOverlayComponent
    });
    return await modal.present();
  }

  deleteAPPoints() {
    // delete all selected AP Points
  }

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
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(calc(${ev.deltaY}px - ${windowHeight-drawerHeight}px))`);
        }
      },
      onEnd: (ev) => {
        // do something when the gesture ends
        this.renderer.setStyle(this.element.nativeElement, 'transition', '0.3s ease-out');
        if (ev.deltaY < -(windowHeight / 20) && this.state === 'bottom') {
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(-${windowHeight-drawerHeight}px)`);
          this.state = 'top';
        } else if (ev.deltaY < (windowHeight / 20) && this.state === 'top') {
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(-${windowHeight-drawerHeight}px)`);
          this.state = 'top';
        } else if (ev.deltaY > (windowHeight / 20) && this.state === 'top') {
          this.renderer.setStyle(this.element.nativeElement, 'transform', 'translateY(0px)');
          this.state = 'bottom';
        } else {
          this.renderer.setStyle(this.element.nativeElement, 'transform', 'translateY(0px)');
          this.state = 'bottom';
        }
      }
    };
    const gesture: Gesture = await this.gestureCtrl.create(options);
    gesture.enable();
  }

  // showMore() {
  //   const z = document.getElementById('show-div');
  //   const t = document.getElementById('hide-div');
  //   z.hidden = true;
  //   t.hidden = false;

  //   const infoText = document.getElementById('infoText');
  //   infoText.hidden = true;

  //   const createRoute = document.getElementById('createRoute');
  //   // createRoute.style.marginTop = '130px';

  //   const cancel = document.getElementById('cancel');
  //   // cancel.hidden = true;
  //   // cancel.style.marginTop = '130px';

  //   const trashy = document.getElementById('trash');
  //   // trashy.hidden = false;
  //   // trashy.style.marginTop = '130px';
  // }
  // hideMore() {
  //   const z = document.getElementById('show-div');
  //   const t = document.getElementById('hide-div');
  //   z.hidden = false;
  //   t.hidden = true;

  //   const infoText = document.getElementById('infoText');
  //   infoText.hidden = false;

  //   const trashy = document.getElementById('trash');
  //   // trashy.hidden = true;

  //   const cancel = document.getElementById('cancel');
  //   // cancel.hidden = false;
  //   // cancel.style.marginTop = '10px';

  //   const createRoute = document.getElementById('createRoute');
  //   // createRoute.style.marginTop = '10px';
  // }

  // async ngAfterViewInit() {
  //   const changeDivHeight = document.getElementById('myOver');
  //   changeDivHeight.style.height = '100px';
  //   const options: GestureConfig = {
  //     el: document.getElementById('myOver'),
  //     direction: 'y',
  //     gestureName: 'slide-drawer-swipe',
  //     onStart: (ev) => {
  //       // do something as the gesture begins
  //       changeDivHeight.style.height = '100px';
  //     },
  //     onMove: (ev) => {
  //       if (ev.deltaY < 0 && this.moveOn === true) {
  //         this.count = 90 - ev.deltaY;
  //         changeDivHeight.style.height = this.count + 'px';
  //         if (this.count > 160) {
  //           this.count = 200;
  //           console.log('hier is  new count: ' + this.count);
  //           changeDivHeight.style.height = this.count + 'px';
  //           this.showMore();
  //           this.moveOn = false;
  //         }
  //       } else if (this.moveOn == false && ev.deltaY > 0) {
  //         // console.log('Delta' +  (this.count - ev.deltaY));
  //         this.count = 200 - ev.deltaY;
  //         changeDivHeight.style.height = this.count + 'px';

  //         if (this.count < 180) {
  //           this.count = 0;
  //           changeDivHeight.style.height = '100px';
  //           this.hideMore();
  //         }
  //       }
  //     },
  //     onEnd: (ev) => {
  //       if (this.count < 200) {
  //         changeDivHeight.style.height = '100px';
  //         this.moveOn = true;
  //         this.hideMore();
  //       } else {
  //         changeDivHeight.style.height = '200px';
  //         this.showMore();
  //         this.moveOn = false;
  //       }
  //     }
  //   };
  //   const gesture: Gesture = await this.gestureCtrl.create(options);
  //   gesture.enable();
  // }
}
