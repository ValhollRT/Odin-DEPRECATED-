import { Component, OnInit } from '@angular/core';
import { Color3, Material, Mesh, StandardMaterial } from 'babylonjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { EngineService } from 'src/app/engine/engine.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'material-panel',
  templateUrl: './material-panel.component.html',
  styleUrls: ['./material-panel.component.scss']
})
export class MaterialPanelComponent implements OnInit {

  public currentMesh: Mesh;

  constructor(private engineService: EngineService, private logService: LogService) {

    this.engineService.getCurrentSelected$()
      .pipe(
        filter((o: any) => o instanceof Mesh),
        filter((mesh: Mesh) => mesh !== null && mesh !== undefined))
      .subscribe((m: Mesh) => {
        this.currentMesh = m;
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
