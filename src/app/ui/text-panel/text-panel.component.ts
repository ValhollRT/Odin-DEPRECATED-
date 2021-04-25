import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppService } from 'src/app/services/index.service';
import { Container } from 'src/app/shared/container/container';
import { AppState } from '../../store/app.reducer';
import { ViewportComponent } from '../viewport/viewport.component';
import { PlugText } from './../../engine/plugs/plug-text';
import { EngineService, LogService } from './../../services/index.service';

@Component({
  selector: 'text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
export class TextPanelComponent implements OnInit {

  @ViewChild('text', { static: true }) text: ElementRef;
  @Input() plugText: PlugText;

  public current: Container;
  public Writer;
  public textMesh;

  constructor(
    public store: Store<AppState>,
    public ls: LogService,
    public appServ: AppService,
    public engineServ: EngineService) { }

  ngOnInit(): void {
    this.text.nativeElement.value = this.plugText.text.value;
  }

  updateText() {
    this.plugText.text.value = this.text.nativeElement.value;
    this.plugText.text.updateText();
    ViewportComponent.setBoundingBoxText(this.plugText);
  }

  setHorizontalAlign(i: number) {
    this.plugText.text.halign = i;
    this.updateText();
  }

  setVerticalAlign(i: number) {
    this.plugText.text.valign = i;
    this.updateText();
  }
}