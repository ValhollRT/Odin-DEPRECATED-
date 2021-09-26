import { Mesh, VertexData } from 'babylonjs';
import { EngineService } from 'src/app/services/index.service';
import { Container } from 'src/app/shared/container/container';
import { AppModule } from '../../app.module';
import { GEOM } from '../../configuration/app-constants';
import {
  SidebarPanel,
  SidebarPanelAction,
} from '../../models/menuActions/SidebarPanelAction.model';
import {
  BoxPanel,
  CapsulePanel,
  CylinderPanel,
  DiscPanel,
  GeometryPanel,
  IcoSpherePanel,
  PlanePanel,
  PolyhedronPanel,
  SpherePanel,
  TorusPanel,
} from '../../models/panels/GeometryPanels.model';
import { Utils } from '../Utils/Utils';
import { Plug } from './plug';

export class PlugGeometry extends Mesh implements Plug {
  public uuid: string;
  containerUuid: string;
  enable: boolean;
  icon: string = 'icon-geometry';
  title: string;
  colorTile: string = '';
  isSelected: boolean = false;
  geomType: string;

  getIcon() {
    return this.icon;
  }
  openPanel: () => SidebarPanelAction;
  panel: GeometryPanel;
  public rebuildMesh: (options: any) => VertexData;
  public lock: (lock: boolean) => void;
  public hide: (hide: boolean) => void;

  constructor(
    container: Container,
    geomType?: string,
    uuid?: string,
    panelValues?: GeometryPanel
  ) {
    super(
      uuid == undefined ? Utils.generatorUuid() : uuid,
      AppModule.injector.get(EngineService).getScene()
    );
    this.uuid = this.name;
    this.setEnabled(!container.hidden);

    if (panelValues != undefined) {
      this.geomType = geomType;
      this.getDefaultGeometryData(geomType);
      this.getDefaultPanel(geomType, panelValues);
      this.rebuildMesh(panelValues).applyToMesh(this, true);
    } else {
      this.geomType = geomType;
      this.getDefaultGeometryData(geomType);
      this.getDefaultPanel(geomType);
      this.rebuildMesh(this.panel.values).applyToMesh(this, true);
    }

    this.parent = container.getPlugTransform();
    this.containerUuid = container.uuid;
    this.openPanel = () => {
      return new SidebarPanelAction(SidebarPanel.GEOMETRY, true);
    };
    this.enable = false;

    let material = container.getPlugMaterial();
    if (material == undefined) return;
    this.material = material;

    this.isSelected = false;
  }

  copy(parent: Container): PlugGeometry {
    return new PlugGeometry(parent, this.geomType, Utils.generatorUuid(), {
      ...this.panel.values,
    });
  }

  private getDefaultGeometryData(geomType: String) {
    switch (geomType) {
      case GEOM.BOX:
        this.rebuildMesh = VertexData.CreateBox;
        break;
      case GEOM.CYLINDER:
        this.rebuildMesh = VertexData.CreateCylinder;
        break;
      case GEOM.DISC:
        this.rebuildMesh = VertexData.CreateDisc;
        break;
      case GEOM.ICOSPHERE:
        this.rebuildMesh = VertexData.CreateIcoSphere;
        break;
      case GEOM.PLANE:
        this.rebuildMesh = VertexData.CreatePlane;
        break;
      case GEOM.POLYHEDRON:
        this.rebuildMesh = VertexData.CreatePolyhedron;
        break;
      case GEOM.TORUS:
        this.rebuildMesh = VertexData.CreateTorus;
        break;
      case GEOM.CAPSULE:
        this.rebuildMesh = VertexData.CreateCapsule;
        break;
      case GEOM.SPHERE:
        this.rebuildMesh = VertexData.CreateSphere;
        break;
    }
  }

  private getDefaultPanel(geomType: String, values?: any) {
    switch (geomType) {
      case GEOM.BOX:
        this.panel = new BoxPanel();
        break;
      case GEOM.CYLINDER:
        this.panel = new CylinderPanel();
        break;
      case GEOM.DISC:
        this.panel = new DiscPanel();
        break;
      case GEOM.ICOSPHERE:
        this.panel = new IcoSpherePanel();
        break;
      case GEOM.PLANE:
        this.panel = new PlanePanel();
        break;
      case GEOM.POLYHEDRON:
        this.panel = new PolyhedronPanel();
        break;
      case GEOM.TORUS:
        this.panel = new TorusPanel();
        break;
      case GEOM.CAPSULE:
        this.panel = new CapsulePanel();
        break;
      case GEOM.SPHERE:
        this.panel = new SpherePanel();
        break;
    }
    if (!!values) this.panel.values = values;
  }
}
