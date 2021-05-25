import { Mesh, VertexData } from 'babylonjs';
import { EngineService } from 'src/app/services/index.service';
import { Container } from 'src/app/shared/container/container';
import { AppModule } from '../../app.module';
import { GEOM } from '../../configuration/app-constants';
import { SidebarPanel, SidebarPanelAction } from '../../models/menuActions/SidebarPanelAction.model';
import { BoxPanel, CapsulePanel, CylinderPanel, DiscPanel, GeometryPanel, IcoSpherePanel, PlanePanel, PolyhedronPanel, SpherePanel, TorusPanel } from '../../models/panels/GeometryPanels.model';
import { Utils } from '../Utils/Utils';
import { Plug } from './plug';

export class PlugGeometry extends Mesh implements Plug {

    public uuid: string;
    containerUuid: string;
    enable: boolean;
    icon: string = 'icon-geometry';
    title: string;
    colorTile: string;
    getIcon() { return this.icon }
    openPanel: () => SidebarPanelAction;
    panel: GeometryPanel;
    copy: () => Plug;
    public rebuildMesh: (options: any) => VertexData;
    public lock: (lock: boolean) => void
    public hide: (hide: boolean) => void

    constructor(container: Container, geomType?: string, uuid?: string) {
        super(uuid == undefined ? Utils.generatorUuid() : uuid, AppModule.injector.get(EngineService).getScene());
        this.uuid = this.name;
        this.setEnabled(!container.hidden);
        if (geomType != undefined) {
            this.getDefaultGeometryData(geomType);
            this.rebuildMesh(this.panel.values).applyToMesh(this, true);
        }
        this.parent = container.getPlugTransform();
        this.containerUuid = container.uuid;
        this.openPanel = () => { return new SidebarPanelAction(SidebarPanel.GEOMETRY, true) }

        let material = container.getPlugMaterial();
        if (material == undefined) return;
        this.material = material;
        this.enable = false;
    }

    private getDefaultGeometryData(type: String) {
        switch (type) {
            case GEOM.BOX:
                this.panel = new BoxPanel();
                this.rebuildMesh = VertexData.CreateBox;
                break;
            case GEOM.CYLINDER:
                this.panel = new CylinderPanel();
                this.rebuildMesh = VertexData.CreateCylinder;
                break;
            case GEOM.DISC:
                this.panel = new DiscPanel();
                this.rebuildMesh = VertexData.CreateDisc;
                break;
            case GEOM.ICOSPHERE:
                this.panel = new IcoSpherePanel();
                this.rebuildMesh = VertexData.CreateIcoSphere;
                break;
            case GEOM.PLANE:
                this.panel = new PlanePanel();
                this.rebuildMesh = VertexData.CreatePlane;
                break;
            case GEOM.POLYHEDRON:
                this.panel = new PolyhedronPanel();
                this.rebuildMesh = VertexData.CreatePolyhedron;
                break;
            case GEOM.TORUS:
                this.panel = new TorusPanel();
                this.rebuildMesh = VertexData.CreateTorus;
                break;
            case GEOM.CAPSULE:
                this.panel = new CapsulePanel();
                this.rebuildMesh = VertexData.CreateCapsule;
                break;
            case GEOM.SPHERE:
                this.panel = new SpherePanel();
                this.rebuildMesh = VertexData.CreateSphere;
                break;
        }
    }
}