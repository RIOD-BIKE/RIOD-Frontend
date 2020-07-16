import { MapDataFetchService } from './../map-data-fetch/map-data-fetch.service';
import { Injectable } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';

@Injectable({
  providedIn: 'root'
})
export class VibrationService {

  private isFirstPlayback = true;

  constructor(private vibration: Vibration,  private mapDataFetch: MapDataFetchService) {
    this.mapDataFetch.activeCluster.subscribe(async (activeCluster) => {
      // TODO: check settings, if vibration is even active!
      if(this.isFirstPlayback) {
        this.isFirstPlayback = false;
        return;
      }
      if (!activeCluster) {
        console.log('Vibrating ALONE...');
        this.vibration.vibrate(1000);
        return;
      }
      const count = activeCluster.count;
      if (count >= 5 && count <= 15) {
        console.log('Vibrating GROUP...');
        this.vibration.vibrate(1000);
        await new Promise(_ => setTimeout(_, 1000));
        this.vibration.vibrate(1000);
      } else if (count > 15) {
        console.log('Vibrating ASSOCIATION...');
        this.vibration.vibrate(1000);
        await new Promise(_ => setTimeout(_, 1000));
        this.vibration.vibrate(1000);
        await new Promise(_ => setTimeout(_, 1000));
        this.vibration.vibrate(1000);
      }
    });
  }
}
