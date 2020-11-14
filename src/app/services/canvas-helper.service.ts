import { Injectable } from '@angular/core';
import { Light, LightGizmo, Mesh, PickingInfo, ShadowLight, GizmoManager } from 'babylonjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { EngineService } from '../engine/engine.service';

@Injectable({ providedIn: 'root' })
export class CanvasHelperService {

    private pickInfo: PickingInfo;
    private startingPoint: any;

    public gizmoManager: GizmoManager;
    public lightGizmo: LightGizmo;

    constructor(public es: EngineService) {
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
        // this.canvas.addEventListener("pointermove", this.onPointerMove, false);

        es.getScene().onDispose = () => {
            canvas.removeEventListener("pointerdown", this.onPointerDown);
            canvas.removeEventListener("pointerup", this.onPointerUp);
            // this.canvas.removeEventListener("pointermove", this.onPointerMove);
        }

        es.getCurrentSelected$()
            .pipe(filter((obj: any) => obj !== null && obj !== undefined), distinctUntilChanged())
            .subscribe((o: any) => { this.setSelected(o); });

        canvas.onkeydown = (e) => {
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
        this.clearHighLightSelectedMesh();
        // check if we are under a mesh
        this.pickInfo = this.es.getScene().pick(this.es.getScene().pointerX, this.es.getScene().pointerY);
        if (this.pickInfo.hit) {
            this.setSelected(<Mesh | Light>this.pickInfo.pickedMesh);
            this.startingPoint = this.getGroundPosition();
            if (this.startingPoint) { // we need to disconnect camera from canvas
                setTimeout(() => {
                    this.es.getCamera().detachControl(this.es.getCanvas());
                }, 0);
            }
        }
    }

    public onPointerUp = () => {
        if (this.startingPoint) {
            this.es.getCamera().attachControl(this.es.getCanvas(), true);
            this.startingPoint = null;
            return;
        }
    }

    public onPointerMove = () => {
        let cs = this.es.getCurrentSelected();
        if (!this.startingPoint) return;
        var current = this.getGroundPosition();
        if (!current) return;

        var diff = current.subtract(this.startingPoint);
        if (cs instanceof Mesh) cs.position.addInPlace(diff);
        if (cs instanceof Light) (<ShadowLight>cs).position.addInPlace(diff);
        this.startingPoint = current;
    }

    setSelected(o: Mesh | Light, emit: boolean = true) {
        this.clearHighLightSelectedMesh();
        this.es.setCurrentSelected(o, emit);

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

    clearHighLightSelectedMesh() {
        let selected = this.es.getCurrentSelected();
        if (selected instanceof Mesh) {
            selected.disableEdgesRendering();
            selected.edgesWidth = 0;
        }

    }

}