import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FirstScreenPage } from './first-screen.page';

describe('FirstScreenPage', () => {
  let component: FirstScreenPage;
  let fixture: ComponentFixture<FirstScreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstScreenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FirstScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
