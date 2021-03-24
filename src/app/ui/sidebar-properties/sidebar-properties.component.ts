import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { SidebarPanel } from 'src/app/models/actions/SidebarPanelAction';
import { AppState } from '../../store/reducers/app.reducer';

@Component({
  selector: 'sidebar-properties',
  templateUrl: './sidebar-properties.component.html',
  styleUrls: ['./sidebar-properties.component.scss']
})
export class SidebarPropertiesComponent implements OnInit {

  expandTransformation: boolean = false;
  expandGeometry: boolean = false;
  expandMaterial: boolean = false;
  expandLight: boolean = false;
  expandCamera: boolean = false;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.pipe(select('ui'), filter(v => v.action !== undefined))
      .subscribe(ui => {
        this.collapseAllPanels();
        switch (ui.action.panel) {
          case SidebarPanel.TRANSFORMATION:
            this.expandTransformation = true;
            break;
          case SidebarPanel.GEOMETRY:
            this.expandGeometry = true;
            break;
          case SidebarPanel.MATERIAL:
            this.expandMaterial = true;
            break;
          case SidebarPanel.LIGHT:
            this.expandLight = true;
            break;
          case SidebarPanel.CAMERA:
            this.expandCamera = true;
            break;
          default:
            break;
        }
      });
  }

  collapseAllPanels() {
    this.expandTransformation = false;
    this.expandGeometry = false;
    this.expandMaterial = false;
    this.expandLight = false;
    this.expandCamera = false;
  }
}