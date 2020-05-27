import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SettingsMainPage } from './settings-main.page';

describe('SettingsMainPage', () => {
  let component: SettingsMainPage;
  let fixture: ComponentFixture<SettingsMainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsMainPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
