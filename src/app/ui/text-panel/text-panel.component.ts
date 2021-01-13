import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Mesh } from 'babylonjs';
import * as MeshWriter from "meshwriter";
import { AppState } from 'src/app/app.reducer';
import { Container } from 'src/app/engine/common/Container';
import { EngineService } from 'src/app/engine/engine.service';
import { Text } from '../../engine/Text/Text';
import { Font } from '../../engine/Text/Font';

@Component({
  selector: 'text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
export class TextPanelComponent implements OnInit {


  @ViewChild('text', { static: false }) text: ElementRef;
  @ViewChild('hJust', { static: false }) hJust: ElementRef;
  @ViewChild('vJust', { static: false }) vJust: ElementRef;
  public current: Container;
  public Writer;
  public textMesh;

  constructor(public store: Store<AppState>,
    public es: EngineService) {
    this.Writer = MeshWriter(this.es.getScene(), { scale: 1, defaultFont: "Arial" });
  }

  ngOnInit(): void {
    this.store.pipe(select('engine')).subscribe(en => {
      if (en.UUIDCsSelected.length == 0) { this.current = undefined; return; }
      let container = this.es.getContainerFromUUID(en.UUIDCsSelected[0]);
      if (!container.isText) return;
      if (!(container.type instanceof Mesh)) this.current = undefined; else this.current = container;
    });
  }

  updateText() {

  }
}