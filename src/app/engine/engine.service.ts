import { ElementRef, Injectable } from '@angular/core';
import {
  ArcRotateCamera, Color4, Engine,
  HemisphericLight,
  Mesh, PointLight, Scene,
  Vector3
} from 'babylonjs';
import 'babylonjs-materials';
import { Observable, BehaviorSubject } from 'rxjs';
import { LogService } from '../services/log.service';
import { WindowService } from '../services/window.service';
import { Container } from './common/Container';
import { AxisHelper } from './helpers/AxisHelper';
import { CanvasHelper } from './helpers/CanvasHelper';
import { Grid } from './helpers/Grid';

@Injectable({
  providedIn: 'root',
})
export class EngineService {

  private static grid: Grid;
  private static axisHelper: AxisHelper;

  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: ArcRotateCamera;
  private scene: Scene;
  private canvasHelper: CanvasHelper;
  public newContainer$ = new BehaviorSubject<Container>(undefined);

  public constructor(
    public windowService: WindowService,
    public logService: LogService,
  ) { }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.canvas = canvas.nativeElement;
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0, 0, 0, 1);

    EngineService.grid = new Grid(this.scene);
    EngineService.axisHelper = new AxisHelper(10, this.scene);

    // Add lights to the scene
    var light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), this.scene);
    var light2 = new PointLight("light2", new Vector3(0, 1, -1), this.scene);

    this.camera = new ArcRotateCamera("Camera", 0, 0, 100, new Vector3(100, 0, 100), this.scene);
    this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(this.canvas, false);
    this.camera.panningSensibility = 100;

    // Event Canvas
    this.canvasHelper = new CanvasHelper(this.canvas, this.scene, this.camera);

    this.scene.registerAfterRender(() => { });

  }

  public getScene(): Scene {
    return this.scene
  }

  public getCurrentMeshSelected(): Observable<Mesh> {
    return this.canvasHelper.getCurrentMeshSelected();
  }

  public createGeometry(type: string): Observable<Container> {
    let c = new Container().createGeometry(type, this.scene);
    this.newContainer$.next(c);
    return new Observable(o => { o.next(c); });
  }

  public animate(): void {

    const rendererLoopCallback = () => {
      this.scene.render();
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