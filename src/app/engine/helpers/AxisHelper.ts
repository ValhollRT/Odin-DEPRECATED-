import {
    Color3,
    DynamicTexture,
    Mesh,
    Scene,
    StandardMaterial,
    Vector3
} from 'babylonjs';

export class AxisHelper extends Mesh {
    // show axis
    constructor(size: number, scene: Scene) {
        super("axisWorld", scene);
        let axisX = Mesh.CreateLines("axisX", [
            Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
            new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
        ], scene);
        axisX.color = new Color3(1, 0, 0);
        let xChar = this.makeTextPlane("X", "red", size / 10, scene);
        xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
        let axisY = Mesh.CreateLines("axisY", [
            Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
            new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
        ], scene);
        axisY.color = new Color3(0, 1, 0);
        let yChar = this.makeTextPlane("Y", "green", size / 10, scene);
        yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
        let axisZ = Mesh.CreateLines("axisZ", [
            Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
            new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
        ], scene);
        axisZ.color = new Color3(0, 0, 1);
        let zChar = this.makeTextPlane("Z", "blue", size / 10, scene);
        zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
        axisX.isPickable = false;
        axisY.isPickable = false;
        axisZ.isPickable = false;
        xChar.isPickable = false;
        yChar.isPickable = false;
        zChar.isPickable = false;
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

}
