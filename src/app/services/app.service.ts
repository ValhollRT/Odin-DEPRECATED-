import { Injectable } from '@angular/core';
import { SceneSettings } from '../models/SceneSettings.model';

@Injectable({ providedIn: 'root' })
export class AppService {

  sceneSettings: SceneSettings;

  constructor() {
    this.sceneSettings = new SceneSettings();
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

  getSceneSettings(): SceneSettings {
    return { ... this.sceneSettings };
  }

  setSceneSettings(settings: SceneSettings): void {
    this.sceneSettings = { ...settings };
  }
}