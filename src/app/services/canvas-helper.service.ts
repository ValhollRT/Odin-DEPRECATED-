import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Light, LightGizmo, Mesh, PickingInfo, ShadowLight, GizmoManager, Vector3 } from 'babylonjs';
import { distinctUntilChanged, filter, take } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { EngineService } from '../engine/engine.service';
import { engineReducer, State } from '../engine/engine.reducer';
import { clearSelection, oneSelection } from '../engine/engine.action';

@Injectable({ providedIn: 'root' })
export class CanvasHelperService {

    private pickInfo: PickingInfo;
    private startingPoint: any;

    public gizmoManager: GizmoManager;
    public lightGizmo: LightGizmo;

    constructor(
        public store: Store<AppState>,
        public es: EngineService
    ) {
        let camera = es.getCamera();
        let canvas = es.getCanvas();
        //LightGizmo
        this.lightGizmo = new LightGizmo();

        // Initialize GizmoManager
        this.gizmoManager = new GizmoManager(es.getScene())
        this.gizmoManager.boundingBoxGizmoEnabled = true
        this.gizmoManager.clearGizmoOnEmptyPointerEvent = true;

        //Trick to keep gizmo selected while orbiting viewport
        this.gizmoManager.usePointerToAttachGizmos = false;

        canvas.addEventListener("pointerdown", this.onPointerDown, false);
        canvas.addEventListener("pointerup", this.onPointerUp, false);

        es.getScene().onDispose = () => {
            canvas.removeEventListener("pointerdown", this.onPointerDown);
            canvas.removeEventListener("pointerup", this.onPointerUp);
            // this.canvas.removeEventListener("pointermove", this.onPointerMove);
        }

        store.select('engine').subscribe(en => {
            if (en.prevUUIDCsSelected.length > 0) {
                this.clearHighLightSelected(<Mesh>this.es.UUIDToContainer.get(en.prevUUIDCsSelected[0]).type);
            }
            if (en.UUIDCsSelected.length > 0) {
                let container = this.es.UUIDToContainer.get(en.UUIDCsSelected[0]);
                if (container.locked) return
                this.setSelected(container.type);
            } else {
                this.gizmoManager.positionGizmoEnabled = false;
                this.gizmoManager.rotationGizmoEnabled = false;
                this.gizmoManager.scaleGizmoEnabled = false;
                this.gizmoManager.attachToMesh(null);
            }
        });

        canvas.onkeydown = (e) => {
            this.lock = true;
            /*FIT VIEW*/
            if (e.key == 'f') {
                let obj = this.es.getFirstSelected().type;
                if (!this.es.nothingSelected() && obj instanceof Mesh) {
                    let pMesh = obj.getAbsolutePosition();
                    camera.setTarget(new Vector3(pMesh.x, pMesh.y, pMesh.z));
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
                this.es.getCamera().attachControl(canvas, true, true);
            }
        }

        canvas.onkeyup = (e) => {
            if (e.key == 'Alt') {
                this.lock = false;
                this.es.getCamera().detachControl(this.es.getCanvas());
            }
        }
        this.initializeGizmo();
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
        this.onDragObservableGizmo();
        this.onDragStartObservableGizmo();
        this.onDragEndObservableGizmo();
    }

    public lock: boolean = false;
    updateTransformCurrent() { }
    startTransformCurrent() { this.lock = true; }
    endTransformCurrent() { this.lock = false; }

    public onDragObservableGizmo() {
        this.gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        this.gizmoManager.gizmos.positionGizmo.yGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        this.gizmoManager.gizmos.positionGizmo.zGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        this.gizmoManager.gizmos.rotationGizmo.xGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        this.gizmoManager.gizmos.rotationGizmo.yGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        this.gizmoManager.gizmos.rotationGizmo.zGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        this.gizmoManager.gizmos.scaleGizmo.xGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        this.gizmoManager.gizmos.scaleGizmo.yGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        this.gizmoManager.gizmos.scaleGizmo.zGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
    }

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
        this.pickInfo = this.es.getScene().pick(this.es.getScene().pointerX, this.es.getScene().pointerY);
        if (this.pickInfo.hit) {
            return this.pickInfo.pickedPoint;
        }
        return null;
    }

    public onPointerDown = (ev) => {
        if (this.lock) return;
        if (ev.button !== 0) return;

        // check if we are under a mesh
        this.pickInfo = this.es.getScene().pick(this.es.getScene().pointerX, this.es.getScene().pointerY);
        if (this.pickInfo.hit) {
            let mesh = <Mesh | Light>this.pickInfo.pickedMesh;
            if (this.es.getContainerFromType(mesh).locked) return;
            this.setSelected(mesh);
            this.startingPoint = this.getGroundPosition();
            this.store.dispatch(oneSelection({ UUID: this.es.getContainerFromType(<Mesh>this.pickInfo.pickedMesh).UUID }));
            if (this.startingPoint) { // we need to disconnect camera from canvas
                setTimeout(() => {
                    this.es.getCamera().detachControl(this.es.getCanvas());
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
        let cs;
        this.store.pipe(select('engine'), take(1)).subscribe(s => cs = this.es.getContainerFromUUID(s.UUIDCsSelected[0]).type);
        if (!this.startingPoint) return;
        var current = this.getGroundPosition();
        if (!current) return;

        var diff = current.subtract(this.startingPoint);
        if (cs instanceof Mesh) cs.position.addInPlace(diff);
        if (cs instanceof Light) (<ShadowLight>cs).position.addInPlace(diff);
        this.startingPoint = current;
    }

    setSelected(o: Mesh | Light) {
        if (o instanceof Mesh) {
            this.gizmoManager.attachToMesh(o);
            this.updateEdgedRendering(o);
        } else {
            this.lightGizmo.light = o;
        }
    }

    updateEdgedRendering(m: Mesh) {
        m.enableEdgesRendering();
        m.edgesColor.copyFromFloats(0, 1, .5, 0.5);
        m.edgesWidth = 10;
    }

    clearHighLightSelected(o: Mesh | Light) {
        if (o instanceof Mesh) {
            o.disableEdgesRendering();
            o.edgesWidth = 0;
        }
    }
}