import { Component, AfterViewInit, ElementRef, Renderer2, Input } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { Gesture, GestureConfig } from '@ionic/core';
import { MapIntegrationService } from 'src/app/services/map-integration/map-integration.service';
import { UsersDataFetchService } from 'src/app/services/users-data-fetch/users-data-fetch.service';
import { riodMembersAtAP } from 'src/app/Classess/map/map';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { ThrowStmt } from '@angular/compiler';
import { first } from 'rxjs/operators';

// Not used ??

@Component({
  selector: 'app-riding-info',
  templateUrl: './riding-info.component.html',
  styleUrls: ['./riding-info.component.scss'],
})
export class RidingInfoComponent implements AfterViewInit {
  state: string = 'bottom';
  @Input() handleHeight: number = 90; //initial 100 -> bestimmt höhe im runtergefahrenen zustand

  @Input() timeToTarget="0 min";
  @Input() lastLeg:boolean = true;
  @Input() atSammelpunkt: boolean = true;
  @Input() toSammelpunktLeg: boolean = true;
  @Input() fromStartLeg: boolean = false;
  @Input() finish: boolean = true;
  @Input() timeToDispatchMin;
  @Input() timeToDispatchSec;

  @Input() countOfRiods=0;
  @Input() timeToDispatch="0:30";
  private targetAP;
  private stopCount:boolean=false;
  private membersAtAP:riodMembersAtAP[]=[];
  private bounding:riodMembersAtAP[]=[];
  private tempSeconds:number;



  @Input() countOfAvailableRiods;

  constructor(
    private gestureCtrl: GestureController,
    private element: ElementRef,
    private renderer: Renderer2,
    private mapIntegration:MapIntegrationService,
    private userDataFetchService: UsersDataFetchService,
    private routingUserService: RoutingUserService) {}
  



  ngOnInit() {   
    this.routingUserService.getDisplayManuelShow().subscribe((x)=>{
      if(x==true){
        console.log(x);
        this.resetAll();
      }
    })
    this.init();

  }

  init(){
    
    this.routingUserService.getBoundingArray().then(x=>{
      this.bounding=x;
      console.log(this.bounding);
      this.timeToTarget=this.bounding[0].duration + " min";
      this.mapIntegration.checkGPSChangeRoutingPosition().then(x=>{
       console.log("Ending of Routing: "+x);
       if(x==true){
         this.setDisplayToFinish();
       }
     })
     this.userDataFetchService.riodMembersValueChange.subscribe(()=>{
       this.membersAtAP=this.userDataFetchService.riodMembers;
       console.log(this.membersAtAP);

     })
     this.mapIntegration.CurrentApNumber.subscribe((currentAP)=>{
       if(currentAP!=null){
         console.log(this.bounding);
         this.timeToTarget=this.bounding[currentAP-1].duration + " min";
         this.targetAP=currentAP;
         if(this.membersAtAP!=undefined){
          this.countOfRiods=this.membersAtAP.length;
          let highestNumber=0.5;
          this.membersAtAP.forEach(element => {
            if(parseInt(element.duration)<6){
              console.log(element.duration)
              highestNumber=parseInt(element.duration);
            }
          });
          if(highestNumber!=null){

            this.countTimeToDepartcher(highestNumber).then(()=>{
              this.stopCount=true;
              this.setDisplayToAPWait();
            });
          }
          }

       }
 
     })
     this.mapIntegration.ToApNumber.subscribe((nextAP)=>{
       if(nextAP!=null){
         console.log(nextAP);
         this.targetAP=nextAP;
         console.log(this.timeToTarget);
         this.timeToTarget=this.bounding[nextAP-1].duration + " min";
         if(this.bounding.length>nextAP+1){

          this.setDisplayToNextAP();
         } else{
           this.setDisplayToLastLeg();
         }
       }
     })
    })
  }
  setDisplayToStart(){
    this.atSammelpunkt=true;
    this.lastLeg=true;
    this.toSammelpunktLeg=true;
    this.fromStartLeg=false;
    this.finish=true;
  }

  setDisplayToAPWait(){
    this.atSammelpunkt=false;
    this.lastLeg=true;
    this.toSammelpunktLeg=true;
    this.fromStartLeg=true;
    this.finish=true;
  }

  setDisplayToNextAP(){
    this.lastLeg=true;
    this.atSammelpunkt=true;
    this.toSammelpunktLeg=false;
    this.fromStartLeg=true;
    this.finish=true;

  }

  setDisplayToLastLeg(){
    this.toSammelpunktLeg=true;
    this.lastLeg=false;
    this.atSammelpunkt=true;
    this.fromStartLeg=true;
    this.finish=true;
  }

  setDisplayToFinish(){
    this.toSammelpunktLeg=true;
    this.lastLeg=true;
    this.atSammelpunkt=true;
    this.fromStartLeg=true;
    this.finish=false;
  }

   convert(value, inSeconds) {
    if (value > inSeconds) {
        let x = value % inSeconds;
        this.tempSeconds = x;
        return (value - x) / inSeconds;
    } else {
        return 0;
    }
  };

  countTimeToDepartcher(time){
    return new Promise<any>(resolve => {
    console.log(time);
    let totalSec = time*60;
    let firstTry:boolean=false;
    this.tempSeconds=30;
    this.stopCount=false;
    var x = setInterval(() => {
    //clears countdown when all seconds are counted
    if (totalSec <= 0 || this.stopCount==true) {
        clearInterval(x);
        this.stopCount=false;
        console.log("TIMER == 0 -> GO");
    }
    if(firstTry==true){
    this.setMinutes(this.convert(this.tempSeconds, 60));
    this.setSeconds(this.tempSeconds == 60 ? 59 : this.tempSeconds);
    resolve();
    }

    totalSec--;
    this.tempSeconds = totalSec;
    firstTry=true;

    }, 1000);
    })
  }

  setMinutes(time){
    this.timeToDispatchMin=time;
    console.log(this.timeToDispatchMin)
  }

  setSeconds(time){
    this.timeToDispatchSec=time;
    console.log(this.timeToDispatchSec)
  }

  resetAll(){
    this.timeToTarget="0 min";
    this.tempSeconds=0;
    this.countOfRiods=0;
    this.timeToDispatch="0:30";
    this.membersAtAP=[];
    this.bounding=[];
    this.countOfAvailableRiods=0;
    this.lastLeg=true;
    this.setDisplayToStart();
    this.init();

  }







  async ngAfterViewInit() {

    const windowHeight = window.innerHeight;
    const drawerHeight = windowHeight - this.handleHeight; 
    // const drawerHeight = windowHeight - 118; 
    this.renderer.setStyle(this.element.nativeElement, 'top', windowHeight - this.handleHeight + 'px')  
    //moving Stuff
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

}