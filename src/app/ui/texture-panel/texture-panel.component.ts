import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Texture } from 'babylonjs';
import { filter, map } from 'rxjs/operators';
import { PlugTexture } from 'src/app/engine/plugs/plug-texture';
import { AppService } from 'src/app/services/index.service';
import { AppState } from '../../store/app.reducer';
import { EngineService, LogService } from './../../services/index.service';

@Component({
  selector: 'texture-panel',
  templateUrl: './texture-panel.component.html',
  styleUrls: ['./texture-panel.component.scss'],
})
export class TexturePanelComponent implements OnInit {
  public selected: PlugTexture;

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
          this.appServ
            .getContainerFromUuid(s.uuidCsSelected[0])
            .getPlugTexture()
        )
      )
      .subscribe((pt: PlugTexture) => {
        if (pt == undefined) {
          this.selected = undefined;
          return;
        }
        this.selected = pt;
        this.logServ.log(pt.uuid, 'light selected', 'LightPanelComponent');
      });
  }

  ngOnInit(): void {}

  onChange(v) {
  }
}
