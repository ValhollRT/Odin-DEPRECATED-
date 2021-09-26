import { ElementRef, Injectable, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { Color3, Color4, Engine, Scene } from 'babylonjs';
import 'babylonjs-materials';
import { BehaviorSubject } from 'rxjs';
import { GizmoHelper } from '../engine/helpers/gizmo-helper';
import { Grid } from '../engine/helpers/grid';
import { PlugCamera } from '../engine/plugs/plug-camera';
import { Container } from '../shared/container/container';
import { AppState } from '../store/app.reducer';
import { engineIsLoaded } from './../store/actions/engine.actions';
import { LogService } from './log.service';
import { WindowService } from './window.service';

@Injectable({ providedIn: 'root' })
export class EngineService {
  private grid: Grid;
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private defaultCamera: PlugCamera;
  private scene: Scene;
  private gizmoHelper: GizmoHelper;

  public emitNewContainerTreeNode$ = new BehaviorSubject<Container>(undefined);
  public updateTreeNode$ = new BehaviorSubject<boolean>(false);

  private sceneBackgroundColor: Color3;

  public constructor(
    public windowService: WindowService,
    public store: Store<AppState>,
    public logService: LogService,
    public injector: Injector
  ) {}

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.canvas = canvas.nativeElement;
    this.engine = new Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      alpha: true,
      antialias: true,
    });

    this.engine.setSize(1445, 813);
    this.scene = new Scene(this.engine);
    this.scene.autoClearDepthAndStencil = true; // Depth and stencil, obviously
    this.scene.clearColor = new Color4(0.2, 0.2, 0.2, 1);
    this.scene.registerAfterRender(() => {});

    this.grid = new Grid(this.scene);
    this.store.dispatch(engineIsLoaded({ isLoaded: true }));
  }

  initGizmoHelper() {
    this.gizmoHelper = new GizmoHelper(this.getEngine(), this.getCamera());
  }

  getGizmoHelper() {
    return this.gizmoHelper;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
  public getCamera() {
    return this.defaultCamera;
  }
  public getScene(): Scene {
    return this.scene;
  }
  public getEngine() {
    return this.engine;
  }

  public getGrid(): Grid {
    return this.grid;
  }

  public setCamera(camera: PlugCamera) {
    if (this.defaultCamera != undefined) this.defaultCamera.active = false;
    camera.active = true;

    this.defaultCamera = camera;
    this.scene.activeCamera = camera;
    this.updateTreeNode();
  }

  public saveContainerToDataTree(c: Container) {
    this.emitNewContainerTreeNode$.next(c);
  }

  public setBackgroundColorScene(backgroundColor: string, alpha: number = 1) {
    this.sceneBackgroundColor = Color3.FromHexString(backgroundColor);
    this.scene.clearColor = new Color4(
      this.sceneBackgroundColor.r,
      this.sceneBackgroundColor.g,
      this.sceneBackgroundColor.b,
      alpha
    );
  }

  public updateTreeNode() {
    this.updateTreeNode$.next(true);
  }

  public animate(gizmoScene: Scene): void {
    const rendererLoopCallback = () => {
      this.scene.render();
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
