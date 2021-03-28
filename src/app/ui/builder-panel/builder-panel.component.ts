import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Mesh, VertexData } from 'babylonjs';
import { Container } from 'src/app/engine/common/Container';
import { EngineService } from 'src/app/services/index.service';
import { AppState } from '../../store/app.reducer';
import { ViewportComponent } from './../viewport/viewport.component';

@Component({
  selector: 'builder-panel',
  templateUrl: './builder-panel.component.html',
  styleUrls: ['./builder-panel.component.scss']
})
export class BuilderPanelComponent implements OnInit {

  public current: Container;
  constructor(
    private engineServ: EngineService,
    public store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.pipe(select('engine')).subscribe(en => {
      if (en.UUIDCsSelected.length == 0) { this.current = undefined; return; }
      let container = this.engineServ.getContainerFromUUID(en.UUIDCsSelected[0]);
      if (!(container.type instanceof Mesh)) this.current = undefined; else this.current = container;
    });
  }

  updateMesh() {
    let vd: VertexData = this.current.rebuildMesh(this.current.panel.values);
    vd.applyToMesh(<Mesh>this.current.type, true);
    ViewportComponent.setBoundingBoxText(<Mesh>(this.current.type));
  }
}