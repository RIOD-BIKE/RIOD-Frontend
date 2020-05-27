import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignUpTab3Page } from './sign-up-tab3.page';

describe('SignUpTab3Page', () => {
  let component: SignUpTab3Page;
  let fixture: ComponentFixture<SignUpTab3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpTab3Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpTab3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
