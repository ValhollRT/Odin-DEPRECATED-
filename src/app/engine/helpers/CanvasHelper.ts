import { Scene, TargetCamera, GizmoManager, HighlightLayer } from 'babylonjs';

export class CanvasHelper {

    private currentMesh: any;
    private pickInfo: any;
    private startingPoint: any;
    public gizmoManager: GizmoManager;
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

}