import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RideIndicatorFreeComponent } from './ride-indicator-free.component';

describe('RideIndicatorFreeComponent', () => {
  let component: RideIndicatorFreeComponent;
  let fixture: ComponentFixture<RideIndicatorFreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RideIndicatorFreeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RideIndicatorFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
