import { SettingsService } from './../settings/settings.service';
import { BehaviorSubject } from 'rxjs';
import { MapDataFetchService } from './../map-data-fetch/map-data-fetch.service';
import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';

export enum Status {
  ALONE = 'statusAlone',
  GROUP = 'statusGroup',
  ASSOCIATION = 'statusAssociation'
}

@Injectable({
  providedIn: 'root'
})
export class StatusAudioService {

  private path = 'assets/audio/';
  private isFirstPlayback = true;
  private currentSize: number;

  constructor(private nativeAudio: NativeAudio, private mapDataFetch: MapDataFetchService, private platform: Platform, private settingsService: SettingsService) {
    this.init();
  }

  private async init() {
    if (this.platform.is('cordova')) {
      await Promise.all([
        this.nativeAudio.preloadComplex(Status.ALONE, `${this.path}${Status.ALONE}.mp3`, 1, 1, 0),
        this.nativeAudio.preloadComplex(Status.GROUP, `${this.path}${Status.GROUP}.mp3`, 1, 1, 0),
        this.nativeAudio.preloadComplex(Status.ASSOCIATION, `${this.path}${Status.ASSOCIATION}.mp3`, 1, 1, 0)
      ]);
    }

    this.mapDataFetch.activeClusterStatus.subscribe(async (status) => {
      if(this.isFirstPlayback) {
        this.isFirstPlayback = false;
        return;
      }
      if (status === Status.ALONE) {
        // console.log('Playing ALONE sound...');
        await this.play(Status.ALONE);
        return;
      }
      if (status === Status.GROUP) {
        // console.log('Playing GROUP sound...');
        await this.play(Status.GROUP);
      } else if (status === Status.ASSOCIATION) {
        // console.log('Playing ASSOCIATION sound...');
        await this.play(Status.ASSOCIATION);
      }
    });
  }

  private async play(status: Status) {
    if (this.platform.is('cordova')) {
      const volume = await this.settingsService.getVolume();
      await this.nativeAudio.setVolumeForComplexAsset(status, volume),
      await this.nativeAudio.play(status);
    } else {
      await (new Audio(`${this.path}${status}.mp3`)).play();
    }
  }
}
