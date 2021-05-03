import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Color3 } from 'babylonjs';
import { filter, map } from 'rxjs/operators';
import { PlugDirectionalLight } from 'src/app/engine/plugs/plug-light/plug-directional-light';
import { PlugHemisphericLight } from 'src/app/engine/plugs/plug-light/plug-hemispheric-light';
import { PlugPointLight } from 'src/app/engine/plugs/plug-light/plug-point-light';
import { AppService } from 'src/app/services/index.service';
import { AppState } from '../../store/app.reducer';
import { PlugSpotLight } from './../../engine/plugs/plug-light/plug-spot-light';
import { EngineService, LogService } from './../../services/index.service';

@Component({
  selector: 'light-panel',
  templateUrl: './light-panel.component.html',
  styleUrls: ['./light-panel.component.scss']
})
export class LightPanelComponent implements OnInit {

  public selected: PlugDirectionalLight | PlugSpotLight | PlugPointLight | PlugHemisphericLight;

  constructor(public engineServ: EngineService,
    private appServ: AppService,
    private store: Store<AppState>,
    public logServ: LogService) {

    this.store
      .pipe(select('engine'),
        filter(selection => selection.uuidCsSelected.length > 0),
        map(s => this.appServ.getContainerFromUuid(s.uuidCsSelected[0]).getPlugLight()))
      .subscribe((pl: PlugDirectionalLight | PlugSpotLight | PlugPointLight) => {
        if (pl == undefined) {
          this.selected = undefined;
          return;
        }
        this.selected = pl;
        this.logServ.log(pl.uuid, "light selected", "LightPanelComponent")
      });
  }

  ngOnInit(): void { }

  hexToRgb(value, attribute): void {
    if (attribute === "DIFFUSECOLOR") { (<any>this.selected).diffuse = Color3.FromHexString(value); }
    if (attribute === "SPECULARCOLOR") { (<any>this.selected).specular = Color3.FromHexString(value); }
  }
}