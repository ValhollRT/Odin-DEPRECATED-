import { ElementRef, Injectable, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ArcRotateCamera, Color3, Color4, Engine,
  Light,
  Mesh, Scene
} from 'babylonjs';
import 'babylonjs-materials';
import { BoundingBox } from 'babylonjs/Culling/boundingBox';
import { BehaviorSubject } from 'rxjs';
import { Container } from 'src/app/engine/common/Container';
import { CAMERA, LIGHT } from '../configuration/AppConstants';
import { Grid } from '../engine/helpers/Grid';
import { PlugBuilder } from '../engine/plugs/plugBuilder';
import { AppState } from '../store/app.reducer';
import { LogService } from './log.service';
import { WindowService } from './window.service';

@Injectable({ providedIn: 'root' })
export class EngineService {

  private grid: Grid;
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private defaultCamera: ArcRotateCamera;
  private scene: Scene;

  // References Containers for engine
  public typeToContainer = new Map<Mesh | Light | ArcRotateCamera, Container>();
  public UUIDToContainer = new Map<string, Container>();
  public UUIDToBoundingBox = new Map<string, BoundingBox>();
  public UUIDToCamera = new Map<string, ArcRotateCamera>();

  public newContainer$ = new BehaviorSubject<Container>(undefined);
  private selectedUUIDContainers: string[];
  private sceneBackgroundColor: Color3;

  public constructor(
    public windowService: WindowService,
    public store: Store<AppState>,
    public logService: LogService,
    public injector: Injector) {
    store.select('engine').subscribe(en => this.selectedUUIDContainers = [...en.UUIDCsSelected]);
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.canvas = canvas.nativeElement;

    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
    this.scene.clearColor = new Color4(0.2, 0.2, 0.2, 1);
    this.scene.registerAfterRender(() => { });

    this.defaultCamera = this.createCameraContainer(CAMERA.ARCROTATECAMERA);
    this.scene.activeCamera = this.defaultCamera;
    this.grid = new Grid(this.scene);
    this.createDefaultScene();
  }

  public getCanvas(): HTMLCanvasElement { return this.canvas; }
  public getCamera() { return this.defaultCamera; }
  public getScene(): Scene { return this.scene }
  public getEngine() { return this.engine; }

  public setCamera(camera: ArcRotateCamera) {
    this.defaultCamera = camera;
    this.scene.activeCamera = camera;
  }

  public createMesh(type: string): void {
    let c = PlugBuilder.createContainerMesh(type, this.getScene());
    this.typeToContainer.set(c.type, c);
    this.UUIDToContainer.set(c.UUID, c);
    this.UUIDToBoundingBox.set(c.UUID, (<Mesh>c.type).getBoundingInfo().boundingBox)
    this.saveContainerToDataTree(c);
  }

  public createLight(type: string): void {
    let c = new Container(PlugBuilder.createLight(type, this.getScene()));
    this.typeToContainer.set(c.type, c);
    this.UUIDToContainer.set(c.UUID, c);
    this.saveContainerToDataTree(c);
  }

  public createCameraContainer(type: string): ArcRotateCamera {
    let camera = PlugBuilder.createCamera(type, this.getScene());
    let c = new Container(camera);
    this.typeToContainer.set(c.type, c);
    this.UUIDToContainer.set(c.UUID, c);
    this.saveContainerToDataTree(c);
    this.UUIDToCamera.set(c.UUID, camera);
    return <ArcRotateCamera>c.type;
  }

  public createNewGeometryText(): void {
    PlugBuilder.createNewGeometryText(this);
  }

  public saveContainerToDataTree(c: Container) { this.newContainer$.next(c); }
  public getContainerFromUUID(UUID: string): Container { return this.UUIDToContainer.get(UUID) }
  public getContainerFromType(type: Mesh | Light): Container { return this.typeToContainer.get(type) }
  public createDefaultScene() {
    this.createLight(LIGHT.DIRECTIONAL);
    this.scene.activeCamera = this.defaultCamera;
  }

  // Get Selections methods
  public getSelectedContainers(): string[] { return this.selectedUUIDContainers }
  public nothingSelected(): boolean { return this.selectedUUIDContainers.length < 1 }
  public getFirstSelected(): Container { return this.getContainerFromUUID(this.selectedUUIDContainers[0]); }

  public deleteContainerRef(container: Container) {
    this.typeToContainer.delete(container.type)
    this.UUIDToContainer.delete(container.UUID)
  }

  public setBackgroundColorScene(backgroundColor: string) {
    this.sceneBackgroundColor = Color3.FromHexString(backgroundColor);
    this.scene.clearColor = new Color4(this.sceneBackgroundColor.r, this.sceneBackgroundColor.g, this.sceneBackgroundColor.b, 1);
  }

  public animate(gizmoScene: Scene): void {
    const rendererLoopCallback = () => {
      this.scene.render();
      // this.gizmoHelper.getScene().render();
      gizmoScene.render();
    };

    if (this.windowService.document.readyState !== 'loading') {
      this.engine.runRenderLoop(rendererLoopCallback);
    } else {
      this.windowService.window.addEventListener('DOMContentLoaded', () => {
        this.engine.runRenderLoop(rendererLoopCallback);
      });
    }

    this.windowService.window.addEventListener('resize', () => {
      this.engine.resize();
    });

  }
}