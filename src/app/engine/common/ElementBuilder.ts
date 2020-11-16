
import { Color3, DirectionalLight, HemisphericLight, Light, Mesh, MeshBuilder, PointLight, Scene, SpotLight, StandardMaterial, Vector3, VertexData } from "babylonjs";
import { GEOM, LIGHT } from 'src/app/configuration/AppConstants';
import { BoxPanel, CapsulePanel, CylinderPanel, DiscPanel, GeometryPanel, IcoSpherePanel, PlanePanel, PolyhedronPanel, SpherePanel, TorusPanel } from 'src/app/models/geometry/geometry-panels';
import { Container } from "./Container";

export class ElementBuilder {

    constructor() { }

    static createContainerMesh(type: string, s: Scene): Container {
        let options = {};
        let container;
        let gp: GeometryPanel;
        let mesh;
        switch (type) {
            case GEOM.BOX:
                gp = new BoxPanel();
                mesh = MeshBuilder.CreateBox("box", (<BoxPanel>gp).values, s);
                container = new Container(mesh);
                container.panel = gp;
                container.rebuildMesh = VertexData.CreateBox;
                break;
            case GEOM.CYLINDER:
                gp = new CylinderPanel();
                mesh = MeshBuilder.CreateCylinder("Cylinder", (<CylinderPanel>gp).values, s);
                container = new Container(mesh);
                container.panel = gp;
                container.rebuildMesh = VertexData.CreateCylinder;
                break;
            case GEOM.DISC:
                gp = new DiscPanel();
                mesh = MeshBuilder.CreateDisc("Disc", (<DiscPanel>gp).values, s);
                container = new Container(mesh);
                container.panel = gp;
                container.rebuildMesh = VertexData.CreateDisc;
                break;
            case GEOM.ICOSPHERE:
                gp = new IcoSpherePanel();
                mesh = MeshBuilder.CreateIcoSphere("IcoSphere", (<IcoSpherePanel>gp).values, s);
                container = new Container(mesh);
                container.panel = gp;
                container.rebuildMesh = VertexData.CreateIcoSphere;
                break;
            case GEOM.PLANE:
                gp = new PlanePanel();
                mesh = MeshBuilder.CreatePlane("Plane", (<PlanePanel>gp).values, s);
                container = new Container(mesh);
                container.panel = gp;
                container.rebuildMesh = VertexData.CreatePlane;
                break;
            case GEOM.POLYHEDRON:
                gp = new PolyhedronPanel();
                mesh = MeshBuilder.CreatePolyhedron("Polyhedron", (<PolyhedronPanel>gp).values, s);
                container = new Container(mesh);
                container.panel = gp;
                container.rebuildMesh = VertexData.CreatePolyhedron;
                break;
            case GEOM.TORUS:
                gp = new TorusPanel();
                mesh = MeshBuilder.CreateTorus("Torus", (<TorusPanel>gp).values, s);
                container = new Container(mesh);
                container.panel = gp;
                container.rebuildMesh = VertexData.CreateTorus;
                break;
            case GEOM.CAPSULE:
                gp = new CapsulePanel();
                mesh = MeshBuilder.CreateCapsule("Capsule", (<CapsulePanel>gp).values, s);
                container = new Container(mesh);
                container.panel = gp;
                container.rebuildMesh = VertexData.CreateCapsule;
                break;
            case GEOM.SPHERE:
                gp = new SpherePanel();
                mesh = MeshBuilder.CreateSphere("Sphere", (<SpherePanel>gp).values, s);
                container = new Container(mesh);
                container.panel = gp;
                container.rebuildMesh = VertexData.CreateSphere;
                break;
        }
        // Default material
        let mat: StandardMaterial = new StandardMaterial("material", s);
        mat.diffuseColor = new Color3(.75, .75, .75);
        (<Mesh>container.type).material = mat;

        return container;
    }

    static createLight(type: string, scene: Scene) {
        let light = this.setLight(type, scene);
        return light;
    }

    static setLight(type: string, s: Scene, options?: any): Light {
        switch (type) {
            case LIGHT.DIRECTIONAL:
                return new DirectionalLight("DirectionalLight", new Vector3(0, 0, 0), s);
            case LIGHT.SPOT:
                return new SpotLight("SpotLight", Vector3.Zero(), new Vector3(0, -1, 0), 20, 1, s);
            case LIGHT.POINT:
                return new PointLight("PointLight", new Vector3(0, 0, 0), s);
            case LIGHT.HEMISPHERIC:
                return new HemisphericLight("HemisphericLight", new Vector3(0, 0, 0), s);

        }
    }
}