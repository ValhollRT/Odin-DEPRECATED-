import { GizmoManager, HighlightLayer, Mesh, Scene, TargetCamera } from 'babylonjs';
import { BehaviorSubject, Observable } from 'rxjs';

export class CanvasHelper {

    private currentMesh: Mesh;
    private pickInfo: any;
    private startingPoint: any;
    public gizmoManager: GizmoManager;
    public currentMesh$: BehaviorSubject<Mesh>;
    public currentMeshRotation$: BehaviorSubject<Mesh>;
    private highLight: HighlightLayer;

    constructor(
        public canvas: HTMLCanvasElement,
        public scene: Scene,
        public camera: TargetCamera,
        private document: Document) {

        // hightlight selected mesh    
        this.highLight = new HighlightLayer("highLight", scene);
        this.highLight.outerGlow = true;
        this.highLight.blurHorizontalSize = 1;
        this.highLight.blurVerticalSize = 1;
        this.highLight.innerGlow = false;

        this.currentMesh$ = new BehaviorSubject(null);
        // Initialize GizmoManager
        this.gizmoManager = new GizmoManager(this.scene)
        this.gizmoManager.boundingBoxGizmoEnabled = true
        this.gizmoManager.clearGizmoOnEmptyPointerEvent = true;

        this.canvas.addEventListener("pointerdown", this.onPointerDown, false);
        this.canvas.addEventListener("pointerup", this.onPointerUp, false);
        // this.canvas.addEventListener("pointermove", this.onPointerMove, false);

        this.scene.onDispose = () => {
            this.canvas.removeEventListener("pointerdown", this.onPointerDown);
            this.canvas.removeEventListener("pointerup", this.onPointerUp);
            // this.canvas.removeEventListener("pointermove", this.onPointerMove);
        }

        this.document.onkeydown = (e) => {
            if (e.key == 'w') {
                this.gizmoManager.positionGizmoEnabled = !this.gizmoManager.positionGizmoEnabled
                this.gizmoManager.rotationGizmoEnabled = false;
                this.gizmoManager.scaleGizmoEnabled = false;
                this.gizmoManager.boundingBoxGizmoEnabled = false;
            }
            if (e.key == 'e') {
                this.gizmoManager.positionGizmoEnabled = false;
                this.gizmoManager.rotationGizmoEnabled = !this.gizmoManager.rotationGizmoEnabled
                this.gizmoManager.scaleGizmoEnabled = false;
                this.gizmoManager.boundingBoxGizmoEnabled = false;
            }
            if (e.key == 'r') {
                this.gizmoManager.positionGizmoEnabled = false;
                this.gizmoManager.rotationGizmoEnabled = false;
                this.gizmoManager.scaleGizmoEnabled = !this.gizmoManager.scaleGizmoEnabled
                this.gizmoManager.boundingBoxGizmoEnabled = false;
            }
            if (e.key == 'q') {
                this.gizmoManager.positionGizmoEnabled = false;
                this.gizmoManager.rotationGizmoEnabled = false;
                this.gizmoManager.scaleGizmoEnabled = false;
                // this.gizmoManager.boundingBoxGizmoEnabled = !this.gizmoManager.boundingBoxGizmoEnabled
            }
            if (e.key == 't') {
                this.gizmoManager.gizmos.positionGizmo.updateGizmoPositionToMatchAttachedMesh = !this.gizmoManager.gizmos.positionGizmo.updateGizmoPositionToMatchAttachedMesh;
                this.gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = !this.gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh;

                this.gizmoManager.gizmos.positionGizmo.updateScale = true;
            }
        }

        this.gizmoManager.boundingBoxGizmoEnabled = false;

    }


    getGroundPosition() {
        // Use a predicate to get position on the ground
        this.pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
        if (this.pickInfo.hit) {
            return this.pickInfo.pickedPoint;
        }
        return null;
    }

    public onPointerDown = (ev) => {
        if (ev.button !== 0) return;
        this.highLight.removeAllMeshes();
        // check if we are under a mesh
        this.pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
        if (this.pickInfo.hit) {

            this.currentMesh = this.pickInfo.pickedMesh;
            this.highLight.addMesh(this.currentMesh, BABYLON.Color3.Yellow());

            this.startingPoint = this.getGroundPosition();
            if (this.startingPoint) { // we need to disconnect camera from canvas
                setTimeout(() => {
                    this.camera.detachControl(this.canvas);
                }, 0);
            }

            this.getCurrentMeshTransformation();
            this.currentMesh$.next(this.currentMesh);
        }
    }

    public onPointerUp = () => {
        if (this.startingPoint) {
            this.camera.attachControl(this.canvas, true);
            this.startingPoint = null;
            return;
        }
    }

    public onPointerMove = () => {
        if (!this.startingPoint) return;

        var current = this.getGroundPosition();
        if (!current) return;

        var diff = current.subtract(this.startingPoint);
        this.currentMesh.position.addInPlace(diff);
        this.startingPoint = current;
    }

    // return currentMesh
    public getCurrentMeshSelected(): Observable<Mesh> {
        return this.currentMesh$;
    }

    sendMesh() {
        if (this.currentMesh !== null)
            this.currentMesh$.next(this.currentMesh);
    }
    public getCurrentMeshTransformation() {
        if (this.gizmoManager === null || this.gizmoManager === undefined) return;
        this.gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.onDragObservable.add(() => {
            this.sendMesh();
        });
        this.gizmoManager.gizmos.positionGizmo.yGizmo.dragBehavior.onDragObservable.add(() => {
            this.sendMesh();
        });
        this.gizmoManager.gizmos.positionGizmo.zGizmo.dragBehavior.onDragObservable.add(() => {
            this.sendMesh();
        });

        this.gizmoManager.gizmos.rotationGizmo.xGizmo.dragBehavior.onDragObservable.add(() => {
            this.sendMesh();
        });
        this.gizmoManager.gizmos.rotationGizmo.yGizmo.dragBehavior.onDragObservable.add(() => {
            this.sendMesh();
        });
        this.gizmoManager.gizmos.rotationGizmo.zGizmo.dragBehavior.onDragObservable.add(() => {
            this.sendMesh();
        });

        this.gizmoManager.gizmos.scaleGizmo.xGizmo.dragBehavior.onDragObservable.add(() => {
            this.sendMesh();
        });
        this.gizmoManager.gizmos.scaleGizmo.yGizmo.dragBehavior.onDragObservable.add(() => {
            this.sendMesh();
        });
        this.gizmoManager.gizmos.scaleGizmo.zGizmo.dragBehavior.onDragObservable.add(() => {
            this.sendMesh();
        });

    }

}