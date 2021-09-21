import { ArcRotateCamera, Vector3 } from 'babylonjs';
import { EngineService } from 'src/app/services/engine.service';
import { Container } from 'src/app/shared/container/container';
import { Utils } from '../Utils/Utils';
import { AppModule } from './../../app.module';
import {
  SidebarPanel,
  SidebarPanelAction,
} from './../../models/menuActions/SidebarPanelAction.model';
import { Plug } from './plug';

export class PlugCamera extends ArcRotateCamera implements Plug {
  uuid: string;
  enable: boolean;
  icon: string = 'icon-camera';
  title: string = 'Camera';
  colorTile: string;
  panel: any;
  active: boolean;
  isSelected: boolean;
  openPanel: () => SidebarPanelAction;
  copy: () => Plug;

  constructor(container: Container, uuid?: string) {
    super(
      uuid == undefined ? Utils.generatorUuid() : uuid,
      0,
      0,
      100,
      new Vector3(0, 0, 0),
      AppModule.injector.get(EngineService).getScene()
    );

    this.uuid = this.name;
    this.position = new Vector3(0, 0, -500);
    this.setTarget(Vector3.Zero());
    this.panningSensibility = 100;
    this.openPanel = () => {
      return new SidebarPanelAction(SidebarPanel.CAMERA, true);
    };
    this.parent = container.getPlugTransform();
    this.active = false;
    this.isSelected = false;
  }

  getIcon() {
    return this.icon;
  }
}
