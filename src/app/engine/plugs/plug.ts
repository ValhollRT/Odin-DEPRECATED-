import { PlugHemisphericLight } from 'src/app/engine/plugs/plug-light/plug-hemispheric-light';
import { PlugTexture } from 'src/app/engine/plugs/plug-texture';
import { PlugMaterial } from './plug-material';
import { PlugTransform } from './plug-transform';
import { PlugGeometry } from 'src/app/engine/plugs/plug-geometry';
import { Container } from 'src/app/shared/container/container';
import { SidebarPanelAction } from '../../models/menuActions/SidebarPanelAction.model';
import { PlugDirectionalLight } from './plug-light/plug-directional-light';
import { PlugPointLight } from './plug-light/plug-point-light';
import { PlugSpotLight } from './plug-light/plug-spot-light';
import { PlugCamera } from './plug-camera';
import { PlugAudio } from './plug-audio';

export type PlugAll =
  | PlugGeometry
  | PlugTransform
  | PlugMaterial
  | PlugTexture
  | PlugDirectionalLight
  | PlugPointLight
  | PlugSpotLight
  | PlugHemisphericLight
  | PlugCamera
  | PlugAudio;

export interface Plug {
  uuid: string;
  enable: boolean;
  icon: string;
  title: string;
  colorTile: string;
  getIcon();
  panel: any;
  isSelected: boolean;
  openPanel: () => SidebarPanelAction;
  copy(parent: Container): PlugAll;
  dispose();
}
