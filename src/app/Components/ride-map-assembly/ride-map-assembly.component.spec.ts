import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RideMapAssemblyComponent } from './ride-map-assembly.component';

describe('RideMapAssemblyComponent', () => {
  let component: RideMapAssemblyComponent;
  let fixture: ComponentFixture<RideMapAssemblyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RideMapAssemblyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RideMapAssemblyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
