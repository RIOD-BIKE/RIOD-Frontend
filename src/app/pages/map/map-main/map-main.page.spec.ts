import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapMainPage } from './map-main.page';

describe('MapMainPage', () => {
  let component: MapMainPage;
  let fixture: ComponentFixture<MapMainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapMainPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
