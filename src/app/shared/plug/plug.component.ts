import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Plug } from 'src/app/engine/plugs/plug';
import { PlugCamera } from 'src/app/engine/plugs/plug-camera';
import { openSidebarPanel } from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.reducer';
import { PlugMaterial } from './../../engine/plugs/plug-material';

@Component({
  selector: 'plug',
  templateUrl: './plug.component.html',
  styleUrls: ['./plug.component.scss'],
})
export class PlugComponent implements OnInit {
  @Input() plug: Plug;
  public isActiveCamera: boolean = false;
  constructor(public store: Store<AppState>) {}

  ngOnInit(): void {
    this.setActiveCamera();
  }

  openPanel() {
    this.store.dispatch(openSidebarPanel({ action: this.plug.openPanel() }));
  }

  setActiveCamera() {
    if (this.plug instanceof PlugCamera) {
      this.isActiveCamera = this.plug.active;
    }
  }

  setMaterialColor() {
    if (this.plug instanceof PlugMaterial) {
      let style = `rgb(${(<any>this.plug).diffuseColor.r * 255},
      ${(<any>this.plug).diffuseColor.g * 255},${
        (<any>this.plug).diffuseColor.b * 255
      }) !important`;
      return style;
    }
  }
}
