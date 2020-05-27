import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapStartPage } from './map-start.page';

describe('MapStartPage', () => {
  let component: MapStartPage;
  let fixture: ComponentFixture<MapStartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapStartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
