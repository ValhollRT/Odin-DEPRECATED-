import { Utils } from '../Utils/Utils';
import { Material, Mesh, Scene, MeshBuilder } from 'babylonjs';
import { GEOM } from 'src/app/configuration/AppConstants';
export class Container {
    public UUID: string;
    public name: string;
    public mesh: Mesh;
    public material: Material
    public children: Container[] = [];
    public parent: Container;
    public level: number = 0;
    public expandable: boolean = false;

    constructor() {
        this.UUID = Utils.generatorUUID();
    }

    public setName(name: string): Container {
        this.name = name;
        return this;
    }

    createGeometry(type: string, scene: Scene): Container {
        this.mesh = this.setMesh(type, scene);
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
                // return MeshBuilder.CreateTube("tube", {}, s);
                break;
            case GEOM.RIBBON:
                // return MeshBuilder.CreateRibbon("ribbon", { new Vector3()}, s);
                break;
            case GEOM.SPHERE:
                return MeshBuilder.CreateSphere("sphere", { diameter: 10 }, s);
        }

    }

}