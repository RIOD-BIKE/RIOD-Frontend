import { Component, OnInit, Inject  } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'search-bar-main-map',
  templateUrl: './search-bar-main-map.component.html',
  styleUrls: ['./search-bar-main-map.component.scss'],
})
export class SearchBarMainMapComponent implements OnInit {
 displayColor: string;
 showRecentNav: boolean;
 private searchInput: string;
 private recentRoutes;
  constructor(  @Inject(DOCUMENT) private document: Document) {
    this.displayColor = '#66000000';
    this.showRecentNav = false;
    this.document.documentElement.style.setProperty('--displayColor', this.displayColor); }

  ngOnInit() {}

  getshowRecentNav() {
    return this.showRecentNav;
  }


  searchInputHandler() {
    let searchInputLower = this.searchInput.toLowerCase();
  }

  //
  loadRoute(id) {
  }

 
}
