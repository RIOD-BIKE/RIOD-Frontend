import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'waiting-at-as-small',
  templateUrl: './waiting-at-as-small.component.html',
  styleUrls: ['./waiting-at-as-small.component.scss'],
})
export class WaitingAtAsSmallComponent implements OnInit {
  constructor() { }
  ngOnInit() {}
  	
  	showMore(){
	  	var changeDivHeight = document.getElementById("myOver");
	 	var x = document.getElementById("hide");
	  	var y = document.getElementById("btn2-toChange");
	  	changeDivHeight.style.height = "200px";
	  	x.hidden=true;
	  	y.style.height="80px";
	  	y.style.marginTop="30px";
	  	var z = document.getElementById("show-div");
	  	var t = document.getElementById("hide-div");
	  	z.hidden = true; 
	  	t.hidden = false;
  }
  	hideMore(){
	  	var changeDivHeight = document.getElementById("myOver");
	  	var x = document.getElementById("hide");
	  	var y = document.getElementById("btn2-toChange");
	  	changeDivHeight.style.height = "auto";
	  	y.style.height="30px";
	  	y.style.marginTop="0px";
	  	x.hidden=false;
	  	var z = document.getElementById("show-div");
	  	var t = document.getElementById("hide-div");
	  	z.hidden = false;
	  	t.hidden = true;
  }

}
