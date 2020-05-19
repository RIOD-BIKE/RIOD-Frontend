import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RideIndicatorFinalComponent } from './ride-indicator-final.component';

describe('RideIndicatorFinalComponent', () => {
  let component: RideIndicatorFinalComponent;
  let fixture: ComponentFixture<RideIndicatorFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RideIndicatorFinalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RideIndicatorFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
