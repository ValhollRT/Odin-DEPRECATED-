import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Mesh, VertexData } from 'babylonjs';
import { filter, map } from 'rxjs/operators';
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
    public engineService: EngineService,
    public store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.pipe(select('engine'),
      filter(selection => selection.UUIDCsSelected.length > 0),
      filter(sel => this.engineService.getContainerFromUUID(sel.UUIDCsSelected[0]).type instanceof Mesh),
      map(s => this.engineService.getContainerFromUUID(s.UUIDCsSelected[0]).type))
      .subscribe((o: Mesh) => {
        this.current = this.engineService.typeToContainer.get(o);
      });
  }

  updateGeom() {
    let vd: VertexData = this.current.rebuildMesh(this.current.panel.values);
    vd.applyToMesh(<Mesh>this.current.type, true);
    this.engineService.getCanvasHelper().updateEdgedRendering(<Mesh>(this.current.type));
  }

}
