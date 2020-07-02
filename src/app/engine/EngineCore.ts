import { WindowRefService } from './../services/index.service';
import { ElementRef } from '@angular/core';
import {
  Engine,
  Scene,
  Color4,
  Vector3,
  ArcRotateCamera,
  HemisphericLight,
  PointLight,
  Mesh,
} from 'babylonjs';
import 'babylonjs-materials';
import { Grid } from './helpers/Grid';
import { Container } from './common/Container';
import { AxisHelper } from './helpers/AxisHelper';
import { Observable } from 'rxjs';
import { CanvasHelper } from './helpers/CanvasHelper';

export class EngineCore {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: ArcRotateCamera;
  private scene: Scene;
  private grid: Grid;
  private canvasHelper: CanvasHelper;

  private axisHelper: AxisHelper;

  public constructor(public windowService: WindowRefService) { }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.canvas = canvas.nativeElement;
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0, 0, 0, 1);

    this.grid = new Grid(this.scene);
    this.axisHelper = new AxisHelper(10, this.scene);

    // Add lights to the scene
    var light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), this.scene);
    var light2 = new PointLight("light2", new Vector3(0, 1, -1), this.scene);

    this.camera = new ArcRotateCamera("Camera", 0, 0, 100, new Vector3(100, 0, 100), this.scene);
    this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(this.canvas, false);
    this.camera.panningSensibility = 100;

    // Event Canvas
    this.canvasHelper = new CanvasHelper(this.canvas, this.scene, this.camera, this.windowService.document);

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
    return new Observable(o => { o.next(c); o.complete() });
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

