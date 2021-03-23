import { ArcRotateCamera } from 'babylonjs/Cameras/arcRotateCamera';
import { TargetCamera } from 'babylonjs';
import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/services/index.service';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { LogService } from 'src/app/services/log.service';
import { filter, map } from 'rxjs/operators';

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

  ngOnInit(): void {
  }

  enableCamera(enable: boolean) {
    this.engineService.setCamera(this.selected);
  }
}