import { Component, OnInit, Input, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { MapBoxComponent } from '../map-box/map-box.component';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ModalController } from '@ionic/angular';
import { GestureController } from '@ionic/angular';
import { Gesture, GestureConfig } from '@ionic/core';

@Component({
	selector: 'waiting-at-as-small',
	templateUrl: './waiting-at-as-small.component.html',
	styleUrls: ['./waiting-at-as-small.component.scss'],
})
export class WaitingAtAsSmallComponent implements OnInit, AfterViewInit {
	progessCircleSize = 180; //change the size and radius of Circle Progess hier, value depend on Time. Max =180 Min=100
	progessSize = 100; //change the width of progess bar hier, value depend on Time. Max =100
	progessGo: any = false;
	progessCircleRadius = (this.progessCircleSize / 2) + 'px';
	progessColor = 'linear-gradient(to right,red, #383838, red)';
	progessCircleColor = 'radial-gradient(circle, #383838,#383838, red)';
	/*Timer*/
	public second = 59;
	public minute = 2;
	IntervalVar: any;
	count: any;
	moveOn: any = true;

	@Input() handleHeight: number = 138;

	constructor(
		private mapBox: MapBoxComponent,
		private statusBar: StatusBar,
		private modalController: ModalController,
		private gestureCtrl: GestureController,
		private element: ElementRef,
		private renderer: Renderer2
	) { }
	startTimer() {
		this.IntervalVar = setInterval(function () {
			this.second--;
			this.progessCircleSize = this.progessCircleSize - 0.7;
			this.progessSize = this.progessSize - (100 / 180);
			if (this.second === 0) {
				this.second = 59;
				this.minute -= 1;
			}
			if (this.minute < 0) {
				this.second = '30';
				this.minute = '00';
				clearInterval(this.IntervalVar);
				this.progessGo = true;
				this.progessCircleSize = 180; //change the size and radius of Circle Progess hier, value depend on Time. Max =180 Min=100
				this.progessSize = 100; //change the width of progess bar hier, value depend on Time. Max =100

				// this.hidevalue = true;
			}
			var circleProgess = document.getElementById("progessCircle");
			var progessBar = document.getElementById("progessBar");
			progessBar.style.width = this.progessSize + '%';
			circleProgess.style.width = this.progessCircleSize + 'px';
			circleProgess.style.height = this.progessCircleSize + 'px';
			circleProgess.style.borderRadius = this.progessCircleRadius;
			//circleProgess.style.marginLeft = '-'+this.progessCircleRadius;
			if (this.progessSize < 31 && this.progessGo == false) {
				this.progessColor = 'linear-gradient(to right,yellow, #383838, yellow)';
			}
			if (this.progessGo) {
				this.progessColor = 'linear-gradient(to right,green, #383838, green)';
			}
			if (this.progessCircleSize < 92 && this.progessGo == false) {
				this.progessCircleColor = 'radial-gradient(circle, #383838,#383838, yellow)';
			}
			if (this.progessGo) {
				this.progessCircleColor = 'radial-gradient(circle, #383838,#383838, green)';
			}
		}.bind(this), 1000);
	}

	ngOnInit() {
		/* Timer */
		this.startTimer();
	}
	showMore() {
		var x = document.getElementById("hide");
		var y = document.getElementById("btn2-toChange");
		var timerCircle = document.getElementById("timerCircle");
		x.hidden = true;
		timerCircle.hidden = false;
		var z = document.getElementById("show-div");
		var t = document.getElementById("hide-div");
		z.hidden = true;
		t.hidden = false;
		y.hidden = true;
	}
	hideMore() {
		var x = document.getElementById("hide");
		var y = document.getElementById("btn2-toChange");
		var timerCircle = document.getElementById("timerCircle");
		x.hidden = false;
		var z = document.getElementById("show-div");
		var t = document.getElementById("hide-div");
		z.hidden = false;
		t.hidden = true;
		y.hidden = false;
		timerCircle.hidden = true;
	}
	async ngAfterViewInit() {
		var changeDivHeight = document.getElementById("myOver");
		changeDivHeight.style.height = "auto";
		const options: GestureConfig = {
			el: document.getElementById("myOver"),
			direction: 'y',
			gestureName: 'slide-drawer-swipe',
			onStart: (ev) => {
				// do something as the gesture begins
				changeDivHeight.style.height = "auto";
			},
			onMove: (ev) => {
				if (ev.deltaY < 0 && this.moveOn == true) {
					this.count = 90 - ev.deltaY;
					changeDivHeight.style.height = this.count + 'px';
					if (this.count > 160) {
						this.count = 200;
						console.log('hier is  new count: ' + this.count);
						changeDivHeight.style.height = this.count + 'px';
						this.showMore();
						this.moveOn = false;
					}
				} else if ( this.moveOn == false && ev.deltaY > 0) {	
					//console.log('Delta' +  (this.count - ev.deltaY));
					this.count = 200 - ev.deltaY;
					changeDivHeight.style.height =  this.count + 'px';
					
					if(this.count < 180){
						this.count = 0;
						changeDivHeight.style.height = "auto";
						this.hideMore();
					}
				} 
			},
			onEnd: (ev) => {
				if (this.count < 200) {
					changeDivHeight.style.height = "auto";
					this.moveOn = true;
					this.hideMore();
				} else {
					changeDivHeight.style.height = "200px";
					this.showMore();
					this.moveOn = false;
				}
			}
		};
		const gesture: Gesture = await this.gestureCtrl.create(options);
		gesture.enable();
	}
}

