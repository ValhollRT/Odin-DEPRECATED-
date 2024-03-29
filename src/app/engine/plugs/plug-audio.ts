import { Sound } from 'babylonjs';
import { EngineService } from 'src/app/services/engine.service';
import { Container } from 'src/app/shared/container/container';
import { Utils } from '../Utils/Utils';
import { AppModule } from './../../app.module';
import {
  SidebarPanel,
  SidebarPanelAction,
} from './../../models/menuActions/SidebarPanelAction.model';
import { Plug } from './plug';

export class PlugAudio extends Sound implements Plug {
  uuid: string;
  enable: boolean;
  icon: string = 'icon-audio';
  title: string = 'Audio';
  colorTile: string;
  panel: any;
  active: boolean;
  guidAudio: string;

  openPanel: () => SidebarPanelAction;

  constructor(container: Container, guid: string, uuid?: string) {
    super(
      uuid == undefined ? Utils.generatorUuid() : uuid,
      `https://storage.googleapis.com/valhollrt-db-demo.appspot.com/audios/${guid}`,
      AppModule.injector.get(EngineService).getScene(),
      null,
      {
        loop: false,
        autoplay: false,
      }
    );
    this.uuid = this.name;
    this.openPanel = () => {
      return new SidebarPanelAction(SidebarPanel.AUDIO, true);
    };
    this.isSelected = false;
    this.guidAudio = guid
  }

  copy(parent: Container): PlugAudio {
    return new PlugAudio(parent, this.guidAudio);
  }
  
  isSelected: boolean;

  getIcon() {
    return this.icon;
  }

  static fromDto(guid: string, container: Container): PlugAudio {
    return new PlugAudio(container, guid);
  }
}
