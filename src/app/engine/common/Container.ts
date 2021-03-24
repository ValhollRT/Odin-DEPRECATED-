import { ArcRotateCamera, Light, Mesh, Scene, TargetCamera, VertexData } from 'babylonjs';
import { GeometryPanel, SidebarPanel } from '../../models';
import { TextType } from '../Text/TextType';
import { Utils } from '../Utils/Utils';

export class Container {

  public UUID: string;
  public name: string;
  public type: Mesh | Light | ArcRotateCamera = undefined;
  public text: TextType;
  public rebuildMesh: (options: any) => VertexData;
  public children: Container[] = [];
  public parent: Container;
  public panel: GeometryPanel;
  public level: number = 0;
  public expandable: boolean = false;
  public selected: boolean;
  public hidden: boolean = false;
  public locked: boolean = false;
  public isText: boolean = false;

  constructor(type?: Mesh | Light | ArcRotateCamera) {
    this.type = type;
    this.UUID = Utils.generatorUUID();
    this.selected = false;
    this.hidden = false;
    if (type !== undefined) this.name = type.name.toUpperCase();
    else this.name = "Root";
  }


  isMesh(): boolean { return this.type instanceof Mesh; }
  isLight(): boolean { return this.type instanceof Light; }
  isCamera(): boolean { return this.type instanceof ArcRotateCamera; }

  unHide() {
    if (this.isMesh()) {
      (<Mesh>this.type).visibility = 1;
      this.type.getChildMeshes(false).forEach(m => (<Mesh>m).visibility = 1)
    }
    else (<Light>this.type).intensity = 1; this.hidden = false;
  }

  hide() {
    if (this.isMesh()) { (<Mesh>this.type).visibility = 0; this.type.getChildMeshes(false).forEach(m => (<Mesh>m).visibility = 0) }
    else (<Light>this.type).intensity = 0; this.hidden = true;
  }

  lock() { this.locked = true; }
  unlock() { this.locked = false; }

  deleteMesh(scene: Scene) {
    this.type.getChildMeshes(false).forEach(m => scene.removeMesh(m));
    scene.removeMesh(<Mesh>this.type);
  }

  deleteLight(scene: Scene) { scene.removeLight(<Light>this.type); }

  getName(): string { return this.name; }
  setName(name: string) { this.name = name; }

  set(type: Mesh | Light) { this.type = type; }
  get() { return this.type; }

  getIconType(): string {
    if (this.isCamera()) return 'icon-camera';
    if (this.isLight()) return 'icon-light';
    if (this.text) return 'icon-font';
    if (this.panel == null) return '';
    if (this.isMesh()) return 'icon-geometry';
    if (this.isText) return 'icon-font';
  }

  getPanel(): number {
    if (this.isLight()) return SidebarPanel.LIGHT;
    if (this.isCamera()) return SidebarPanel.CAMERA;
    if (this.text || this.isMesh() || this.isText) return SidebarPanel.GEOMETRY;
  }

  setParent(parent: Container) {
    if (this.type instanceof TargetCamera) return;
    (<Mesh>this.type).refreshBoundingInfo();
    let worldMatrix = this.type.getWorldMatrix();
    this.parent = parent;
    this.type.parent = parent.type;
    (<Mesh>this.type).refreshBoundingInfo();
    this.type._worldMatrix = worldMatrix;
  }
}