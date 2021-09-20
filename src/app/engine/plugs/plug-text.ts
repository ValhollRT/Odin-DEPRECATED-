import { VertexData } from 'babylonjs';
import { Container } from 'src/app/shared/container/container';
import { FontType } from '../Text/font-type';
import { TextType } from '../Text/text-type';
import { Utils } from '../Utils/Utils';
import { SidebarPanelAction } from './../../models/menuActions/SidebarPanelAction.model';
import { GeometryPanel } from './../../models/panels/GeometryPanels.model';
import { Plug } from './plug';
import { PlugGeometry } from './plug-geometry';

export class PlugText extends PlugGeometry implements Plug {
  public uuid: string;
  containerUuid: string;
  enable: boolean;
  icon: string = 'icon-font';
  title: string;
  colorTile: string;
  getIcon() {
    return this.icon;
  }
  openPanel: () => SidebarPanelAction;
  panel: GeometryPanel;
  copy: () => Plug;
  text: TextType;
  public rebuildMesh: (options: any) => VertexData;

  constructor(container: Container, url: string, uuid?: string) {
    super(
      container,
      undefined,
      uuid == undefined ? Utils.generatorUuid() : uuid
    );
    this.uuid = this.name;

    let scene = this.getScene();
    let font = new FontType();
    font.load(url, scene, (font: FontType) => {
      this.text = new TextType(font, 'Text', this);
    });
  }
}
