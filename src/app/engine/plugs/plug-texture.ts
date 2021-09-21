import { Texture } from 'babylonjs';
import { EngineService } from 'src/app/services/engine.service';
import { Container } from 'src/app/shared/container/container';
import { Utils } from '../Utils/Utils';
import { AppModule } from './../../app.module';
import {
  SidebarPanel,
  SidebarPanelAction,
} from './../../models/menuActions/SidebarPanelAction.model';
import { Plug } from './plug';

export class PlugTexture extends Texture implements Plug {
  uuid: string;
  enable: boolean;
  icon: string = 'icon-texture';
  title: string = 'Texture';
  colorTile: string;
  panel: any;
  active: boolean;
  isSelected: boolean;
  openPanel: () => SidebarPanelAction;
  copy: () => Plug;

  constructor(container: Container, url: string, uuid?: string) {
    super(url, AppModule.injector.get(EngineService).getScene());

    this.name = uuid == undefined ? Utils.generatorUuid() : uuid;
    this.uuid = this.name;
    let pm = container.getPlugMaterial();
    if (pm != undefined) pm.diffuseTexture = this;
    this.hasAlpha = true;
    this.openPanel = () => {
      return new SidebarPanelAction(SidebarPanel.TEXTURE, true);
    };
    this.active = false;
    this.isSelected = false;
  }

  getIcon() {
    return this.icon;
  }

  static fromDto(url: string, container: Container): PlugTexture {
    return new PlugTexture(container, url);
  }
}
