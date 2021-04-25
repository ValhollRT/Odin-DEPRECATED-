import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Color3 } from 'babylonjs';
import { filter, map } from 'rxjs/operators';
import { AppService } from 'src/app/services/index.service';
import { AppState } from '../../store/app.reducer';
import { PlugMaterial } from './../../engine/plugs/plug-material';
import { EngineService, LogService } from './../../services/index.service';

@Component({
  selector: 'material-panel',
  templateUrl: './material-panel.component.html',
  styleUrls: ['./material-panel.component.scss']
})
export class MaterialPanelComponent implements OnInit {

  public selected: PlugMaterial;
  public isGroup: boolean = false;

  constructor(private engineServ: EngineService, private appServ: AppService, store: Store<AppState>, private logServ: LogService) {

    store.pipe(select('engine'),
      filter(selection => selection.uuidCsSelected.length > 0),
      map(s => this.appServ.getContainerFromUuid(s.uuidCsSelected[0]).getPlugMaterial()))
      .subscribe((pm: PlugMaterial) => {
        this.selected = pm;
        if (this.selected == undefined) return;
        this.logServ.log(pm?.name, "edited material", "MaterialPanelComponent")
      });
  }

  ngOnInit(): void { }

  hexToRgb(value, attribute): void {

    if (attribute === "AMBIENTCOLOR") { this.selected.ambientColor = Color3.FromHexString(value); }
    if (attribute === "DIFFUSECOLOR") { this.selected.diffuseColor = Color3.FromHexString(value); }
    if (attribute === "EMISSIVECOLOR") { this.selected.emissiveColor = Color3.FromHexString(value); }
    if (attribute === "SPECULARCOLOR") { this.selected.specularColor = Color3.FromHexString(value); }
  }
}