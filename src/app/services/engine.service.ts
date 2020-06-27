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
  constructor(wrs: WindowService, public ls: LogService) {
    this.engineCore = new EngineCore(wrs);
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.engineCore.createScene(canvas);
  }
  public animate(): void {
    this.engineCore.animate();
  }

  public createGeometry(param: string): void {
    this.engineCore.createGeometry(param).subscribe(c => {
      let container = {
        uid: c.UID,
        name: c.mesh.name
      };
      this.ls.log(container);
    });
  }

  public getScene(): Scene {
    return this.engineCore.getScene();
  }


}

