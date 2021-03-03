import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Mesh, VertexData } from 'babylonjs';
import * as MeshWriter from "meshwriter";
import { AppState } from 'src/app/app.reducer';
import { Container } from 'src/app/engine/common/Container';
import { EngineService } from 'src/app/engine/engine.service';

@Component({
  selector: 'builder-panel',
  templateUrl: './builder-panel.component.html',
  styleUrls: ['./builder-panel.component.scss']
})
export class BuilderPanelComponent implements OnInit {

  public current: Container;
  constructor(
    public es: EngineService,
    public store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.pipe(select('engine')).subscribe(en => {
      if (en.UUIDCsSelected.length == 0) { this.current = undefined; return; }
      let container = this.es.getContainerFromUUID(en.UUIDCsSelected[0]);
      if (!(container.type instanceof Mesh)) this.current = undefined; else this.current = container;
    });
  }

  updateMesh() {
    let vd: VertexData = this.current.rebuildMesh(this.current.panel.values);
    vd.applyToMesh(<Mesh>this.current.type, true);
    this.es.getCanvasHelper().setBoundingBoxMesh(<Mesh>(this.current.type));
  }
}
