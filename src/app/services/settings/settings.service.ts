import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly KEY_GPS = 'settings_gps';
  private readonly KEY_VOLUME = 'settings_volume';
  private readonly KEY_VIBRATION = 'settings_vibration';
  private readonly KEY_DISPLAY = 'settings_display';


  private gps: boolean;
  private volume: boolean;
  private vibration: boolean;
  private display: boolean;

  constructor(private storage: Storage) {
    this.storage.get(this.KEY_GPS).then(gps => {
      this.gps = gps;
    });
    this.storage.get(this.KEY_VOLUME).then(volume => {
      this.volume = volume;
    });
    this.storage.get(this.KEY_VIBRATION).then(vibration => {
      this.vibration = vibration;
    });
    this.storage.get(this.KEY_DISPLAY).then(display => {
      this.display = display;
    });
  }

  async getGPS(): Promise<boolean> {
    return this.gps ?? await this.storage.get(this.KEY_GPS);
  }

  async getVolume(): Promise<string> {
    return this.volume ?? await this.storage.get(this.KEY_VOLUME);
  }

  async getVibration(): Promise<boolean> {
    return this.vibration ?? await this.storage.get(this.KEY_VIBRATION);
  }

  async getDisplay(): Promise<boolean> {
    return this.display ?? await this.storage.get(this.KEY_DISPLAY);
  }

  setGPS(isOn: boolean) {
    this.storage.set(this.KEY_GPS, JSON.stringify(isOn));
  }

  setVolume(level: number) {
    this.storage.set(this.KEY_VOLUME, JSON.stringify(level));
  }

  setVibration(isOn: boolean) {
    this.storage.set(this.KEY_VIBRATION, JSON.stringify(isOn));
  }

  setDisplay(keepOn: boolean) {
    this.storage.set(this.KEY_DISPLAY, JSON.stringify(keepOn));
  }
}
