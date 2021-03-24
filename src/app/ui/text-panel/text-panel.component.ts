import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Mesh } from 'babylonjs';
import { filter, map } from 'rxjs/operators';
import { Container } from 'src/app/engine/common/Container';
import { AppState } from '../../store/app.reducer';
import { EngineService, LogService } from './../../services/index.service';

@Component({
  selector: 'text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
export class TextPanelComponent implements OnInit {


  @ViewChild('text', { static: true }) text: ElementRef;
  public current: Container;
  public Writer;
  public textMesh;

  constructor(public store: Store<AppState>,
    public ls: LogService,
    public es: EngineService) { }

  ngOnInit(): void {
    this.store.pipe(select('engine'),
      filter(selection => selection.UUIDCsSelected.length > 0),
      filter(sel => this.es.getContainerFromUUID(sel.UUIDCsSelected[0]).type instanceof Mesh),
      map(s => this.es.getContainerFromUUID(s.UUIDCsSelected[0])),
      filter(c => c.isText))
      .subscribe((c: Container) => {
        this.current = c;
        this.text.nativeElement.value = c.text.value;
        this.ls.log(c.name, "edited text Type", "TextPanelComponent")
      });
  }

  updateText() {
    this.current.text.value = this.text.nativeElement.value;
    this.current.text.updateText();
    this.es.getCanvasHelper().setBoundingBoxText(<Mesh>(this.current.type));
  }

  setHorizontalAlign(i: number) {
    this.current.text.halign = i;
    this.updateText();
  }

  setVerticalAlign(i: number) {
    this.current.text.valign = i;
    this.updateText();
  }
}