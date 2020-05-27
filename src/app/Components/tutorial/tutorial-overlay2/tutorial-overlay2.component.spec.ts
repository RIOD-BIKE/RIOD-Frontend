import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TutorialOverlay2Component } from './tutorial-overlay2.component';

describe('TutorialOverlay2Component', () => {
  let component: TutorialOverlay2Component;
  let fixture: ComponentFixture<TutorialOverlay2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialOverlay2Component ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialOverlay2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
