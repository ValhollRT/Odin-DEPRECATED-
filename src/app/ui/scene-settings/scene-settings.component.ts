import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PopupDialogAction, SceneSettings } from '../../models';
import { openSceneSettings } from '../../store/actions';
import { AppState } from '../../store/app.reducer';
import { AppService, EngineService, LogService } from './../../services/index.service';
import { BtnFooter } from './../../shared/popup-window/popup-window.component';

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