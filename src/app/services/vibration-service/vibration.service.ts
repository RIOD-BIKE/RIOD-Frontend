import { SettingsService } from './../settings/settings.service';
import { MapDataFetchService } from './../map-data-fetch/map-data-fetch.service';
import { Injectable } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Status } from 'src/app/Classess/map/status';

@Injectable({
  providedIn: 'root'
})
export class VibrationService {

  private isFirstPlayback = true;

  constructor(private vibration: Vibration, private mapDataFetch: MapDataFetchService, private settingsService: SettingsService) {
    this.mapDataFetch.activeClusterStatus.subscribe(async (status) => {
      if (this.isFirstPlayback) {
        this.isFirstPlayback = false;
        return;
      }
      if (!await this.settingsService.getVibration()) { return; }
      if (status === Status.ALONE) {
        // console.log('Vibrating ALONE...');
        this.vibration.vibrate(1000);
        return;
      }
      if (status === Status.GROUP) {
        // console.log('Vibrating GROUP...');
        this.vibration.vibrate(1000);
        await new Promise(_ => setTimeout(_, 1000));
        this.vibration.vibrate(1000);
      } else if (status === Status.ASSOCIATION) {
        // console.log('Vibrating ASSOCIATION...');
        this.vibration.vibrate(1000);
        await new Promise(_ => setTimeout(_, 1000));
        this.vibration.vibrate(1000);
        await new Promise(_ => setTimeout(_, 1000));
        this.vibration.vibrate(1000);
      }
    });
  }
}
