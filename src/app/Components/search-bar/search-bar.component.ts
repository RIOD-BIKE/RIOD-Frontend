import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  name:string;
  address: string;
  locArray = [
    { "name": "home", "street": "Wiesenbachstraße 20b", "city":"Osnabrück" },
    { "name": "work", "street": "Sutthauserstraße 52", "city":"Osnabrück"},
    { "name": "heart", "street": "Heinrichstraße 37", "city":"Osnabrück" }
  ];
  

  constructor() {}

  ngOnInit() {
    if (this.locArray.length == 0) {
      var a = document.getElementById("no-content");
      var b = document.getElementById("with-content");
      var c = document.getElementById("edit-no-content");
      var edit3 = document.getElementById("edit-span");
      a.hidden = false;
      b.hidden = true;
      c.hidden = true;
      edit3.hidden = true;
    } else {
      var a = document.getElementById("no-content");
      var b = document.getElementById("with-content");
      var c = document.getElementById("edit-no-content");
      var edit3 = document.getElementById("edit-span");
      a.hidden = true;
      b.hidden = false;
      c.hidden = true;
      edit3.hidden = true;
    }
  }

  back() {
    var back = document.getElementById("back");
    var noContent = document.getElementById("no-content");
    var c = document.getElementById("edit-no-content");
    back.style.display = "none";
    var over = document.getElementById("over");
    var edit3 = document.getElementById("edit-span");
    over.style.height = "auto";
    over.style.borderBottomLeftRadius = "10px";
    over.style.borderBottomRightRadius = "10px";
    edit3.hidden = true;
    if (this.locArray.length == 0) {
      noContent.hidden = false;
      c.hidden = true;
    } else {
      noContent.hidden = true;
    }
  }
  onTouchSearch() {
    var back = document.getElementById("back");
    back.style.display = "block";
    var over = document.getElementById("over");
    over.style.height = "100vh";
    over.style.borderBottomLeftRadius = "0px";
    over.style.borderBottomRightRadius = "0px";
    over.style.transition = "2s !important";
    if (this.locArray.length == 0) {
      var noContent = document.getElementById("no-content");
      var edit1 = document.getElementById("edit-no-content");
      var edit2 = document.getElementById("with-content");
      var edit3 = document.getElementById("edit-span");
      noContent.hidden = true;
      edit1.hidden = false;
      edit2.hidden = true;
      edit3.hidden = true;
    } else {
      var edit1 = document.getElementById("edit-no-content");
      var edit2 = document.getElementById("with-content");
      var edit3 = document.getElementById("edit-span");
      edit1.hidden = true;
      edit2.hidden = false;
      edit3.hidden = false;
    }
  }
}
