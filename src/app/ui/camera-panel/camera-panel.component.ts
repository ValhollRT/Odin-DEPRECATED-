import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TargetCamera } from 'babylonjs';
import { ArcRotateCamera } from 'babylonjs/Cameras/arcRotateCamera';
import { filter, map } from 'rxjs/operators';
import { AppState } from '../../store/app.reducer';
import { EngineService, LogService } from './../../services/index.service';

@Component({
  selector: 'camera-panel',
  templateUrl: './camera-panel.component.html',
  styleUrls: ['./camera-panel.component.scss']
})
export class CameraPanelComponent implements OnInit {

  public selected: ArcRotateCamera;
  constructor(public engineServ: EngineService,
    private store: Store<AppState>,
    public logServ: LogService) {

    this.store
      .pipe(select('engine'),
        filter(selection => selection.UUIDCsSelected.length > 0),
        filter(sel => this.engineServ.getContainerFromUUID(sel.UUIDCsSelected[0]).type instanceof TargetCamera),
        map(s => this.engineServ.getContainerFromUUID(s.UUIDCsSelected[0]).type))
      .subscribe((cam: ArcRotateCamera) => {
        this.selected = cam;
        this.logServ.log(cam.name, "camera selected", "CameraPanelComponent")
      });
  }

  ngOnInit(): void { }

  enableCamera(enable: boolean) {
    this.engineServ.setCamera(this.selected);
  }
}