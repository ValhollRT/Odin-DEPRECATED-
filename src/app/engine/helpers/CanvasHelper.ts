import { HighlightLayer, Node, Light, LightGizmo, Mesh, PickingInfo, Scene, TargetCamera, ShadowLight, GizmoManager } from 'babylonjs';
import { BehaviorSubject } from 'rxjs';

export class CanvasHelper {

    private pickInfo: PickingInfo;
    private startingPoint: any;

    private static current: Mesh | Light;
    private static gizmoManager: GizmoManager;
    private static currentMeshSelected$: BehaviorSubject<Mesh> = new BehaviorSubject(undefined);
    private static currentLightSelected$: BehaviorSubject<Light> = new BehaviorSubject(undefined);
    private static highLight: HighlightLayer;
    public static lightGizmo: LightGizmo;

    constructor(
        public canvas: HTMLCanvasElement,
        public scene: Scene,
        public camera: TargetCamera) {
        //LightGizmo
        CanvasHelper.lightGizmo = new LightGizmo();

        // hightlight selected mesh    
        CanvasHelper.highLight = new HighlightLayer("highLight", scene);
        CanvasHelper.highLight.outerGlow = true;
        CanvasHelper.highLight.blurHorizontalSize = 0;
        CanvasHelper.highLight.blurVerticalSize = 0;
        CanvasHelper.highLight.innerGlow = false;

        // Initialize GizmoManager
        CanvasHelper.gizmoManager = new GizmoManager(scene)
        CanvasHelper.gizmoManager.boundingBoxGizmoEnabled = true
        CanvasHelper.gizmoManager.clearGizmoOnEmptyPointerEvent = true;
        
        //Trick to keep gizmo selected while orbiting viewport
        CanvasHelper.gizmoManager.usePointerToAttachGizmos = false;

        this.canvas.addEventListener("pointerdown", this.onPointerDown, false);
        this.canvas.addEventListener("pointerup", this.onPointerUp, false);
        // this.canvas.addEventListener("pointermove", this.onPointerMove, false);

        this.scene.onDispose = () => {
            this.canvas.removeEventListener("pointerdown", this.onPointerDown);
            this.canvas.removeEventListener("pointerup", this.onPointerUp);
            // this.canvas.removeEventListener("pointermove", this.onPointerMove);
        }
        this.canvas.onkeydown = (e) => {
            if (e.key == 'w') {
                CanvasHelper.gizmoManager.positionGizmoEnabled = !CanvasHelper.gizmoManager.positionGizmoEnabled
                CanvasHelper.gizmoManager.rotationGizmoEnabled = false;
                CanvasHelper.gizmoManager.scaleGizmoEnabled = false;
                CanvasHelper.gizmoManager.boundingBoxGizmoEnabled = false;
            }
            if (e.key == 'e') {
                CanvasHelper.gizmoManager.positionGizmoEnabled = false;
                CanvasHelper.gizmoManager.rotationGizmoEnabled = !CanvasHelper.gizmoManager.rotationGizmoEnabled
                CanvasHelper.gizmoManager.scaleGizmoEnabled = false;
                CanvasHelper.gizmoManager.boundingBoxGizmoEnabled = false;
            }
            if (e.key == 'r') {
                CanvasHelper.gizmoManager.positionGizmoEnabled = false;
                CanvasHelper.gizmoManager.rotationGizmoEnabled = false;
                CanvasHelper.gizmoManager.scaleGizmoEnabled = !CanvasHelper.gizmoManager.scaleGizmoEnabled
                CanvasHelper.gizmoManager.boundingBoxGizmoEnabled = false;
            }
            if (e.key == 'q') {
                CanvasHelper.gizmoManager.positionGizmoEnabled = false;
                CanvasHelper.gizmoManager.rotationGizmoEnabled = false;
                CanvasHelper.gizmoManager.scaleGizmoEnabled = false;
            }
            if (e.key == 't') {
                CanvasHelper.gizmoManager.gizmos.positionGizmo.updateGizmoPositionToMatchAttachedMesh = !CanvasHelper.gizmoManager.gizmos.positionGizmo.updateGizmoPositionToMatchAttachedMesh;
                CanvasHelper.gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = !CanvasHelper.gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh;
                CanvasHelper.gizmoManager.gizmos.positionGizmo.updateScale = true;
            }
        }

        this.initializeGizmo();
    }

