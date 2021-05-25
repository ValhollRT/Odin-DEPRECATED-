import {
  Component,
  ElementRef,
  NgZone, OnInit,
  ViewChild
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BoundingBox, BoundingInfo, Color3, GizmoManager, LightGizmo, Mesh, PickingInfo, Vector3 } from 'babylonjs';
import { take } from 'rxjs/operators';
import { PlugGeometry } from 'src/app/engine/plugs/plug-geometry';
import { PlugText } from 'src/app/engine/plugs/plug-text';
import { Utils } from 'src/app/engine/Utils/Utils';
import { AppService, EngineService } from 'src/app/services/index.service';
import { Container } from 'src/app/shared/container/container';
import { clearSelection, oneSelection } from 'src/app/store/actions';
import { GizmoHelper } from '../../engine/helpers/gizmo-helper';
import { AppState } from './../../store/app.reducer';

@Component({
  selector: 'app-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss']
})
export class ViewportComponent implements OnInit {

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  private pickInfo: PickingInfo;
  private startingPoint: any;
  private gizmoManager: GizmoManager;
  private lightGizmo: LightGizmo;
  private gizmoHelper: GizmoHelper;

  public constructor(
    public ngZone: NgZone,
    private engineServ: EngineService,
    private appServ: AppService,
    public store: Store<AppState>) {
  }

  public ngOnInit(): void {
    this.engineServ.createScene(this.rendererCanvas);
    this.initCanvasRender();
    this.gizmoHelper = new GizmoHelper(this.engineServ.getEngine(), this.engineServ.getCamera());
    let cameraViewport = this.engineServ.getCamera();
    cameraViewport.onViewMatrixChangedObservable.add(() => {
      this.gizmoHelper.cameraGizmo.position = cameraViewport.position;
    });
    this.ngZone.runOutsideAngular(() => {
      this.engineServ.animate(this.gizmoHelper.getScene());
    });
  }

  initCanvasRender() {
    let scene = this.engineServ.getScene();
    let canvas = this.rendererCanvas.nativeElement

    //LightGizmo
    this.lightGizmo = new LightGizmo();

    // Initialize GizmoManager
    this.gizmoManager = new GizmoManager(this.engineServ.getScene())
    this.gizmoManager.boundingBoxGizmoEnabled = true
    this.gizmoManager.clearGizmoOnEmptyPointerEvent = true;
    //Trick to keep gizmo selected while orbiting viewport
    this.gizmoManager.usePointerToAttachGizmos = false;

    canvas.addEventListener("pointerdown", this.onPointerDown, false);
    canvas.addEventListener("pointerup", this.onPointerUp, false);
    canvas.addEventListener("onmouseenter", this.onPointerDown, false);

    scene.onDispose = () => {
      canvas.removeEventListener("pointerdown", this.onPointerDown);
      canvas.removeEventListener("pointerup", this.onPointerUp);
      canvas.removeEventListener("onmouseenter", this.onPointerDown, false);
    }

    canvas.onmouseover = (e) => { canvas.focus(); }
    canvas.onkeydown = (e) => {
      this.lockGizmoTransform = true;
      if (e.key == 'f') {
        let container = this.appServ.getFirstSelected();
        if (!this.appServ.noSelected()) {
          let pMesh = container.getPlugTransform().getAbsolutePosition();
          this.engineServ.getCamera().setTarget(new Vector3(pMesh.x, pMesh.y, pMesh.z));
        }
      }
      if (e.key == 'w') {
        this.gizmoManager.positionGizmoEnabled = !this.gizmoManager.positionGizmoEnabled
        this.gizmoManager.gizmos.positionGizmo.snapDistance = 0.001;
        this.gizmoManager.rotationGizmoEnabled = false;
        this.gizmoManager.scaleGizmoEnabled = false;
        this.gizmoManager.boundingBoxGizmoEnabled = false;
      }
      if (e.key == 'e') {
        this.gizmoManager.positionGizmoEnabled = false;
        this.gizmoManager.rotationGizmoEnabled = !this.gizmoManager.rotationGizmoEnabled
        this.gizmoManager.gizmos.rotationGizmo.snapDistance = 0.001;
        this.gizmoManager.scaleGizmoEnabled = false;
        this.gizmoManager.boundingBoxGizmoEnabled = false;
      }
      if (e.key == 'r') {
        this.gizmoManager.positionGizmoEnabled = false;
        this.gizmoManager.rotationGizmoEnabled = false;
        this.gizmoManager.scaleGizmoEnabled = !this.gizmoManager.scaleGizmoEnabled
        this.gizmoManager.gizmos.scaleGizmo.snapDistance = 0.001;
        this.gizmoManager.boundingBoxGizmoEnabled = false;
      }
      if (e.key == 'q') {
        this.gizmoManager.positionGizmoEnabled = false;
        this.gizmoManager.rotationGizmoEnabled = false;
        this.gizmoManager.scaleGizmoEnabled = false;
      }
      if (e.key == 't') {
        this.gizmoManager.gizmos.positionGizmo.updateGizmoPositionToMatchAttachedMesh = !this.gizmoManager.gizmos.positionGizmo.updateGizmoPositionToMatchAttachedMesh;
        this.gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = !this.gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh;
        this.gizmoManager.gizmos.positionGizmo.updateScale = true;
      }
      if (e.key == 'Alt') {
        this.engineServ.getCamera().attachControl(canvas, true, true);
      }
    }

    canvas.onkeyup = (e) => {
      if (e.key == 'Alt') {
        this.lockGizmoTransform = false;
        this.engineServ.getCamera().detachControl(this.rendererCanvas.nativeElement);
      }
    }
    this.initializeGizmo();

    this.store.select('engine').subscribe(en => {
      if (en.prevUuidCsSelected.length > 0) {
        this.clearHighLightSelected(this.appServ.uuidToContainer.get(en.prevUuidCsSelected[0]));
      }

      if (en.uuidCsSelected.length > 0) {
        let container = this.appServ.uuidToContainer.get(en.uuidCsSelected[0]);
        if (container.locked) return

        this.setSelected(container);
      } else {
        this.gizmoManager.positionGizmoEnabled = false;
        this.gizmoManager.rotationGizmoEnabled = false;
        this.gizmoManager.scaleGizmoEnabled = false;
        this.gizmoManager.attachToNode(null);
        this.lightGizmo.light = null;
      }
    });
  }

