import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignUpTab4Page } from './sign-up-tab4.page';

describe('SignUpTab4Page', () => {
  let component: SignUpTab4Page;
  let fixture: ComponentFixture<SignUpTab4Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpTab4Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpTab4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
