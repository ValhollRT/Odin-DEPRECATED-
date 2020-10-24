import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Light, Mesh, ShadowLight, Vector3 } from 'babylonjs';
import { filter } from 'rxjs/operators';
import { Utils } from 'src/app/engine/Utils/Utils';
import { TransformMenu } from 'src/app/models/transformMenuModel';
import { EngineService } from 'src/app/services/index.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'transform-menu',
  templateUrl: './transform-menu.component.html',
  styleUrls: ['./transform-menu.component.scss']
})
export class TransformMenuComponent implements OnInit {

  currentMeshSelected: any;
  public tm: TransformMenu;

  @ViewChild('rx', { static: false }) rx: ElementRef;
  @ViewChild('ry', { static: false }) ry: ElementRef;
  @ViewChild('rz', { static: false }) rz: ElementRef;

  @ViewChild('cx', { static: false }) cx: ElementRef;
  @ViewChild('cy', { static: false }) cy: ElementRef;
  @ViewChild('cz', { static: false }) cz: ElementRef;

  constructor(
    public engineService: EngineService,
    public logService: LogService
  ) { }

  ngOnInit(): void {
    this.tm = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scaling: { x: 1, y: 1, z: 1 },
      center: { x: 0, y: 0, z: 0 },
      screenPosition: { x: 0, y: 0 }
    };

    this.engineService.getCurrentMeshSelected()
      .pipe(filter((mesh: Mesh) => mesh !== null && mesh !== undefined))
      .subscribe((m: Mesh) => {
        this.currentMeshSelected = m;
        this.setTransformMenuSelectedMesh(this.currentMeshSelected);
      });
      
      this.engineService.getCurrentLightSelected()
      .pipe(filter((light: Light) => light !== null && light !== undefined))
      .subscribe((l: Light) => {
        this.currentMeshSelected = l;
        this.setTransformMenuSelectedLight(<ShadowLight>this.currentMeshSelected);
      });
  }

  setTransformMenuSelectedMesh(m: Mesh) {
    this.tm.position = m.position;
    
    if (m.rotationQuaternion !== null) {
      m.rotation = m.rotationQuaternion.toEulerAngles();
      m.rotationQuaternion = null;
      this.tm.rotation = m.rotation;
    }

    this.tm.scaling = m.scaling;
    this.tm.center = m.getPivotPoint();
  }

  setTransformMenuSelectedLight(l: ShadowLight) {
    this.tm.position = l.position;
    // this.tm.rotation = l.getRotation();
  }


  updateRotation(event: any) {
    let x = Utils.degreeToRadians(this.rx.nativeElement.value);
    let y = Utils.degreeToRadians(this.ry.nativeElement.value);
    let z = Utils.degreeToRadians(this.rz.nativeElement.value);
    // this.currentMeshSelected.rotation = new Vector3(x, y, z);
  }

  updateCenterAxis() {
    this.currentMeshSelected.showSubMeshesBoundingBox = true;
    this.currentMeshSelected.setPivotPoint(new Vector3(this.cx.nativeElement.value, this.cy.nativeElement.value, this.cz.nativeElement.value));
  }

}
