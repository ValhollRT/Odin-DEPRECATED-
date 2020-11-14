import { Component, OnInit } from '@angular/core';
import { VertexData } from 'babylonjs';
import { Mesh } from 'babylonjs/Meshes/mesh';
import { filter } from 'rxjs/operators';
import { Container } from 'src/app/engine/common/Container';
import { EngineService } from 'src/app/engine/engine.service';
import { BoxPanel } from 'src/app/models/geometry/geometry-panels';
import { CanvasHelperService } from 'src/app/services/index.service';

@Component({
  selector: 'builder-panel',
  templateUrl: './builder-panel.component.html',
  styleUrls: ['./builder-panel.component.scss']
})
export class BuilderPanelComponent implements OnInit {

  public current: Container;
  constructor(
    public engineService: EngineService
  ) { }

  ngOnInit(): void {
    this.engineService.getCurrentSelected$()
      .pipe(filter((obj: Mesh) => obj !== null && obj !== undefined))
      .subscribe((o: Mesh) => {
        this.current = this.engineService.flatMeshContainer.get(o);
      });
  }

  updateGeom() {
    let vd = this.current.rebuildMesh(this.current.panel.values);
    vd.applyToMesh(<Mesh>this.current.type, true);
    this.engineService.getCanvasHelper().updateEdgedRendering(<Mesh>(this.current.type));

  }

}
