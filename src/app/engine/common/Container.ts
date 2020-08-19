import { Utils } from '../Utils/Utils';
import { Mesh, Scene, MeshBuilder, StandardMaterial, Color3, HighlightLayer } from 'babylonjs';
import { GEOM } from 'src/app/configuration/AppConstants';
export class Container {
    public UUID: string;
    public name: string;
    public mesh: Mesh;
    public children: Container[] = [];
    public parent: Container;
    public level: number = 0;
    public expandable: boolean = false;
    public selected: boolean;

    private static highLight: HighlightLayer;

    constructor() {
        this.UUID = Utils.generatorUUID();
        this.selected = false;
    }

    public setName(name: string): Container {
        this.name = name;
        return this;
    }

    createGeometry(type: string, scene: Scene): Container {

        // hightlight selected mesh    
        Container.highLight = new HighlightLayer("highLight", scene);
        Container.highLight.outerGlow = true;
        Container.highLight.blurHorizontalSize = 1;
        Container.highLight.blurVerticalSize = 1;
        Container.highLight.innerGlow = false;

        this.mesh = this.setMesh(type, scene);
        this.setFirstMaterial(scene);
        return this;
    }

    setMesh(type: string, s: Scene, options?: any): Mesh {
        this.name = type;
        switch (type) {
            case GEOM.BOX:
                return MeshBuilder.CreateBox("box", { height: 10, width: 10, depth: 10 }, s);
            case GEOM.CYLINDER:
                return MeshBuilder.CreateCylinder("cylinder", { diameter: 10 }, s);
            case GEOM.DISC:
                return MeshBuilder.CreateDisc("disc", { radius: 20, tessellation: 3 }, s);
            case GEOM.ICOSPHERE:
                return MeshBuilder.CreateIcoSphere("icosphere", {}, s);
            case GEOM.PLANE:
                return MeshBuilder.CreatePlane("plane", { size: 10, width: 10, height: 10 }, s);
            case GEOM.POLYHEDRON:
                return MeshBuilder.CreatePolyhedron("polyhedron", {}, s);
            case GEOM.TORUS:
                return MeshBuilder.CreateTorus("torus", {}, s);
            case GEOM.TUBE:
                break;
            case GEOM.RIBBON:
                break;
            case GEOM.SPHERE:
                return MeshBuilder.CreateSphere("sphere", { diameter: 10 }, s);
        }
    }

    setFirstMaterial(scene: Scene): Container {
        let mat: StandardMaterial = new StandardMaterial("material", scene);
        this.mesh.material = mat;
        mat.diffuseColor = new Color3(.75, .75, .75);
        return this;
    }
}