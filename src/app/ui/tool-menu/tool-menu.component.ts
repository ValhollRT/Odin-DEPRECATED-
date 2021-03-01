import { LibraryService } from './../../services/library.service';
import { Component, OnInit } from '@angular/core';
import { ToolMenu } from 'src/app/models/toolMenu';
import { AppService, EngineService } from 'src/app/services/index.service';
import { LogService } from 'src/app/services/log.service';
import { GEOM, LIGHT } from '../../configuration/AppConstants';

@Component({
  selector: 'tool-menu',
  templateUrl: './tool-menu.component.html',
  styleUrls: ['./tool-menu.component.scss']
})
export class ToolMenuComponent implements OnInit {

  public menus: ToolMenu[] = [];

  constructor(
    public es: EngineService,
    public library: LibraryService,
    public appService: AppService,
    public logService: LogService
  ) { }

  ngOnInit(): void { this.setMenu(); }

  executeCommandMenu(param: string): void {
    switch (param) {
      case GEOM.BOX: case GEOM.CYLINDER: case GEOM.DISC: case GEOM.ICOSPHERE: case GEOM.PLANE:
      case GEOM.POLYHEDRON: case GEOM.TORUS: case GEOM.TUBE: case GEOM.RIBBON: case GEOM.SPHERE:
      case GEOM.CAPSULE:
        this.createMesh(param);
        this.logService.log(param, "created", "ToolMenuComponent")
        break;
      case LIGHT.DIRECTIONAL: case LIGHT.SPOT: case LIGHT.POINT: case LIGHT.HEMISPHERIC:
        this.createLight(param);
        this.logService.log(param, "created", "ToolMenuComponent")
        break;

      case GEOM.TEXT:
        this.createText();
        this.logService.log(param, "created", "ToolMenuComponent")
        break;
      case 'CONSOLE':
        this.openConsole();
        break;
      case 'ABOUTODIN':
        this.aboutOdin();
        break;
      default:
        break;
    }
  }

  createText() {
    this.library.createNewGeometryText();
  }

  createMesh(param: string): void {
    this.es.createMesh(param);
  }

  createLight(param: string): void {
    this.es.createLight(param);
  }

  openConsole(): void {
    this.logService.log("Console", "ToolMenuComponent", "open");
    this.appService.openConsole();
  }

  aboutOdin(): void {
    this.logService.log("About Odin", "ToolMenuComponent", "open");
    this.appService.openAboutOdin();
  }

  setMenu() {
    this.menus = [
      {
        displayName: 'Geometry', icon: 'icon-geometry', child: [
          { displayName: 'Box', param: GEOM.BOX },
          { displayName: 'Cylinder', param: GEOM.CYLINDER },
          { displayName: 'Disc', param: GEOM.DISC },
          { displayName: 'Icosphere', param: GEOM.ICOSPHERE },
          { displayName: 'Plane', param: GEOM.PLANE },
          { displayName: 'Polyhedron', param: GEOM.POLYHEDRON },
          { displayName: 'Torus', param: GEOM.TORUS },
          { displayName: 'Capsule', param: GEOM.CAPSULE },
          { displayName: 'Sphere', param: GEOM.SPHERE },
          { displayName: 'Text', param: GEOM.TEXT },
        ]
      },
      {
        displayName: 'Light', icon: 'icon-light', child: [
          { displayName: 'Directional', param: LIGHT.DIRECTIONAL },
          { displayName: 'Spot', param: LIGHT.SPOT },
          { displayName: 'Point', param: LIGHT.POINT },
          { displayName: 'Hemispheric', param: LIGHT.HEMISPHERIC }
        ]
      },
      /*
      {
        displayName: 'Functions', icon: 'icon-light', child: [
          { displayName: 'TextBox', param: "TEXTBOX" },
          { displayName: 'FollowUp', param: "FOLLOWUP" },
          { displayName: 'ScreenSize', param: "SCREENSIZE" },
          { displayName: 'Clone', param: "CLONE" },
          { displayName: 'Arrange', param: "ARRANGE" },
          { displayName: 'Mask', param: "MASK" }
        ]
      },
      */
      { displayName: "Console", icon: 'icon-console', param: "CONSOLE" },
      { displayName: "About Odin", icon: 'icon-info', param: "ABOUTODIN" }
    ];
  }


}
