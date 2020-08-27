import { Component, OnInit } from '@angular/core';
import { Color3, Material, Mesh, StandardMaterial } from 'babylonjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { EngineService } from 'src/app/engine/engine.service';
import { CanvasHelper } from 'src/app/engine/helpers/CanvasHelper';

@Component({
  selector: 'material-panel',
  templateUrl: './material-panel.component.html',
  styleUrls: ['./material-panel.component.scss']
})
export class MaterialPanelComponent implements OnInit {

  public currentMesh: Mesh;

  constructor(private engineService: EngineService) {

    this.engineService.getCurrentMeshSelected()
      .pipe(filter((mesh: Mesh) => mesh !== null && mesh !== undefined))
      .pipe(distinctUntilChanged())
      .subscribe((m: Mesh) => {
        this.currentMesh = m;
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
