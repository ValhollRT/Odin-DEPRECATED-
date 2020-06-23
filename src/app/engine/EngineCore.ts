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
} from 'babylonjs';
import 'babylonjs-materials';
import { Grid } from './helpers/Grid';
import { Container } from './common/Container';
import { LogService } from '../services/log.service';
import { AxisHelper } from './helpers/AxisHelper';

export class EngineCore {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: ArcRotateCamera;
  private scene: Scene;
  private grid: Grid;
  private startingPoint: any;
  private currentMesh: any;
  private pickInfo: any;
  private axisHelper: AxisHelper;
  private gizmoManager: GizmoManager;

  public constructor(public wrs: WindowRefService, public ls: LogService) { }

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

    // Events
    var _canvas = this.engine.getRenderingCanvas();

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

    var getGroundPosition = () => {
      // Use a predicate to get position on the ground
      this.pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
      if (this.pickInfo.hit) {
        return this.pickInfo.pickedPoint;
      }

      return null;
    }

    var onPointerDown = (ev) => {
      if (ev.button !== 0) return;
      // check if we are under a mesh
      this.pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, mesh => mesh !== this.grid.ground && mesh !== this.axisHelper);
      if (this.pickInfo.hit) {
        this.currentMesh = this.pickInfo.pickedMesh;
        this.startingPoint = getGroundPosition();
        if (this.startingPoint) { // we need to disconnect camera from canvas
          setTimeout(() => {
            this.camera.detachControl(_canvas);
          }, 0);
        }
      }
    }

    var onPointerUp = () => {
      if (this.startingPoint) {
        this.camera.attachControl(_canvas, true);
        this.startingPoint = null;
        return;
      }
    }

    var onPointerMove = () => {
      if (!this.startingPoint) return;

      var current = getGroundPosition();
      if (!current) return;

      var diff = current.subtract(this.startingPoint);
      this.currentMesh.position.addInPlace(diff);
      this.startingPoint = current;
    }

    this.canvas.addEventListener("pointerdown", onPointerDown, false);
    this.canvas.addEventListener("pointerup", onPointerUp, false);
    this.canvas.addEventListener("pointermove", onPointerMove, false);

    this.scene.onDispose = () => {
      this.canvas.removeEventListener("pointerdown", onPointerDown);
      this.canvas.removeEventListener("pointerup", onPointerUp);
      this.canvas.removeEventListener("pointermove", onPointerMove);
    }

    this.scene.registerAfterRender(() => { });

  }

  public getScene(): Scene {
    return this.scene
  }

  public createGeometry(type: string) {
    let c = new Container().createGeometry(type, this.scene);
    let container = {
      uid: c.UID,
      name: c.mesh.name
    };
    this.ls.log(container);
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

