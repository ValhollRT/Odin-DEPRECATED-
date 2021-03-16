import { AppState } from 'src/app/app.reducer';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SidebarPanel } from 'src/app/models/SidebarPanelAction';
import { filter } from 'rxjs/operators';

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
  }
}
