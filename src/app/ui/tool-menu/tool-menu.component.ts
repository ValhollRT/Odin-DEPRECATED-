import { Component, OnInit } from '@angular/core';
import { EngineService, AppService } from 'src/app/services/index.service';
import { ToolMenu } from 'src/app/models/toolMenu';
import { GEOM } from '../../configuration/appConstants'
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'tool-menu',
  templateUrl: './tool-menu.component.html',
  styleUrls: ['./tool-menu.component.scss']
})
export class ToolMenuComponent implements OnInit {

  public menus: ToolMenu[] = [];

  constructor(
    public engine: EngineService,
    public appService: AppService,
    public logService: LogService
  ) { }

  ngOnInit(): void { this.setMenu(); }

  executeCommandMenu(param: string): void {
    switch (param) {
      case GEOM.BOX: case GEOM.CYLINDER: case GEOM.DISC: case GEOM.ICOSPHERE: case GEOM.PLANE:
      case GEOM.POLYHEDRON: case GEOM.TORUS: case GEOM.TUBE: case GEOM.RIBBON: case GEOM.SPHERE:
        this.createGeometry(param);
        break;
      case 'ABOUTODIN':
        this.aboutOdin();
      default:
        break;
    }
  }
  createGeometry(param: string): void {
    console.log(param);
    this.engine.createGeometry(param);
  }

  aboutOdin(): void {
    this.logService.log("Open About Odin");
    this.appService.openAboutOdin();
  }

  setMenu() {
    this.menus = [
      {
        displayName: 'Geometry', child: [
          { displayName: 'Box', param: GEOM.BOX },
          { displayName: 'Cylinder', param: GEOM.CYLINDER },
          { displayName: 'Disc', param: GEOM.DISC },
          { displayName: 'Icosphere', param: GEOM.ICOSPHERE },
          { displayName: 'Plane', param: GEOM.PLANE },
          { displayName: 'Polyhedron', param: GEOM.POLYHEDRON },
          { displayName: 'Torus', param: GEOM.TORUS },
          { displayName: 'Tube', param: GEOM.TUBE },
          { displayName: 'Ribbon', param: GEOM.RIBBON },
          { displayName: 'Sphere', param: GEOM.SPHERE },
        ]
      },
      {
        displayName: 'Functions', child: [
          { displayName: 'TextBox', param: "TEXTBOX" },
          { displayName: 'FollowUp', param: "FOLLOWUP" },
          { displayName: 'ScreenSize', param: "SCREENSIZE" }
        ]
      },
      { displayName: "About Odin", param: "ABOUTODIN" }
    ];
  }


}
