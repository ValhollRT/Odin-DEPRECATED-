import { Utils } from '../Utils/Utils';
import { Node, Mesh, Scene, MeshBuilder, StandardMaterial, Color3, HighlightLayer, PointLight, Light, HemisphericLight, DirectionalLight, Vector3, LightGizmo } from 'babylonjs';
import { GEOM, LIGHT } from 'src/app/configuration/AppConstants';
export class Container {

  public UUID: string;
  public name: string;
  public type: Mesh | Light = undefined;
  public children: Container[] = [];
  public parent: Container;
  public level: number = 0;
  public expandable: boolean = false;
  public selected: boolean;
  public hidden: boolean;

  constructor(type?: Mesh | Light) {
    this.type = type;
    this.UUID = Utils.generatorUUID();
    this.selected = false;
    this.hidden = false;
    this.name = type instanceof Mesh ? type.name.toUpperCase() : "LIGHT";
  }

  isMesh(): boolean { return this.type instanceof Mesh; }

  isLight(): boolean { return this.type instanceof Light; }

  unHide() { this.isMesh() ? (<Mesh>this.type).visibility = 1 : (<Light>this.type).intensity = 1; this.hidden = false; }

  hide() { this.isMesh() ? (<Mesh>this.type).visibility = 0 : (<Light>this.type).intensity = 0; this.hidden = true; }

  deleteMesh(scene: Scene) { scene.removeMesh(<Mesh>this.type); }

  deleteLight(scene: Scene) { scene.removeLight(<Light>this.type); }

  getName(): string { return this.name; }

  setName(name: string) { this.name = name; }

  set(type: Mesh | Light) { this.type = type; }

  get() { return this.type; }

}