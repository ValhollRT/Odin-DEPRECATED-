import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TargetCamera } from 'babylonjs';
import { ArcRotateCamera } from 'babylonjs/Cameras/arcRotateCamera';
import { filter, map } from 'rxjs/operators';
import { AppState } from '../../store/reducers/app.reducer';
import { EngineService, LogService } from './../../services/index.service';

@Component({
  selector: 'camera-panel',
  templateUrl: './camera-panel.component.html',
  styleUrls: ['./camera-panel.component.scss']
})
export class CameraPanelComponent implements OnInit {

  public selected: ArcRotateCamera;
  constructor(public engineService: EngineService,
    private store: Store<AppState>,
    public logService: LogService) {

    this.store
      .pipe(select('engine'),
        filter(selection => selection.UUIDCsSelected.length > 0),
        filter(sel => this.engineService.getContainerFromUUID(sel.UUIDCsSelected[0]).type instanceof TargetCamera),
        map(s => this.engineService.getContainerFromUUID(s.UUIDCsSelected[0]).type))
      .subscribe((cam: ArcRotateCamera) => {
        this.selected = cam;
        this.logService.log(cam.name, "camera selected", "CameraPanelComponent")
      });
  }

  ngOnInit(): void { }

  enableCamera(enable: boolean) {
    this.engineService.setCamera(this.selected);
  }
}