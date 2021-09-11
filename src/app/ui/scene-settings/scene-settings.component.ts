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
  sceneSettings: SceneSettings;
  saveBtnFooter: BtnFooter;

  constructor(
    private store: Store<AppState>,
    private appService: AppService,
    public engineServ: EngineService,
    public logService: LogService) {
    this.sceneSettings = new SceneSettings();
    // https://stackoverflow.com/questions/39074765/typescript-service-is-undefined-when-calling-a-function-from-common-service
    this.saveBtnFooter = { name: "Save", event: this.saveSettings.bind(this) };
  }

  ngOnInit() {
    this.store.select('ui').subscribe(ui => {
      this.appService.loadSceneSettings().then(settings => {
        console.log(settings);
        this.sceneSettings = settings;
        this.isOpen = ui.sceneSettings.open;
        this.setSettings(settings);
      });
    });
  }

  setSettings(settings: SceneSettings) {
    this.engineServ.setBackgroundColorScene(settings.backgroundColor)
  }

  saveSettings(): void {
    this.appService.setSceneSettings(this.sceneSettings);
    this.engineServ.setBackgroundColorScene(this.sceneSettings.backgroundColor)
  }

  closeDialog() {
    this.store.dispatch(openSceneSettings({ sceneSettings: new PopupDialogAction(false) }))
  }
}