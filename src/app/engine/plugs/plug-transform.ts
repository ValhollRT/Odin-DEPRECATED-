import { TransformNode, Vector3 } from "babylonjs";
import { AppModule } from "src/app/app.module";
import { EngineService } from 'src/app/services/index.service';
import { Utils } from "../Utils/Utils";
import { SidebarPanel, SidebarPanelAction } from '../../models/menuActions/SidebarPanelAction.model';
import { Plug } from './plug';


export class PlugTransform extends TransformNode implements Plug {


    uuid: string;
    enable: boolean;
    icon: string = 'icon-axis';
    title: string = 'Transform';
    colorTile: string;
    panel: any;
    openPanel: () => SidebarPanelAction;
    copy: () => Plug;

    constructor(uuid?: string) {
        super(uuid == undefined ? Utils.generatorUuid() : uuid,
            AppModule.injector.get(EngineService).getScene());
        this.uuid = this.name;
        this.openPanel = () => { return new SidebarPanelAction(SidebarPanel.TRANSFORMATION, true) }
    }

    getIcon() { return this.icon }

    getPosition(): Vector3 { return this.position }
    getRotationInRadians(): Vector3 { return this.rotation }
    getScale(): Vector3 { return this.scaling }

    setPosition(): void { this.position }
    setRotationInRadians(): void { this.rotation }
    setScale(): void { this.scaling }

}