import { Utils } from '../Utils/Utils';
import { Mesh, Scene, Light, VertexData } from 'babylonjs';
import { GeometryPanel } from 'src/app/models/geometry/geometry-panels';
import { Text } from '../Text/Text'

export class Container {

  public UUID: string;
  public name: string;
  public type: Mesh | Light = undefined;
  public text: Text;
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
  container: import("/home/sparanzza/Code/Odin/src/app/engine/Text/Text").Text;


  constructor(type?: Mesh | Light) {
    this.type = type;
    this.UUID = Utils.generatorUUID();
    this.selected = false;
    this.hidden = false;
    if (type !== undefined) this.name = type.name.toUpperCase();
    else this.name = "ROOT";
  }

  isMesh(): boolean { return this.type instanceof Mesh; }
  isLight(): boolean { return this.type instanceof Light; }

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
    if (this.isMesh()) return 'icon-geometry';
    if (this.isLight()) return 'icon-light';
    if (this.isText) return 'icon-font';
  }
}