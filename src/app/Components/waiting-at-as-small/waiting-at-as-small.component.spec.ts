import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaitingAtAsSmallComponent } from './waiting-at-as-small.component';

describe('WaitingAtAsSmallComponent', () => {
  let component: WaitingAtAsSmallComponent;
  let fixture: ComponentFixture<WaitingAtAsSmallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingAtAsSmallComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingAtAsSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
