import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignUpTab1Page } from './sign-up-tab1.page';

describe('SignUpTab1Page', () => {
  let component: SignUpTab1Page;
  let fixture: ComponentFixture<SignUpTab1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpTab1Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpTab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
