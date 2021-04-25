import { HemisphericLight, Vector3 } from "babylonjs";
import { Utils } from 'src/app/engine/Utils/Utils';
import { EngineService } from 'src/app/services/engine.service';
import { Container } from 'src/app/shared/container/container';
import { Plug } from '../plug';
import { AppModule } from './../../../app.module';
import { SidebarPanel, SidebarPanelAction } from './../../../models/menuActions/SidebarPanelAction.model';

export class PlugHemisphericLight extends HemisphericLight implements Plug {

    uuid: string;
    enable: boolean;
    icon: string = 'icon-light';
    title: string = 'Light';
    colorTile: string;
    panel: any;
    openPanel: () => SidebarPanelAction;
    copy: () => Plug;

    constructor(container: Container, uuid?: string) {
        super(uuid == undefined ? Utils.generatorUuid() : uuid, new Vector3(0, 0, 0),
            AppModule.injector.get(EngineService).getScene());
        this.uuid = this.name;

        this.parent = container.getPlugTransform();
        this.openPanel = () => { return new SidebarPanelAction(SidebarPanel.LIGHT, true) }
    }

    getIcon() { return this.icon }
}