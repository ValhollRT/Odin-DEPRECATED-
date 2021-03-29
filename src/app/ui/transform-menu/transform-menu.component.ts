import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DirectionalLight, HemisphericLight, Light, Mesh, ShadowLight, SpotLight, TargetCamera, Vector2, Vector3 } from 'babylonjs';
import { filter, map } from 'rxjs/operators';
import { Utils } from 'src/app/engine/Utils/Utils';
import { EngineService, LogService } from 'src/app/services/index.service';
import { AppState } from '../../store/app.reducer';

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

  selected: any;
  isMeshSelected: Boolean = false;
  isLightSelected: Boolean = false;
  isCameraSelected: Boolean = false;
  tm: TransformMenu;

  @ViewChild('rx', { static: false }) rx: ElementRef;
  @ViewChild('ry', { static: false }) ry: ElementRef;
  @ViewChild('rz', { static: false }) rz: ElementRef;

  @ViewChild('cx', { static: false }) cx: ElementRef;
  @ViewChild('cy', { static: false }) cy: ElementRef;
  @ViewChild('cz', { static: false }) cz: ElementRef;

  constructor(
    public engineServ: EngineService,
    public store: Store<AppState>,
    public logServ: LogService
  ) {
    this.tm = new TransformMenu();
    this.resetAll();
    this.store
      .pipe(select('engine'), filter(selection => selection.UUIDCsSelected.length > 0))
      .pipe(map(sel => this.engineServ.getContainerFromUUID(sel.UUIDCsSelected[0]).type))
      .subscribe((o: Mesh | Light | TargetCamera) => {
        this.isMeshSelected = o instanceof Mesh;
        this.isLightSelected = o instanceof Light;
        this.isCameraSelected = o instanceof TargetCamera;
        this.setTransformMenuSelected(o);
        this.logServ.log(this.tm, "edited transform", "TransformMenuComponent");
      });
  }

  ngOnInit(): void { }

  setTransformMenuSelected(o: Mesh | Light | TargetCamera) {
    if (o instanceof HemisphericLight) {
      this.resetAll();
      // This is important to hide the transform panel
      this.selected = null;
      return;
    }

    this.selected = o;
    if (o instanceof Mesh) {
      if (o.rotationQuaternion !== null && o.rotationQuaternion !== undefined) {
        o.rotation = o.rotationQuaternion.toEulerAngles();
        o.rotationQuaternion = null;
        this.tm.rotation = o.rotation;
      } else if (o.rotation !== null && o.rotation !== undefined) {
        this.tm.rotation = o.rotation;
      }
      return;
    }
    if (o instanceof ShadowLight) {
      if (o.direction !== undefined && (o instanceof DirectionalLight || SpotLight)) {
        this.tm.rotation = Utils.radiansToDegreesVector(o.direction);
      } else {
        this.tm.rotation = new Vector3(0, 0, 0);
      }
      this.tm.scaling = new Vector3(1, 1, 1);
      this.tm.center = new Vector3(0, 0, 0);
      this.tm.screenPosition = new Vector2(0, 0);
      return;
    }

    if (o instanceof TargetCamera) {
      if (o.target !== undefined) {
        this.tm.rotation = Utils.radiansToDegreesVector(o.target);
      } else {
        this.tm.rotation = new Vector3(0, 0, 0);
      }
      this.tm.scaling = new Vector3(1, 1, 1);
      this.tm.center = new Vector3(0, 0, 0);
      this.tm.screenPosition = new Vector2(0, 0);
      return;
    }
  }

  setPosition(value: string, axis: string) {
    let pos = this.selected.position;
    switch (axis) {
      case 'x':
        this.selected.position = new Vector3(Number(value), pos.y, pos.z)
        break;
      case 'y':
        this.selected.position = new Vector3(pos.x, Number(value), pos.z)
        break;
      case 'z':
        this.selected.position = new Vector3(pos.x, pos.y, Number(value))
        break;
      default:
        break;
    }

  }

  updateRotation(event: any) {
    let x = Utils.degreeToRadians(this.rx.nativeElement.value);
    let y = Utils.degreeToRadians(this.ry.nativeElement.value);
    let z = Utils.degreeToRadians(this.rz.nativeElement.value);
    if (this.selected instanceof Mesh) {
      this.selected.rotation = new Vector3(Utils.precision(x, 3), Utils.precision(y, 3), Utils.precision(z, 3));
    } else if (this.selected instanceof DirectionalLight || SpotLight) {
      this.selected.direction = new Vector3(Utils.precision(x, 3), Utils.precision(y, 3), Utils.precision(z, 3));
    }
  }

  updateCenterAxis() {
    this.selected.showSubMeshesBoundingBox = true;
    this.selected.setPivotPoint(new Vector3(this.cx.nativeElement.value, this.cy.nativeElement.value, this.cz.nativeElement.value));
  }

  resetPivotX() { this.selected.setPivotPoint(new Vector3(0, this.cy.nativeElement.value, this.cz.nativeElement.value)); }
  resetPivotY() { this.selected.setPivotPoint(new Vector3(this.cx.nativeElement.value, 0, this.cz.nativeElement.value)); }
  resetPivotZ() { this.selected.setPivotPoint(new Vector3(this.cx.nativeElement.value, this.cy.nativeElement.value, 0)); }

  resetPositions() { this.selected.position = new Vector3(0, 0, 0); }
  resetRotations() { this.selected.rotation = new Vector3(0, 0, 0); }
  resetDirections() { this.selected.direction = new Vector3(0, 0, 0); }
  resetTarget() { this.selected.target = new Vector3(0, 0, 0); }
  resetScalings() { this.selected.scaling = new Vector3(1, 1, 1); }
  resetCenters() { this.selected.setPivotPoint(new Vector3(0, 0, 0)); }

  resetAll() {
    this.tm.position = new Vector3(0, 0, 0);
    this.tm.rotation = new Vector3(0, 0, 0);
    this.tm.scaling = new Vector3(1, 1, 1);
    this.tm.center = new Vector3(0, 0, 0);
    this.tm.screenPosition = new Vector2(0, 0);
  }
}
