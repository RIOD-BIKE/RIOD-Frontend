import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SettingsManualPage } from './settings-manual.page';

describe('SettingsManualPage', () => {
  let component: SettingsManualPage;
  let fixture: ComponentFixture<SettingsManualPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsManualPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsManualPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
