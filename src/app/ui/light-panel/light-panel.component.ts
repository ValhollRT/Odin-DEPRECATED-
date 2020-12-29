import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Color3, Light, Mesh } from 'babylonjs';
import { filter, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { EngineService } from 'src/app/engine/engine.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'light-panel',
  templateUrl: './light-panel.component.html',
  styleUrls: ['./light-panel.component.scss']
})
export class LightPanelComponent implements OnInit {

  public currentLight: Light;
  constructor(public engineService: EngineService,
    private store: Store<AppState>,
    public logService: LogService) {

    this.store
      .pipe(select('engine'),
        filter(selection => selection.UUIDCsSelected.length > 0),
        filter(sel => this.engineService.getContainerFromUUID(sel.UUIDCsSelected[0]).type instanceof Light),
        map(s => this.engineService.getContainerFromUUID(s.UUIDCsSelected[0]).type))
      .subscribe((l: Light) => {
        this.currentLight = l;
        this.logService.log(l.name, "light selected", "LightPanelComponent")
      });

  }

  ngOnInit(): void { }

  hexToRgb(value, attribute): void {
    if (attribute === "DIFFUSECOLOR") { this.currentLight.diffuse = Color3.FromHexString(value); }
    if (attribute === "SPECULARCOLOR") { this.currentLight.specular = Color3.FromHexString(value); }
  }

}
