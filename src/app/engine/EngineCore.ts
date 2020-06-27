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
  GizmoManager,
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

  private axisHelper: AxisHelper;
  private gizmoManager: GizmoManager;

  public constructor(public wrs: WindowRefService) { }

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

    // Event Canvas
    // new CanvasHelper(this.canvas, this.scene, this.camera);

    // Initialize GizmoManager
    this.gizmoManager = new GizmoManager(this.scene)
    this.gizmoManager.boundingBoxGizmoEnabled = true
    this.gizmoManager.clearGizmoOnEmptyPointerEvent = true;

    document.onkeydown = (e) => {
      if (e.key == 'w') {
        this.gizmoManager.positionGizmoEnabled = !this.gizmoManager.positionGizmoEnabled
        this.gizmoManager.rotationGizmoEnabled = false;
        this.gizmoManager.scaleGizmoEnabled = false;
        this.gizmoManager.boundingBoxGizmoEnabled = false;
      }
      if (e.key == 'e') {
        this.gizmoManager.positionGizmoEnabled = false;
        this.gizmoManager.rotationGizmoEnabled = !this.gizmoManager.rotationGizmoEnabled
        this.gizmoManager.scaleGizmoEnabled = false;
        this.gizmoManager.boundingBoxGizmoEnabled = false;
      }
      if (e.key == 'r') {
        this.gizmoManager.positionGizmoEnabled = false;
        this.gizmoManager.rotationGizmoEnabled = false;
        this.gizmoManager.scaleGizmoEnabled = !this.gizmoManager.scaleGizmoEnabled
        this.gizmoManager.boundingBoxGizmoEnabled = false;
      }
      if (e.key == 'q') {
        this.gizmoManager.positionGizmoEnabled = false;
        this.gizmoManager.rotationGizmoEnabled = false;
        this.gizmoManager.scaleGizmoEnabled = false;
        this.gizmoManager.boundingBoxGizmoEnabled = !this.gizmoManager.boundingBoxGizmoEnabled
      }
    }

    this.scene.registerAfterRender(() => { });

  }

  public getScene(): Scene {
    return this.scene
  }

  public createGeometry(type: string): Observable<Container> {
    let c = new Container().createGeometry(type, this.scene);
    return new Observable(o => { o.next(c); o.complete() });
  }

  public animate(): void {

    const rendererLoopCallback = () => {
      this.scene.render();
    };

    if (this.wrs.document.readyState !== 'loading') {
      this.engine.runRenderLoop(rendererLoopCallback);
    } else {
      this.wrs.window.addEventListener('DOMContentLoaded', () => {
        this.engine.runRenderLoop(rendererLoopCallback);
      });
    }

    this.wrs.window.addEventListener('resize', () => {
      this.engine.resize();
    });

  }
}

