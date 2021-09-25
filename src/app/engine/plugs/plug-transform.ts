import { TransformNode, Vector3 } from 'babylonjs';
import { AppModule } from 'src/app/app.module';
import { EngineService } from 'src/app/services/index.service';
import { Container } from 'src/app/shared/container/container';
import {
  SidebarPanel,
  SidebarPanelAction,
} from '../../models/menuActions/SidebarPanelAction.model';
import { AxisHelper } from '../helpers/axis-helper';
import { Utils } from '../Utils/Utils';
import { Plug } from './plug';

export class PlugTransform extends TransformNode implements Plug {
  uuid: string;
  enable: boolean;
  icon: string = 'icon-axis';
  title: string = 'Transform';
  colorTile: string;
  panel: any;
  openPanel: () => SidebarPanelAction;
  axis: AxisHelper;
  origin: Vector3;
  originZero: TransformNode;
  isSelected: boolean;

  constructor(uuid?: string) {
    super(
      uuid == undefined ? Utils.generatorUuid() : uuid,
      AppModule.injector.get(EngineService).getScene()
    );
    this.uuid = this.name;
    this.openPanel = () => {
      return new SidebarPanelAction(SidebarPanel.TRANSFORMATION, true);
    };

    this.axis = new AxisHelper(5, this.getScene());
    this.axis.parent = this;
    this.axis.setVisible(false);
    this.origin = Vector3.Zero();
    this.originZero = new TransformNode('originZero');
    this.originZero.parent = this;

    this.isSelected = false;
  }

  getIcon() {
    return this.icon;
  }

  getPosition(): Vector3 {
    return this.position;
  }
  getRotationInRadians(): Vector3 {
    return this.rotation;
  }
  getScale(): Vector3 {
    return this.scaling;
  }

  setPosition(): void {
    this.position;
  }
  setRotationInRadians(): void {
    this.rotation;
  }
  setScale(): void {
    this.scaling;
  }

  copy(parent: Container): PlugTransform {
    let plugTransformParent = parent.getPlugTransform();
    plugTransformParent.position = this.position;
    plugTransformParent.rotation = this.rotation;
    plugTransformParent.scaling = this.scaling;
    plugTransformParent.origin = this.origin;
    plugTransformParent.originZero = this.originZero;
    return this;
  }
}
