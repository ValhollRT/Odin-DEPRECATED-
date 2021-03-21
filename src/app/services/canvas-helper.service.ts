import { Utils } from './../engine/Utils/Utils';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Light, LightGizmo, Mesh, PickingInfo, ShadowLight, GizmoManager, Vector3, BoundingInfo, Color3 } from 'babylonjs';
import { take } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { EngineService } from '../engine/engine.service';
import { clearSelection, oneSelection } from '../engine/engine.action';
import { Container } from '../engine/common/Container';
import { BoundingBox } from 'babylonjs/Culling/boundingBox';

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
        canvas.addEventListener("onmouseenter", this.onPointerDown, false);

        es.getScene().onDispose = () => {
            canvas.removeEventListener("pointerdown", this.onPointerDown);
            canvas.removeEventListener("pointerup", this.onPointerUp);
            canvas.removeEventListener("onmouseenter", this.onPointerDown, false);
            // this.canvas.removeEventListener("pointermove", this.onPointerMove);
        }

        store.select('engine').subscribe(en => {
            if (en.prevUUIDCsSelected.length > 0) {
                this.clearHighLightSelected(<Mesh>this.es.UUIDToContainer.get(en.prevUUIDCsSelected[0]).type);
            }
            if (en.UUIDCsSelected.length > 0) {
                let container = this.es.UUIDToContainer.get(en.UUIDCsSelected[0]);
                if (container.locked) return
                this.setSelected(container);
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
            if (mesh.id.includes("glyph")) mesh = <Mesh | Light>this.pickInfo.pickedMesh.parent;
            let container = this.es.getContainerFromType(mesh);
            if (container.locked) return;
            this.setSelected(container);
            this.startingPoint = this.getGroundPosition();
            this.store.dispatch(oneSelection({ UUID: this.es.getContainerFromType(mesh).UUID }));
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

    setSelected(c: Container) {
        if (c.type instanceof Mesh) {
            this.gizmoManager.attachToMesh(c.type);
            if (c.isText) {
                this.setBoundingBoxText(c.type);
            } else {
                c.type.getChildMeshes().filter(m => !m.name.startsWith("glyph-inst")).forEach((m: Mesh) => m.showBoundingBox = true);
                c.type.showBoundingBox = true;

                let bbr = this.es.getScene().getBoundingBoxRenderer();
                bbr.onBeforeBoxRenderingObservable.add((bb: BoundingBox) => {
                    bbr.frontColor = bb == this.es.UUIDToBoundingBox.get(c.UUID)
                        ? new Color3(.3, .6, .85) : new Color3(.9, .9, .9);
                })
            }
        } else {
            this.lightGizmo.light = c.type;
        }
    }

    setBoundingBoxText(m: Mesh) {
        if (!Utils.isEmptyArr(m.getChildMeshes())) m.setBoundingInfo(this.boundingInfoFromMeshesChildren(m.getChildren()));
        m.showBoundingBox = true;
        m.refreshBoundingInfo();
    }

    boundingInfoFromMeshesChildren(meshes) {
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

    clearHighLightSelected(o: Mesh | Light) {
        if (o instanceof Mesh) {
            o.getChildMeshes().forEach((m: Mesh) => m.showBoundingBox = false);
            o.showBoundingBox = false;
        }
    }
}