import { Color3, StandardMaterial } from "babylonjs";
import { EngineService } from 'src/app/services/engine.service';
import { Container } from 'src/app/shared/container/container';
import { Utils } from "../Utils/Utils";
import { AppModule } from './../../app.module';
import { SidebarPanel, SidebarPanelAction } from './../../models/menuActions/SidebarPanelAction.model';
import { Plug } from './plug';


export class PlugMaterial extends StandardMaterial implements Plug {

    uuid: string;
    enable: boolean;
    icon: string = 'icon-material';
    title: string = 'Material';
    colorTile: string;
    panel: any;
    openPanel: () => SidebarPanelAction;
    copy: () => Plug;

    constructor(container: Container, uuid?: string) {
        super(uuid == undefined ? Utils.generatorUuid() : uuid,
            AppModule.injector.get(EngineService).getScene());
        this.uuid = this.name;

        this.openPanel = () => { return new SidebarPanelAction(SidebarPanel.MATERIAL, true) }
        let geometry = container.getPlugGeometry()
        if (geometry == undefined) return;
        geometry.material = this;
        this.diffuseColor = new Color3(1, 1, 1);
    }

    getIcon() { return this.icon }
}