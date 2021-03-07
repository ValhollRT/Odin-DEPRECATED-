import { FontType } from './Text/FontType';
import { Injector } from '@angular/core';
import { ElementRef, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ArcRotateCamera, Color3, Color4, Engine,
  Light,
  Mesh, Scene,
  StandardMaterial,
  Vector3
} from 'babylonjs';
import 'babylonjs-materials';
import { BehaviorSubject } from 'rxjs';
import { AppState } from '../app.reducer';
import { LIGHT } from '../configuration/AppConstants';
import { CanvasHelperService } from '../services/index.service';
import { LogService } from '../services/log.service';
import { WindowService } from '../services/window.service';
import { Container } from './common/Container';
import { ElementBuilder } from './common/ElementBuilder';
import { GizmoHelper } from './helpers/GizmoHelper';
import { Grid } from './helpers/Grid';
import { TextType } from './Text/TextType';

@Injectable({ providedIn: 'root' })
export class EngineService {
  private static grid: Grid;

  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: ArcRotateCamera;
  private scene: Scene;
  private gizmoHelper: GizmoHelper;
  private canvasHelper: CanvasHelperService;

  // References Containers for engine
  public typeToContainer = new Map<Mesh | Light, Container>();
  public UUIDToContainer = new Map<string, Container>();

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

    EngineService.grid = new Grid(this.scene);
    this.camera = new ArcRotateCamera("Camera", 0, 0, 100, new Vector3(0, 0, 0), this.scene);
    this.camera.setTarget(Vector3.Zero());
    this.camera.panningSensibility = 100;

    this.scene.registerAfterRender(() => { });
    this.canvasHelper = this.injector.get(CanvasHelperService);
    this.gizmoHelper = new GizmoHelper(this);

    this.camera.onViewMatrixChangedObservable.add(() => {
      this.gizmoHelper.cameraGizmo.position = this.camera.position;
    });

    this.createDefaultScene();
  }

  public getGizmoHelper() { return this.gizmoHelper; }
  public getCanvas() { return this.canvas; }
  public getCamera() { return this.camera; }
  public getScene(): Scene { return this.scene }
  public getCanvasHelper() { return this.canvasHelper; }
  public getEngine() { return this.engine; }

  public createMesh(type: string): void {
    let c = ElementBuilder.createContainerMesh(type, this.getScene());
    this.typeToContainer.set(c.type, c);
    this.UUIDToContainer.set(c.UUID, c);
    this.saveContainerToDataTree(c);
  }

  public createLight(type: string): void {
    let c = new Container(ElementBuilder.createLight(type, this.getScene()));
    this.typeToContainer.set(c.type, c);
    this.UUIDToContainer.set(c.UUID, c);
    this.saveContainerToDataTree(c);
  }

  public saveContainerToDataTree(c: Container) { this.newContainer$.next(c); }
  public getContainerFromUUID(UUID: string): Container { return this.UUIDToContainer.get(UUID) }
  public getContainerFromType(type: Mesh | Light): Container { return this.typeToContainer.get(type) }
  public createDefaultScene() { this.createLight(LIGHT.DIRECTIONAL); }

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


  public animate(): void {
    const rendererLoopCallback = () => {
      this.scene.render();
      this.gizmoHelper.getScene().render();
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