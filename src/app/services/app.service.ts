import { SceneSettings } from './../models/SceneSettings';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {

  isOpenAboutUs: BehaviorSubject<boolean>;
  isOpenConsole: BehaviorSubject<boolean>;
  isOpenSettings: BehaviorSubject<boolean>;
  isOpenLogin: BehaviorSubject<boolean>;
  sceneSettings: SceneSettings;



  constructor() {
    this.sceneSettings = new SceneSettings();
    this.isOpenAboutUs = new BehaviorSubject(false);
    this.isOpenConsole = new BehaviorSubject(false);
    this.isOpenSettings = new BehaviorSubject(false);
    this.isOpenLogin = new BehaviorSubject(false);
    this.loadSceneSettings();

  }

  loadSceneSettings() {
    // TODO Load from firebase

    //Default Settings
    this.loadDefaultSceneSettings();
  }

  loadDefaultSceneSettings() {
    this.sceneSettings.backgroundColor = "#000000";
  }

  openAboutOdin() {
    this.isOpenAboutUs.next(!this.isOpenAboutUs.getValue());
  }

  openConsole() {
    this.isOpenConsole.next(!this.isOpenConsole.getValue());
  }

  openSettings() {
    this.isOpenSettings.next(!this.isOpenSettings.getValue());
  }

  openLogin() {
    this.isOpenLogin.next(!this.isOpenLogin.getValue());
  }

  getSceneSettings(): SceneSettings {
    return { ... this.sceneSettings };
  }

  setSceneSettings(settings: SceneSettings): void {
    this.sceneSettings = { ...settings };
  }
}