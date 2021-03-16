import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Color3, Mesh, StandardMaterial } from 'babylonjs';
import { filter, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { EngineService } from 'src/app/engine/engine.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'material-panel',
  templateUrl: './material-panel.component.html',
  styleUrls: ['./material-panel.component.scss']
})
export class MaterialPanelComponent implements OnInit {

  public currentMesh: Mesh;
  public isGroup: boolean = false;

  constructor(private engineService: EngineService, store: Store<AppState>, private logService: LogService) {

    store.pipe(select('engine'),
      filter(selection => selection.UUIDCsSelected.length > 0),
      filter(sel => this.engineService.getContainerFromUUID(sel.UUIDCsSelected[0]).type instanceof Mesh),
      map(s => this.engineService.getContainerFromUUID(s.UUIDCsSelected[0]).type))
      .subscribe((m: Mesh) => {
        this.currentMesh = m;
        this.isGroup = this.engineService.getContainerFromType(m).panel == null;
        if (this.isGroup) return;
        this.logService.log(m.material.name, "edited material", "MaterialPanelComponent")
      });

  }

  ngOnInit(): void { }

  hexToRgb(value, attribute): void {

    if (attribute === "AMBIENTCOLOR") { (<StandardMaterial>this.currentMesh.material).ambientColor = Color3.FromHexString(value); }
    if (attribute === "DIFFUSECOLOR") { (<StandardMaterial>this.currentMesh.material).diffuseColor = Color3.FromHexString(value); }
    if (attribute === "EMISSIVECOLOR") { (<StandardMaterial>this.currentMesh.material).emissiveColor = Color3.FromHexString(value); }
    if (attribute === "SPECULARCOLOR") { (<StandardMaterial>this.currentMesh.material).specularColor = Color3.FromHexString(value); }
  }
}