  initializeGizmo() {
    this.gizmoManager.positionGizmoEnabled = true;
    this.gizmoManager.rotationGizmoEnabled = true;
    this.gizmoManager.scaleGizmoEnabled = true;
    this.gizmoManager.boundingBoxGizmoEnabled = true;
    this.gizmoManager.positionGizmoEnabled = false;
    this.gizmoManager.rotationGizmoEnabled = false;
    this.gizmoManager.scaleGizmoEnabled = false;
    this.gizmoManager.boundingBoxGizmoEnabled = false;
    this.onDragStartObservableGizmo();
    this.onDragEndObservableGizmo();
  }

  public lockGizmoTransform: boolean = false;
  startTransformCurrent() { this.lockGizmoTransform = true; }
  endTransformCurrent() { this.lockGizmoTransform = false; }


  public onDragStartObservableGizmo() {
    this.gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.onDragStartObservable.add(() => { this.startTransformCurrent(); });
    this.gizmoManager.gizmos.positionGizmo.yGizmo.dragBehavior.onDragStartObservable.add(() => { this.startTransformCurrent(); });
    this.gizmoManager.gizmos.positionGizmo.zGizmo.dragBehavior.onDragStartObservable.add(() => { this.startTransformCurrent(); });
    this.gizmoManager.gizmos.rotationGizmo.xGizmo.dragBehavior.onDragStartObservable.add(() => { this.startTransformCurrent(); });
    this.gizmoManager.gizmos.rotationGizmo.yGizmo.dragBehavior.onDragStartObservable.add(() => { this.startTransformCurrent(); });
    this.gizmoManager.gizmos.rotationGizmo.zGizmo.dragBehavior.onDragStartObservable.add(() => { this.startTransformCurrent(); });
    this.gizmoManager.gizmos.scaleGizmo.xGizmo.dragBehavior.onDragStartObservable.add(() => { this.startTransformCurrent(); });
    this.gizmoManager.gizmos.scaleGizmo.yGizmo.dragBehavior.onDragStartObservable.add(() => { this.startTransformCurrent(); });
    this.gizmoManager.gizmos.scaleGizmo.zGizmo.dragBehavior.onDragStartObservable.add(() => { this.startTransformCurrent(); });
  }

  public onDragEndObservableGizmo() {
    this.gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.onDragEndObservable.add(() => { this.endTransformCurrent(); });
    this.gizmoManager.gizmos.positionGizmo.yGizmo.dragBehavior.onDragEndObservable.add(() => { this.endTransformCurrent(); });
    this.gizmoManager.gizmos.positionGizmo.zGizmo.dragBehavior.onDragEndObservable.add(() => { this.endTransformCurrent(); });
    this.gizmoManager.gizmos.rotationGizmo.xGizmo.dragBehavior.onDragEndObservable.add(() => { this.endTransformCurrent(); });
    this.gizmoManager.gizmos.rotationGizmo.yGizmo.dragBehavior.onDragEndObservable.add(() => { this.endTransformCurrent(); });
    this.gizmoManager.gizmos.rotationGizmo.zGizmo.dragBehavior.onDragEndObservable.add(() => { this.endTransformCurrent(); });
    this.gizmoManager.gizmos.scaleGizmo.xGizmo.dragBehavior.onDragEndObservable.add(() => { this.endTransformCurrent(); });
    this.gizmoManager.gizmos.scaleGizmo.yGizmo.dragBehavior.onDragEndObservable.add(() => { this.endTransformCurrent(); });
    this.gizmoManager.gizmos.scaleGizmo.zGizmo.dragBehavior.onDragEndObservable.add(() => { this.endTransformCurrent(); });
  }

