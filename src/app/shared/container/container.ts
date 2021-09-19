import { PlugAudio } from 'src/app/engine/plugs/plug-audio';
import { PlugCamera } from 'src/app/engine/plugs/plug-camera';
import { PlugGeometry } from 'src/app/engine/plugs/plug-geometry';
import { PlugTexture } from 'src/app/engine/plugs/plug-texture';
import { Plug } from '../../engine/plugs/plug';
import { PlugMaterial } from '../../engine/plugs/plug-material';
import { PlugTransform } from '../../engine/plugs/plug-transform';
import { Utils } from '../../engine/Utils/Utils';

export class Container {
  public uuid: string;
  public name: string;
  public children: Container[] = [];
  public parent: Container;
  public level: number = 0;
  public expandable: boolean = false;
  public selected: boolean;
  public hidden: boolean;
  public locked: boolean;

  private plugTransform: PlugTransform;
  private plugGeometry: PlugGeometry;
  private plugMaterial: PlugMaterial;
  private plugTexture: PlugTexture;
  private plugLight: Plug;
  private plugCamera: PlugCamera;
  private plugAudio: PlugAudio;

  public plugs: Plug[] = [];

  constructor() {
    this.uuid = Utils.generatorUuid();
    this.selected = false;
    this.hidden = false;
    this.locked = false;
    this.name = 'Container';
  }

  getPlugTransform(): PlugTransform {
    return this.plugTransform;
  }
  getPlugGeometry(): PlugGeometry {
    return this.plugGeometry;
  }
  getPlugMaterial(): PlugMaterial {
    return this.plugMaterial;
  }
  getPlugTexture(): PlugTexture {
    return this.plugTexture;
  }
  getPlugLight(): Plug {
    return this.plugLight;
  }
  getPlugCamera(): Plug {
    return this.plugCamera;
  }
  getPlugAudio(): Plug {
    return this.plugAudio;
  }

  setPlugTransform(pt: PlugTransform) {
    this.plugTransform = pt;
    this.plugs.push(pt);
  }

  setPlugMaterial(pm: PlugMaterial) {
    if (this.plugMaterial != undefined) {
      this.plugs = this.plugs.filter((p) => p.uuid != this.plugMaterial.uuid);
      this.plugMaterial.dispose();
    }
    this.plugMaterial = pm;
    this.plugs.push(pm);
  }

  setPlugTexture(pt: PlugTexture) {
    if (this.plugTexture != undefined) {
      this.plugs = this.plugs.filter((p) => p.uuid != this.plugTexture.uuid);
      this.plugTexture.dispose();
    }
    this.plugTexture = pt;
    this.plugs.push(pt);
  }

  setPlugGeometry(pg: PlugGeometry) {
    if (this.plugGeometry != undefined) {
      this.plugs = this.plugs.filter((p) => p.uuid != this.plugGeometry.uuid);
      this.plugGeometry.dispose();
    }
    this.plugGeometry = pg;
    this.plugs.push(pg);
  }

  setPlugLight(plug: Plug) {
    if (this.plugLight != undefined) {
      this.plugs = this.plugs.filter((p) => p.uuid != this.plugLight.uuid);
      this.plugLight.dispose();
    }
    this.plugLight = plug;
    this.plugs.push(plug);
  }

  setPlugCamera(pc: PlugCamera) {
    if (this.plugCamera != undefined) {
      this.plugs = this.plugs.filter((p) => p.uuid != this.plugCamera.uuid);
      this.plugCamera.dispose();
    }
    this.plugCamera = pc;
    this.plugs.push(pc);
  }

  setPlugAudio(pa: PlugAudio) {
    if (this.plugAudio != undefined) {
      this.plugs = this.plugs.filter((p) => p.uuid != this.plugAudio.uuid);
      this.plugAudio.dispose();
    }
    this.plugAudio = pa;
    this.plugs.push(pa);
  }

  unHide() {
    this.hidden = false;
    if (this.plugGeometry != undefined) {
      this.plugGeometry.visibility = 1;
      this.children.forEach((c) => (c.plugGeometry.visibility = 1));
    }

    if (this.plugLight != undefined) {
      (<any>this.plugLight).setEnabled(!this.hidden);

      this.children.forEach((c) => (<any>c.plugLight).setEnabled(!this.hidden));
    }
  }

  hide() {
    this.hidden = true;
    if (this.plugGeometry != undefined) {
      this.plugGeometry.visibility = 0;
      this.children.forEach((c) => (c.plugGeometry.visibility = 0));
    }

    if (this.plugLight != undefined) {
      (<any>this.plugLight).setEnabled(!this.hidden);
      this.children.forEach((c) => (<any>c.plugLight).setEnabled(!this.hidden));
    }
  }

  lock() {
    this.locked = true;
  }
  unlock() {
    this.locked = false;
  }

  getName(): string {
    return this.name;
  }
  setName(name: string) {
    this.name = name;
  }

  setParent(parent: Container) {
    let worldMatrix = this.plugTransform.getWorldMatrix();

    this.parent = parent;
    this.plugTransform.parent = parent.getPlugTransform().originZero;

    this.plugGeometry?.refreshBoundingInfo();
    this.plugTransform._worldMatrix = worldMatrix;
  }

  static getChildren(container: Container, acc?: Container[]): Container[] {
    acc = acc || [];
    container.children.forEach((c) => {
      acc.push(c);
      this.getChildren(c, acc);
    });
    return acc;
  }
}
