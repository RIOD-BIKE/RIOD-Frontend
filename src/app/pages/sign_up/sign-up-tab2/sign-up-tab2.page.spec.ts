import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignUpTab2Page } from './sign-up-tab2.page';

describe('SignUpTab2Page', () => {
  let component: SignUpTab2Page;
  let fixture: ComponentFixture<SignUpTab2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpTab2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpTab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
