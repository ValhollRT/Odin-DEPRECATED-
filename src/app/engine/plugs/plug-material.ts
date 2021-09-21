import { Color3, StandardMaterial } from 'babylonjs';
import { EngineService } from 'src/app/services/engine.service';
import { Utils } from '../Utils/Utils';
import { AppModule } from './../../app.module';
import { MaterialDto } from './../../models/MaterialDto.model';
import {
  SidebarPanel,
  SidebarPanelAction,
} from './../../models/menuActions/SidebarPanelAction.model';
import { Container } from './../../shared/container/container';
import { Plug } from './plug';

export class PlugMaterial extends StandardMaterial implements Plug {
  uuid: string;
  enable: boolean;
  icon: string = 'icon-material';
  title: string = 'Material';
  colorTile: string;
  panel: any;
  isSelected: boolean;
  openPanel: () => SidebarPanelAction;
  copy: () => Plug;

  constructor(container: Container, uuid?: string) {
    super(
      uuid == undefined ? Utils.generatorUuid() : uuid,
      AppModule.injector.get(EngineService).getScene()
    );
    this.uuid = this.name;

    this.openPanel = () => {
      return new SidebarPanelAction(SidebarPanel.MATERIAL, true);
    };

    this.diffuseColor = new Color3(1, 1, 1);
    let geometry = container.getPlugGeometry();
    let texture = container.getPlugTexture();
    if (geometry != undefined) geometry.material = this;
    if (texture != undefined) this.diffuseTexture = texture;

    this.isSelected = false;
  }

  getIcon() {
    return this.icon;
  }
  setDiffuseColor(color: Color3): PlugMaterial {
    this.diffuseColor.r = color.r;
    this.diffuseColor.g = color.g;
    this.diffuseColor.b = color.b;
    return this;
  }
  setAmbientColor(color: Color3): PlugMaterial {
    this.ambientColor.r = color.r;
    this.ambientColor.g = color.g;
    this.ambientColor.b = color.b;
    return this;
  }
  setSpecularColor(color: Color3): PlugMaterial {
    this.specularColor.r = color.r;
    this.specularColor.g = color.g;
    this.specularColor.b = color.b;
    return this;
  }

  static fromDto(dto: MaterialDto, container: Container): PlugMaterial {
    return new PlugMaterial(container)
      .setDiffuseColor(dto.diffuseColor)
      .setAmbientColor(dto.ambientColor)
      .setSpecularColor(dto.specularColor);
  }
}
