// https://doc.babylonjs.com/extensions/grid
import { Mesh, Scene } from 'babylonjs';
import { GridMaterial } from 'babylonjs-materials';

export class Grid {

    public ground: Mesh

    constructor(scene: Scene) {
        this.build(scene);
    }

    public build(scene: Scene) {
        this.ground = Mesh.CreateGround("ground", 200, 200, 2, scene);
        var grid = new GridMaterial("grid", scene);
        grid.majorUnitFrequency = 10;
        grid.minorUnitVisibility = .5;

        grid.gridRatio = 2;
        grid.backFaceCulling = false;
        grid.mainColor = new BABYLON.Color3(0, 0, 0);
        grid.lineColor = new BABYLON.Color3(.1, .1, .1);
        grid.opacity = .99;
        this.ground.material = grid;
        grid.alphaMode = 10;
        this.ground.isPickable = false;
    }
}