import { BtnFooter } from './../../shared/popup-window/popup-window.component';
import { SceneSettings } from './../../models/SceneSettings';
import { LogService } from '../../services/log.service';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { EngineService } from 'src/app/engine/engine.service';

@Component({
  selector: 'scene-settings',
  templateUrl: './scene-settings.component.html',
  styleUrls: ['./scene-settings.component.scss']
})
export class SceneSettingsComponent implements OnInit {

  isOpen = false;
  tempSceneSettings: SceneSettings;
  saveBtnFooter: BtnFooter;

  constructor(public ap: AppService, public es: EngineService, public logService: LogService) {
    this.tempSceneSettings = new SceneSettings();
    // https://stackoverflow.com/questions/39074765/typescript-service-is-undefined-when-calling-a-function-from-common-service
    this.saveBtnFooter = { name: "Save", event: this.saveSettings.bind(this) };
  }

  ngOnInit() {
    this.ap.isOpenSettings.subscribe(isOpen => {
      this.tempSceneSettings = this.ap.getSceneSettings();
      this.isOpen = isOpen;
    });
  }

  saveSettings(): void {
    this.ap.setSceneSettings(this.tempSceneSettings);
    this.es.setBackgroundColorScene(this.tempSceneSettings.backgroundColor)
    // TODO call update settings engine
  }

  closeDialog(): void { this.ap.isOpenSettings.next(false); }

}


