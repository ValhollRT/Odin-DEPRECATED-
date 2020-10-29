import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DirectionalLight, Light, Mesh, ShadowLight, SpotLight, Vector2, Vector3 } from 'babylonjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { Utils } from 'src/app/engine/Utils/Utils';
import { EngineService } from 'src/app/services/index.service';
import { LogService } from 'src/app/services/log.service';

class TransformMenu {
  position: Vector3;
  rotation: Vector3;
  scaling: Vector3;
  center: Vector3;
  screenPosition: Vector2;
}

@Component({
  selector: 'transform-menu',
  templateUrl: './transform-menu.component.html',
  styleUrls: ['./transform-menu.component.scss']
})
export class TransformMenuComponent implements OnInit {

  currentSelected: any;
  tm: TransformMenu;

  @ViewChild('rx', { static: false }) rx: ElementRef;
  @ViewChild('ry', { static: false }) ry: ElementRef;
  @ViewChild('rz', { static: false }) rz: ElementRef;

  @ViewChild('cx', { static: false }) cx: ElementRef;
  @ViewChild('cy', { static: false }) cy: ElementRef;
  @ViewChild('cz', { static: false }) cz: ElementRef;

  constructor(
    public engineService: EngineService,
    public logService: LogService
  ) {
    this.tm = new TransformMenu();
    this.tm.position = new Vector3(0, 0, 0);
    this.tm.rotation = new Vector3(0, 0, 0);
    this.tm.scaling = new Vector3(1, 1, 1);
    this.tm.center = new Vector3(0, 0, 0);
    this.tm.screenPosition = new Vector2(0, 0);
  }

  ngOnInit(): void {

    this.engineService.getCurrentMeshSelected()
      .pipe(filter((mesh: Mesh) => mesh !== null && mesh !== undefined))
      .subscribe((m: Mesh) => {
        this.setTransformMenuSelected(m);
      });

    this.engineService.getCurrentLightSelected()
      .pipe(filter((light: ShadowLight) => light !== null && light !== undefined))
      .subscribe((l: ShadowLight) => {
        this.setTransformMenuSelected(<ShadowLight>l);
      });
  }

  setTransformMenuSelected(o: Mesh | ShadowLight) {
    this.currentSelected = o;
    if (o instanceof Mesh) {
      this.tm.position = o.position;
      if (o.rotationQuaternion !== null) {
        o.rotation = o.rotationQuaternion.toEulerAngles();
        o.rotationQuaternion = null;
        this.tm.rotation = o.rotation;
      } else if (o.rotation !== null) {
        this.tm.rotation = o.rotation;
      }

      this.tm.scaling = o.scaling;
      this.tm.center = o.getPivotPoint();
    } else {
      this.tm.position = o.position;
      if (o instanceof DirectionalLight || SpotLight) {
        this.tm.rotation = Utils.radiansToDegreesVector(o.getRotation());
      }
      else {
        this.tm.rotation = new Vector3(0, 0, 0);
      }
      this.tm.scaling = new Vector3(1, 1, 1);
      this.tm.center = new Vector3(0, 0, 0);
      this.tm.screenPosition = new Vector2(0, 0);
    }
  }

  updateRotation(event: any) {
    let x = Utils.degreeToRadians(this.rx.nativeElement.value);
    let y = Utils.degreeToRadians(this.ry.nativeElement.value);
    let z = Utils.degreeToRadians(this.rz.nativeElement.value);
    if (this.currentSelected instanceof Mesh) {
      this.currentSelected.rotation = new Vector3(Utils.precision(x, 3), Utils.precision(y, 3), Utils.precision(z, 3));
    } else if (this.currentSelected instanceof DirectionalLight || SpotLight) {
      this.currentSelected.direction = new Vector3(Utils.precision(x, 3), Utils.precision(y, 3), Utils.precision(z, 3));
    }
  }

  updateCenterAxis() {
    this.currentSelected.showSubMeshesBoundingBox = true;
    this.currentSelected.setPivotPoint(new Vector3(this.cx.nativeElement.value, this.cy.nativeElement.value, this.cz.nativeElement.value));
  }

}