  getGroundPosition() {
    // Use a predicate to get position on the ground
    this.pickInfo = this.engineServ.getScene().pick(this.engineServ.getScene().pointerX, this.engineServ.getScene().pointerY);
    if (this.pickInfo.hit) {
      return this.pickInfo.pickedPoint;
    }
    return null;
  }

  public onPointerDown = (ev) => {
    if (this.lockGizmoTransform) return;
    if (ev.button !== 0) return;

    // check if we are under a mesh
    this.pickInfo = this.engineServ.getScene().pick(this.engineServ.getScene().pointerX, this.engineServ.getScene().pointerY);
    if (this.pickInfo.hit) {
      let plugGeometry = <PlugGeometry>this.pickInfo.pickedMesh;

      let container = this.appServ.getContainerFromPlugGeometry(
        plugGeometry.id.includes("glyph") ?
          <PlugText>(this.pickInfo.pickedMesh.parent) :
          plugGeometry
      );

      if (container.locked) return;

      this.setSelected(container);
      this.startingPoint = this.getGroundPosition();
      this.store.dispatch(oneSelection({
        uuid: this.appServ.getContainerFromPlugGeometry(
          plugGeometry.id.includes("glyph") ?
            <PlugText>(this.pickInfo.pickedMesh.parent) :
            plugGeometry
        ).uuid
      }));
      if (this.startingPoint) { // we need to disconnect camera from canvas
        setTimeout(() => {
          this.engineServ.getCamera().detachControl(this.rendererCanvas.nativeElement);
        }, 0);
      }
    } else {
      this.store.dispatch(clearSelection());
    }
  }

  public onPointerUp = () => {
    if (this.startingPoint) {
      this.startingPoint = null;
      return;
    }
  }

  public onPointerMove = () => {
    let plugGeometry;
    this.store.pipe(select('engine'), take(1))
      .subscribe(s => plugGeometry = this.appServ.getContainerFromUuid(s.uuidCsSelected[0]).getPlugGeometry());
    if (!this.startingPoint) return;
    var current = this.getGroundPosition();
    if (!current) return;

    var diff = current.subtract(this.startingPoint);
    if (plugGeometry instanceof Mesh) plugGeometry.position.addInPlace(diff);

    this.startingPoint = current;
  }

  setSelected(c: Container) {
    this.gizmoManager.attachToNode(c.getPlugTransform());
    c.getPlugTransform().axis.setVisible(true);

    if (c.getPlugLight() != undefined) {
      this.lightGizmo.light = <any>(c.getPlugLight());
      return;
    }

    // if (c.getPlugGeometry() instanceof PlugText) ViewportComponent.setBoundingBoxText(<PlugText>c.getPlugGeometry());

    /** Plug Geometry */
    Container.getChildren(c).map(c => c.getPlugGeometry())
      .filter(plugGeometry => !plugGeometry?.name.startsWith("glyph-inst"))
      .forEach((pg: PlugGeometry) => {
        if (pg == undefined) return;
        pg.showBoundingBox = true
      });

    if (c.getPlugGeometry() == undefined) return;
    c.getPlugGeometry().showBoundingBox = true;

    let bbSelected = c.getPlugGeometry().getBoundingInfo().boundingBox

    let bbr = this.engineServ.getScene().getBoundingBoxRenderer();
    bbr.onBeforeBoxRenderingObservable.add((bb: BoundingBox) => {
      bbr.frontColor = bbr.backColor = bb == bbSelected ? new Color3(.3, .6, .85) : new Color3(.9, .9, .9);
    })

  }

  static setBoundingBoxText(pt: PlugText) {
    if (!Utils.isEmptyArr(pt.getChildMeshes())) {
      pt.setBoundingInfo(ViewportComponent.boundingInfoFromMeshesChildren(pt.getChildren()));
    }
    pt.showBoundingBox = true;
    pt.refreshBoundingInfo();
  }

  static boundingInfoFromMeshesChildren(meshes) {
    let boundingInfo = meshes[0].getBoundingInfo();
    let min = boundingInfo.minimum.add(meshes[0].position);
    let max = boundingInfo.maximum.add(meshes[0].position);
    for (let i = 0; i < meshes.length; i++) {
      boundingInfo = meshes[i].getBoundingInfo();
      min = BABYLON.Vector3.Minimize(min, boundingInfo.minimum.add(meshes[i].position));
      max = BABYLON.Vector3.Maximize(max, boundingInfo.maximum.add(meshes[i].position));
      meshes[i].refreshBoundingInfo()
    }
    return new BoundingInfo(min, max);
  }

  clearHighLightSelected(container: Container) {
    Container.getChildren(container).map(c => c.getPlugGeometry())
      .filter(m => !m?.name.startsWith("glyph-inst"))
      .forEach((pg: PlugGeometry) => {
        if (pg == undefined) return
        pg.showBoundingBox = false;
      });

    container.getPlugTransform().axis.setVisible(false);
    if (container.getPlugGeometry() == undefined) return;
    container.getPlugGeometry().showBoundingBox = false;
  }
}