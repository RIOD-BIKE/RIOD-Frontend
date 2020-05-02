import { MapBoxComponent } from 'src/app/components/map-box/map-box.component';

import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@NgModule({

    declarations: [MapBoxComponent],
    imports: [IonicModule],
    exports: [MapBoxComponent],
    providers:[MapBoxComponent]
  })
  export class ComponentsModule {}
  