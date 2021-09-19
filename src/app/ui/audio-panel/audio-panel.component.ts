import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { PlugAudio } from 'src/app/engine/plugs/plug-audio';
import { AppService } from 'src/app/services/app.service';
import { EngineService } from 'src/app/services/index.service';
import { LogService } from 'src/app/services/log.service';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'audio-panel',
  templateUrl: './audio-panel.component.html',
  styleUrls: ['./audio-panel.component.scss'],
})
export class AudioPanelComponent implements OnInit {
  public selected: PlugAudio;
  constructor(
    public engineServ: EngineService,
    private appServ: AppService,
    private store: Store<AppState>,
    public logServ: LogService
  ) {
    this.store
      .pipe(
        select('engine'),
        filter((selection) => selection.uuidCsSelected.length > 0),
        map((s) =>
          this.appServ.getContainerFromUuid(s.uuidCsSelected[0]).getPlugAudio()
        )
      )
      .subscribe((audio: PlugAudio) => {
        if (audio == undefined) {
          this.selected = undefined;
          return;
        }
        this.selected = audio;
        this.logServ.log(audio.name, 'audio selected', 'AudioPanelComponent');
      });
  }

  ngOnInit(): void {}

  playAudio() {
    if (!this.selected.isReady) {
      new BABYLON.Logger.Warn('Audio is not ready');
    } else {
      this.selected.play();
      this.selected.setVolume(0.6);
    }
  }
}
