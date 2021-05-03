import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { VertexData } from 'babylonjs';
import { PlugGeometry } from 'src/app/engine/plugs/plug-geometry';
import { AppService } from 'src/app/services/index.service';
import { AppState } from '../../store/app.reducer';
import { PlugText } from './../../engine/plugs/plug-text';

@Component({
  selector: 'builder-panel',
  templateUrl: './builder-panel.component.html',
  styleUrls: ['./builder-panel.component.scss']
})
export class BuilderPanelComponent implements OnInit {

  public selected: PlugGeometry;
  public isPlugText: boolean;

  constructor(
    private appService: AppService,
    public store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.pipe(select('engine')).subscribe(en => {
      if (en.uuidCsSelected.length == 0) { this.selected = undefined; return; }
      let container = this.appService.getContainerFromUuid(en.uuidCsSelected[0]);
      this.selected = container.getPlugGeometry();
      this.isPlugText = this.selected instanceof PlugText
    });
  }

  updateMesh() {
    let vd: VertexData = this.selected.rebuildMesh(this.selected.panel.values);
    vd.applyToMesh(this.selected, true);
  }
}