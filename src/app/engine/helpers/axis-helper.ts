import {
    Color3,
    DynamicTexture,
    LinesMesh,
    Mesh,
    Scene,
    StandardMaterial,
    Vector3
} from 'babylonjs';

export class AxisHelper extends Mesh {
    // show axis
    private axisX: LinesMesh;
    private axisY: LinesMesh;
    private axisZ: LinesMesh;

    constructor(size: number, scene: Scene) {
        super("axisWorld", scene);
        this.axisX = Mesh.CreateLines("axisX", [
            Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
            new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
        ], scene);
        this.axisX.color = new Color3(1, 0, 0);
        this.axisY = Mesh.CreateLines("axisY", [
            Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
            new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
        ], scene);
        this.axisY.color = new Color3(0, 1, 0);

        this.axisZ = Mesh.CreateLines("axisZ", [
            Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
            new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
        ], scene);
        this.axisZ.color = new Color3(0, 0, 1);
        this.axisX.isPickable = false;
        this.axisY.isPickable = false;
        this.axisZ.isPickable = false;

        this.axisX.renderingGroupId = 2;
        this.axisY.renderingGroupId = 2;
        this.axisZ.renderingGroupId = 2;

        this.axisX.parent = this;
        this.axisY.parent = this;
        this.axisZ.parent = this;
    }

    makeTextPlane(text, color, size, scene: Scene) {
        let dynamicTexture = new DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
        let plane = Mesh.CreatePlane("TextPlane", size, scene, true);
        let material = new StandardMaterial("TextPlaneMaterial", scene);
        material.backFaceCulling = false;
        material.specularColor = new Color3(0, 0, 0);
        material.diffuseTexture = dynamicTexture;
        plane.material = material;
        return plane;
    };

    setVisible(visible: boolean) {
        this.axisX.isVisible = visible;
        this.axisY.isVisible = visible;
        this.axisZ.isVisible = visible;
    }

}
