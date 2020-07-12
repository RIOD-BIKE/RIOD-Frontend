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

  constructor(private nativeAudio: NativeAudio, private mapDataFetch: MapDataFetchService, private platform: Platform) {
    this.init();
  }

  private async init() {
    if (this.platform.is('cordova')) {
      await Promise.all([
        this.nativeAudio.preloadSimple(Status.ALONE, `${this.path}${Status.ALONE}.mp3`),
        this.nativeAudio.preloadSimple(Status.GROUP, `${this.path}${Status.GROUP}.mp3`),
        this.nativeAudio.preloadSimple(Status.ASSOCIATION, `${this.path}${Status.ASSOCIATION}.mp3`),
      ]);
    }

    this.mapDataFetch.activeCluster.subscribe(async (activeCluster) => {
      if(this.isFirstPlayback) {
        this.isFirstPlayback = false;
        return;
      }
      if (!activeCluster) {
        console.log('Playing ALONE sound...');
        await this.play(Status.ALONE);
        return;
      }
      const count = activeCluster.count;
      if (count >= 5 && count <= 15) {
        console.log('Playing GROUP sound...');
        await this.play(Status.GROUP);
      } else if (count > 15) {
        console.log('Playing ASSOCIATION sound...');
        await this.play(Status.ASSOCIATION);
      }
    });
  }

  private async play(status: Status) {
    if (this.platform.is('cordova')) {
      await this.nativeAudio.play(status);
    } else {
      await (new Audio(`${this.path}${status}.mp3`)).play();
    }
  }
}
