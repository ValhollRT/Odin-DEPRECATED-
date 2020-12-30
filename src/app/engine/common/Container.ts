import { Utils } from '../Utils/Utils';
import { Mesh, Scene, Light, VertexData } from 'babylonjs';
import { GeometryPanel } from 'src/app/models/geometry/geometry-panels';
export class Container {

  public UUID: string;
  public name: string;
  public type: Mesh | Light = undefined;
  public rebuildMesh: (options: any) => VertexData;
  public children: Container[] = [];
  public parent: Container;
  public panel: GeometryPanel;
  public level: number = 0;
  public expandable: boolean = false;
  public selected: boolean;
  public hidden: boolean;
  public locked: boolean;


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

  unHide() { this.isMesh() ? (<Mesh>this.type).visibility = 1 : (<Light>this.type).intensity = 1; this.hidden = false; }
  hide() { this.isMesh() ? (<Mesh>this.type).visibility = 0 : (<Light>this.type).intensity = 0; this.hidden = true; }

  lock() { this.locked = true; }
  unlock() { this.locked = false; }

  deleteMesh(scene: Scene) { scene.removeMesh(<Mesh>this.type); }

  deleteLight(scene: Scene) { scene.removeLight(<Light>this.type); }

  getName(): string { return this.name; }

  setName(name: string) { this.name = name; }

  set(type: Mesh | Light) { this.type = type; }

  get() { return this.type; }

  getIconType(): string {
    if (this.isMesh()) return 'icon-geometry';
    if (this.isLight()) return 'icon-light';
  }

}