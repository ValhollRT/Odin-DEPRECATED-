import { Utils } from '../Utils/Utils';
import { Material, Mesh, Scene, MeshBuilder } from 'babylonjs';
import { GEOM } from 'src/app/configuration/appConstants';


export class Container {
    public UID: Number;
    public date: Number;
    public mesh: Mesh;
    public material: Material;

    constructor(private _uid?: Number, private _date?: Number) {
        if (!_date) _date = Date.now();
        if (!_uid) _uid = Utils.generateUID(_date.toString());
        this.UID = _uid;
        this.date = _date;
    }

    createGeometry(type: string, scene: Scene): Container {
        this.mesh = this.setMesh(type, scene);
        return this;
    }

    setMesh(type: String, s: Scene, options?: any): Mesh {
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