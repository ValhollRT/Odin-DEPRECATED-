import { Scene, TargetCamera } from 'babylonjs';

export class CanvasHelper {

    private currentMesh: any;
    private pickInfo: any;
    private startingPoint: any;

    constructor(
        public canvas: HTMLCanvasElement,
        public scene: Scene,
        public camera: TargetCamera) {

        this.canvas.addEventListener("pointerdown", this.onPointerDown, false);
        this.canvas.addEventListener("pointerup", this.onPointerUp, false);
        this.canvas.addEventListener("pointermove", this.onPointerMove, false);

        this.scene.onDispose = () => {
            this.canvas.removeEventListener("pointerdown", this.onPointerDown);
            this.canvas.removeEventListener("pointerup", this.onPointerUp);
            this.canvas.removeEventListener("pointermove", this.onPointerMove);
        }
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
        // check if we are under a mesh
        this.pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
        if (this.pickInfo.hit) {
            this.currentMesh = this.pickInfo.pickedMesh;
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