    initializeGizmo() {
        CanvasHelper.gizmoManager.positionGizmoEnabled = true;
        CanvasHelper.gizmoManager.rotationGizmoEnabled = true;
        CanvasHelper.gizmoManager.scaleGizmoEnabled = true;
        CanvasHelper.gizmoManager.boundingBoxGizmoEnabled = true;
        CanvasHelper.gizmoManager.positionGizmoEnabled = false;
        CanvasHelper.gizmoManager.rotationGizmoEnabled = false;
        CanvasHelper.gizmoManager.scaleGizmoEnabled = false;
        CanvasHelper.gizmoManager.boundingBoxGizmoEnabled = false;
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
        CanvasHelper.clearHighLightSelectedMesh();
        // check if we are under a mesh
        this.pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
        if (this.pickInfo.hit) {
            CanvasHelper.setSelected(<Mesh | Light>this.pickInfo.pickedMesh);
            this.startingPoint = this.getGroundPosition();
            if (this.startingPoint) { // we need to disconnect camera from canvas
                setTimeout(() => {
                    this.camera.detachControl(this.canvas);
                }, 0);
            }
            this.getCurrentMeshTransformation();
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
        if (CanvasHelper.current instanceof Mesh) CanvasHelper.current.position.addInPlace(diff);
        if (CanvasHelper.current instanceof Light) (<ShadowLight>CanvasHelper.current).position.addInPlace(diff);
        this.startingPoint = current;
    }

    // return currentMesh
    static getCurrentMeshSelected(): BehaviorSubject<Mesh> {
        return CanvasHelper.currentMeshSelected$;
    }

    // return currentMesh
    static getCurrentLightSelected(): BehaviorSubject<Light> {
        return CanvasHelper.currentLightSelected$;
    }

    updateTransformCurrent() {
        if (CanvasHelper.current !== null) {
            CanvasHelper.setSelected(CanvasHelper.current, true);
        }
    }

    public getCurrentMeshTransformation() {
        CanvasHelper.gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        CanvasHelper.gizmoManager.gizmos.positionGizmo.yGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        CanvasHelper.gizmoManager.gizmos.positionGizmo.zGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        CanvasHelper.gizmoManager.gizmos.rotationGizmo.xGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        CanvasHelper.gizmoManager.gizmos.rotationGizmo.yGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        CanvasHelper.gizmoManager.gizmos.rotationGizmo.zGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        CanvasHelper.gizmoManager.gizmos.scaleGizmo.xGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        CanvasHelper.gizmoManager.gizmos.scaleGizmo.yGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
        CanvasHelper.gizmoManager.gizmos.scaleGizmo.zGizmo.dragBehavior.onDragObservable.add(() => { this.updateTransformCurrent(); });
    }

    static setSelected(o: Mesh | Light, emit: boolean = true) {
        this.clearHighLightSelectedMesh();
        CanvasHelper.current = o;

        if (o instanceof Mesh) {
            CanvasHelper.gizmoManager.attachToMesh(o);
            CanvasHelper.highLight.addMesh(o, BABYLON.Color3.Yellow());
            if (emit) CanvasHelper.getCurrentMeshSelected().next(o);
        } else {
            CanvasHelper.lightGizmo.light = o;
            //CanvasHelper.gizmoManager.attachToMesh(CanvasHelper.lightGizmo.attachedMesh);
            if (emit) CanvasHelper.getCurrentLightSelected().next(o);
        }
    }

    static clearHighLightSelectedMesh() {
        CanvasHelper.highLight.removeAllMeshes();
    }

}