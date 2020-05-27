import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RouterInfoInBottomComponent } from './router-info-in-bottom.component';

describe('RouterInfoInBottomComponent', () => {
  let component: RouterInfoInBottomComponent;
  let fixture: ComponentFixture<RouterInfoInBottomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterInfoInBottomComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RouterInfoInBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
