import { AppService } from 'src/app/services/index.service';
import { AppState } from 'src/app/app.reducer';
import { select, Store } from '@ngrx/store';
import { BtnFooter } from './../../shared/popup-window/popup-window.component';
import { SceneSettings } from './../../models/SceneSettings';
import { LogService } from '../../services/log.service';
import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/engine/engine.service';
import { openSceneSettings } from '../ui.action';
import { PopupDialogAction } from 'src/app/models/actions/PopupDialogAction';

@Component({
  selector: 'scene-settings',
  templateUrl: './scene-settings.component.html',
  styleUrls: ['./scene-settings.component.scss']
})
export class SceneSettingsComponent implements OnInit {

  isOpen = false;
  tempSceneSettings: SceneSettings;
  saveBtnFooter: BtnFooter;

  constructor(
    private store: Store<AppState>,
    private appService: AppService,
    public es: EngineService,
    public logService: LogService) {
    this.tempSceneSettings = new SceneSettings();
    // https://stackoverflow.com/questions/39074765/typescript-service-is-undefined-when-calling-a-function-from-common-service
    this.saveBtnFooter = { name: "Save", event: this.saveSettings.bind(this) };
  }

  ngOnInit() {
    this.store.select('ui').subscribe(ui => {
      this.tempSceneSettings = this.appService.getSceneSettings();
      this.isOpen = ui.sceneSettings.open;
    });
  }

  saveSettings(): void {
    this.appService.setSceneSettings(this.tempSceneSettings);
    this.es.setBackgroundColorScene(this.tempSceneSettings.backgroundColor)
    // TODO call update settings engine
  }

  closeDialog() {
    this.store.dispatch(openSceneSettings({ sceneSettings: new PopupDialogAction(false) }))
  }

}


