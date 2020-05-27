import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RideIndicatorAssemblyComponent } from './ride-indicator-assembly.component';

describe('RideIndicatorAssemblyComponent', () => {
  let component: RideIndicatorAssemblyComponent;
  let fixture: ComponentFixture<RideIndicatorAssemblyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RideIndicatorAssemblyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RideIndicatorAssemblyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
