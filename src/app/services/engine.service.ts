import { Injectable, ElementRef } from '@angular/core';
import { EngineCore } from '../engine/EngineCore';
import { WindowService } from './window.service';
import { Scene } from 'babylonjs';
import { LogService } from './log.service';


@Injectable({
  providedIn: 'root',
})
export class EngineService {

  public engineCore: EngineCore
  constructor(wrs: WindowService, ls: LogService) {
    this.engineCore = new EngineCore(wrs, ls);
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.engineCore.createScene(canvas);
  }
  public animate(): void {
    this.engineCore.animate();
  }

  public createGeometry(param: string): void {
    this.engineCore.createGeometry(param);
  }

  public getScene(): Scene {
    return this.engineCore.getScene();
  }
}

