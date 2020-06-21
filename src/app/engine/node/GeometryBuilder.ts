import { GEOM } from 'src/app/configuration/appConstants';
import { MeshBuilder, Mesh } from 'babylonjs';
import { Scene } from 'babylonjs/scene';

export class GeometryBuilder {

    constructor() { }

    public static setBuilder(type: String, s: Scene, options?: any): Mesh {
        let geom: Mesh;
        switch (type) {
            case GEOM.BOX:
                geom = MeshBuilder.CreateBox("box", { height: 10, width: 10, depth: 10 }, s);
                break;
            case GEOM.CYLINDER:
                geom = MeshBuilder.CreateCylinder("cylinder", { diameter: 10 }, s);
                break;
            case GEOM.DISC:
                geom = MeshBuilder.CreateDisc("disc", { radius: 20, tessellation: 3 }, s);
                break;
            case GEOM.ICOSPHERE:
                geom = MeshBuilder.CreateIcoSphere("icosphere", {}, s);
                break;
            case GEOM.PLANE:
                geom = MeshBuilder.CreatePlane("plane", { size: 10, width: 10, height: 10 }, s);
                break;
            case GEOM.POLYHEDRON:
                geom = MeshBuilder.CreatePolyhedron("polyhedron", {}, s);
                break;
            case GEOM.TORUS:
                geom = MeshBuilder.CreateTorus("torus", {}, s);
                break;
            case GEOM.TUBE:
                // geom = MeshBuilder.CreateTube("tube", {}, s);
                break;
            case GEOM.RIBBON:
                // geom = MeshBuilder.CreateRibbon("ribbon", { new Vector3()}, s);
                break;
            case GEOM.SPHERE:
                geom = MeshBuilder.CreateSphere("sphere", { diameter: 10 }, s);
                break;
        }
        return geom;
    }

}