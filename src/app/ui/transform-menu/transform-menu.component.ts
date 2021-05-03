import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DirectionalLight, HemisphericLight, Light, Mesh, ShadowLight, SpotLight, TargetCamera, Vector2, Vector3 } from 'babylonjs';
import { filter, map } from 'rxjs/operators';
import { Utils } from 'src/app/engine/Utils/Utils';
import { RotationPipe } from 'src/app/pipes/rotation.pipe';
import { AppService, EngineService, LogService } from 'src/app/services/index.service';
import { PlugTransform } from '../../engine/plugs/plug-transform';
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

  public rotationPipe = new RotationPipe();

  constructor(
    public engineServ: EngineService,
    public appServ: AppService,
    public store: Store<AppState>,
    public logServ: LogService
  ) {
    this.tm = new TransformMenu();
    this.resetAll();
    this.store
      .pipe(select('engine'), filter(selection => selection.uuidCsSelected.length > 0))
      .pipe(map(sel => this.appServ.getContainerFromUuid(sel.uuidCsSelected[0]).getPlugTransform()))
      .subscribe((o: PlugTransform) => {
        this.setTransformMenuSelected(o);
        this.logServ.log(this.tm, "edited transform", "TransformMenuComponent");
      });
  }

  ngOnInit(): void { }

  setTransformMenuSelected(o: Mesh | Light | TargetCamera | PlugTransform) {
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

  pipeInputRotation = (el: HTMLInputElement): number => {
    let rad = Utils.degreeToRadians(parseFloat(el.value) || 0);
    return Utils.precision(rad, 3);
  };

  resetAll() {
    this.tm.position = new Vector3(0, 0, 0);
    this.tm.rotation = new Vector3(0, 0, 0);
    this.tm.scaling = new Vector3(1, 1, 1);
    this.tm.center = new Vector3(0, 0, 0);
    this.tm.screenPosition = new Vector2(0, 0);
  }
}
