import { ArcRotateCamera, Color3, DirectionalLight, HemisphericLight, Light, Mesh, MeshBuilder, PointLight, Scene, SpotLight, StandardMaterial, Vector3, VertexData } from 'babylonjs';
import { CAMERA, GEOM, LIGHT } from 'src/app/configuration/AppConstants';
import { EngineService } from 'src/app/services/engine.service';
import { BoxPanel, CapsulePanel, CylinderPanel, DiscPanel, GeometryPanel, IcoSpherePanel, PlanePanel, PolyhedronPanel, SpherePanel, TorusPanel } from '../../models/panels/GeometryPanels.model';
import { Container } from '../common/Container';
import { FontType } from '../Text/FontType';
import { TextType } from '../Text/TextType';

export class PlugBuilder {

  constructor() { }

  static createContainerMesh(type: string, scene: Scene): Container {
    let options = {};
    let container: Container;
    let gp: GeometryPanel;
    let mesh: Mesh;
    switch (type) {
      case GEOM.GROUP:
        container = new Container(new Mesh("Group", scene));
        container.panel = null;
        break;
      case GEOM.BOX:
        gp = new BoxPanel();
        mesh = MeshBuilder.CreateBox("box", (<BoxPanel>gp).values, scene);
        container = new Container(mesh);
        container.panel = gp;
        container.rebuildMesh = VertexData.CreateBox;
        break;
      case GEOM.CYLINDER:
        gp = new CylinderPanel();
        mesh = MeshBuilder.CreateCylinder("Cylinder", (<CylinderPanel>gp).values, scene);
        container = new Container(mesh);
        container.panel = gp;
        container.rebuildMesh = VertexData.CreateCylinder;
        break;
      case GEOM.DISC:
        gp = new DiscPanel();
        mesh = MeshBuilder.CreateDisc("Disc", (<DiscPanel>gp).values, scene);
        container = new Container(mesh);
        container.panel = gp;
        container.rebuildMesh = VertexData.CreateDisc;
        break;
      case GEOM.ICOSPHERE:
        gp = new IcoSpherePanel();
        mesh = MeshBuilder.CreateIcoSphere("IcoSphere", (<IcoSpherePanel>gp).values, scene);
        container = new Container(mesh);
        container.panel = gp;
        container.rebuildMesh = VertexData.CreateIcoSphere;
        break;
      case GEOM.PLANE:
        gp = new PlanePanel();
        mesh = MeshBuilder.CreatePlane("Plane", (<PlanePanel>gp).values, scene);
        container = new Container(mesh);
        container.panel = gp;
        container.rebuildMesh = VertexData.CreatePlane;
        break;
      case GEOM.POLYHEDRON:
        gp = new PolyhedronPanel();
        mesh = MeshBuilder.CreatePolyhedron("Polyhedron", (<PolyhedronPanel>gp).values, scene);
        container = new Container(mesh);
        container.panel = gp;
        container.rebuildMesh = VertexData.CreatePolyhedron;
        break;
      case GEOM.TORUS:
        gp = new TorusPanel();
        mesh = MeshBuilder.CreateTorus("Torus", (<TorusPanel>gp).values, scene);
        container = new Container(mesh);
        container.panel = gp;
        container.rebuildMesh = VertexData.CreateTorus;
        break;
      case GEOM.CAPSULE:
        gp = new CapsulePanel();
        mesh = MeshBuilder.CreateCapsule("Capsule", (<CapsulePanel>gp).values, scene);
        container = new Container(mesh);
        container.panel = gp;
        container.rebuildMesh = VertexData.CreateCapsule;
        break;
      case GEOM.SPHERE:
        gp = new SpherePanel();
        mesh = MeshBuilder.CreateSphere("Sphere", (<SpherePanel>gp).values, scene);
        container = new Container(mesh);
        container.panel = gp;
        container.rebuildMesh = VertexData.CreateSphere;
        break;
    }

    // Default material
    if (type != "GROUP") {
      let mat: StandardMaterial = new StandardMaterial("material", scene);
      mat.diffuseColor = new Color3(.75, .75, .75);
      (<Mesh>container.type).material = mat;
    }
    return container;
  }

  static createLight(type: string, scene: Scene): Light {
    switch (type) {
      case LIGHT.DIRECTIONAL:
        return new DirectionalLight("DirectionalLight", new Vector3(1, 1, 1), scene);
      case LIGHT.SPOT:
        return new SpotLight("SpotLight", new Vector3(100, 100, 100), new Vector3(-1, -1, 1), 20, 1, scene);
      case LIGHT.POINT:
        return new PointLight("PointLight", new Vector3(0, 0, 0), scene);
      case LIGHT.HEMISPHERIC:
        return new HemisphericLight("HemisphericLight", new Vector3(0, 0, 0), scene);
    }
  }

  static createCamera(type: string, s: Scene) {
    switch (type) {
      case CAMERA.ARCROTATECAMERA:
        let camera = new ArcRotateCamera("Camera", 0, 0, 100, new Vector3(0, 0, 0), s);
        camera.position = new Vector3(0, 0, -500);
        camera.setTarget(Vector3.Zero());
        camera.panningSensibility = 100;
        return camera;
    }
  }

  static async createNewGeometryText(engineServ: EngineService) {
    let font = new FontType();
    font.load("assets/font/Ubuntu-L.ttf", engineServ.getScene(), (font: FontType) => {
      let mesh = new Mesh("text", engineServ.getScene());
      let mat: StandardMaterial = new StandardMaterial("material", engineServ.getScene());
      mat.diffuseColor = new Color3(.0, .75, .75);
      mesh.material = mat;

      let text: TextType = new TextType(font, "Text", mesh);
      let c: Container = new Container(mesh);
      c.isText = true;
      c.text = text;
      c.panel = null;
      console.log(c)

      engineServ.typeToContainer.set(c.type, c);
      engineServ.UUIDToContainer.set(c.UUID, c);
      engineServ.saveContainerToDataTree(c);
    });
  }
}