import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TutorialOverlay1Component } from './tutorial-overlay1.component';

describe('TutorialOverlay1Component', () => {
  let component: TutorialOverlay1Component;
  let fixture: ComponentFixture<TutorialOverlay1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialOverlay1Component ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialOverlay1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
