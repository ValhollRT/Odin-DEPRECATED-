import { Injector } from '@angular/core';
import { Optional } from '@angular/core';
import { ElementRef, Injectable } from '@angular/core';
import {
  ArcRotateCamera, Color4, Engine,
  HemisphericLight,
  Light,
  LightBlock,
  Mesh, PointLight, Scene,
  Vector3
} from 'babylonjs';
import 'babylonjs-materials';
import { Observable, BehaviorSubject } from 'rxjs';
import { CanvasHelperService } from '../services/index.service';
import { LogService } from '../services/log.service';
import { WindowService } from '../services/window.service';
import { Container } from './common/Container';
import { ElementBuilder } from './common/ElementBuilder';
import { AxisHelper } from './helpers/AxisHelper';
import { GizmoHelper } from './helpers/GizmoHelper';
import { Grid } from './helpers/Grid';

@Injectable({ providedIn: 'root' })

export class EngineService {

  private static grid: Grid;

  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: ArcRotateCamera;
  private scene: Scene;
  private gizmoHelper: GizmoHelper;
  private canvasHelper: CanvasHelperService;

  private currentSelected: Mesh | Light;
  private currentSelected$: BehaviorSubject<Mesh | Light> = new BehaviorSubject(undefined);

  public newContainer$ = new BehaviorSubject<Container>(undefined);

  flatMeshContainer = new Map<Mesh | Light, Container>();

  public constructor(
    public windowService: WindowService,
    public logService: LogService,
    public injector: Injector) { }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.canvas = canvas.nativeElement;
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0.09, 0.09, 0.1, 1);

    EngineService.grid = new Grid(this.scene);
    this.camera = new ArcRotateCamera("Camera", 0, 0, 100, new Vector3(0, 0, 0), this.scene);
    this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(this.canvas, true, true);
    this.camera.panningSensibility = 100;

    this.scene.registerAfterRender(() => { });
    this.canvasHelper = this.injector.get(CanvasHelperService);
    this.gizmoHelper = new GizmoHelper(this.engine);

    this.camera.onViewMatrixChangedObservable.add(() => {
      this.gizmoHelper.cameraGizmo.position = this.camera.position;
    });
  }

  public getGizmoHelper() { return this.gizmoHelper; }
  public getCanvas() { return this.canvas; }
  public getCamera() { return this.camera; }
  public getScene(): Scene { return this.scene }

  public createMesh(type: string): void {
    let c = ElementBuilder.createContainerMesh(type, this.getScene());
    this.flatMeshContainer.set(c.type, c);
    this.saveContainerToDataTree(c);
  }

  public createLight(type: string): void {
    let c = new Container(ElementBuilder.createLight(type, this.getScene()));
    this.saveContainerToDataTree(c);
  }

  public saveContainerToDataTree(c: Container) { this.newContainer$.next(c); }

  public setCurrentSelected(o: Mesh | Light, fire: boolean) {
    if (this.currentSelected instanceof Mesh) {
      this.currentSelected.disableEdgesRendering();
      this.currentSelected.edgesWidth = 0;
    }

    this.currentSelected = o;
    if (fire) this.currentSelected$.next(o);
  }

  // return currentMesh
  public getCurrentSelected$(): BehaviorSubject<Mesh | Light> { return this.currentSelected$; }
  public getCurrentSelected(): Mesh | Light { return this.currentSelected; }

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