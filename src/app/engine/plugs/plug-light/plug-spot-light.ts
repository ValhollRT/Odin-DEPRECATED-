import { SpotLight, Vector3 } from "babylonjs";
import { AppModule } from 'src/app/app.module';
import { Utils } from 'src/app/engine/Utils/Utils';
import { EngineService } from 'src/app/services/engine.service';
import { Container } from 'src/app/shared/container/container';
import { Plug } from '../plug';
import { SidebarPanel, SidebarPanelAction } from './../../../models/menuActions/SidebarPanelAction.model';

export class PlugSpotLight extends SpotLight implements Plug {

  uuid: string;
  enable: boolean;
  icon: string = 'icon-light';
  title: string = 'Light';
  colorTile: string;
  panel: any;
  openPanel: () => SidebarPanelAction;
  copy: () => Plug;

  constructor(container: Container, uuid?: string) {
    super(uuid == undefined ? Utils.generatorUuid() : uuid,
      new Vector3(100, 100, 100), new Vector3(-1, -1, 1), 20, 1,
      AppModule.injector.get(EngineService).getScene());
    this.uuid = this.name;

    this.parent = container.getPlugTransform();
    this.openPanel = () => { return new SidebarPanelAction(SidebarPanel.LIGHT, true) }
  }

  getIcon() { return this.icon }
}