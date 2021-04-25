import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { PlugCamera } from 'src/app/engine/plugs/plug-camera';
import { AppService } from 'src/app/services/index.service';
import { AppState } from '../../store/app.reducer';
import { EngineService, LogService } from './../../services/index.service';

@Component({
  selector: 'camera-panel',
  templateUrl: './camera-panel.component.html',
  styleUrls: ['./camera-panel.component.scss']
})
export class CameraPanelComponent implements OnInit {

  public selected: PlugCamera;
  constructor(public engineServ: EngineService,
    private appServ: AppService,
    private store: Store<AppState>,
    public logServ: LogService) {

    this.store
      .pipe(select('engine'),
        filter(selection => selection.uuidCsSelected.length > 0),
        map(s => this.appServ.getContainerFromUuid(s.uuidCsSelected[0]).getPlugCamera()))
      .subscribe((camera: PlugCamera) => {
        if (camera == undefined) { this.selected = undefined; return; }
        this.selected = camera;
        this.logServ.log(camera.name, "camera selected", "CameraPanelComponent")
      });
  }

  ngOnInit(): void { }

  enableCamera() {
    this.engineServ.setCamera(this.selected);
  }
}