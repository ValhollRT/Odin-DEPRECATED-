import { SessionService } from './../../services/session.service';
import { LibraryService } from './../../services/library.service';
import { Component, OnInit } from '@angular/core';
import { ToolMenu } from 'src/app/models/ToolMenu';
import { AppService, EngineService } from 'src/app/services/index.service';
import { LogService } from 'src/app/services/log.service';
import { GEOM, LIGHT } from '../../configuration/AppConstants';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { User } from 'src/app/models/User';

@Component({
  selector: 'tool-menu',
  templateUrl: './tool-menu.component.html',
  styleUrls: ['./tool-menu.component.scss']
})
export class ToolMenuComponent implements OnInit {

  public menus: ToolMenu[] = [];

  constructor(
    public store: Store<AppState>,
    public es: EngineService,
    public library: LibraryService,
    public appService: AppService,
    public logService: LogService,
    public sessionService: SessionService
  ) { this.setMenu(); }

  ngOnInit(): void {
    this.store.select('session').subscribe(session => {
      this.authenticateUserMenu(session.user);
    });
  }

  executeCommandMenu(param: string): void {
    switch (param) {
      case GEOM.BOX: case GEOM.CYLINDER: case GEOM.DISC: case GEOM.ICOSPHERE: case GEOM.PLANE:
      case GEOM.POLYHEDRON: case GEOM.TORUS: case GEOM.TUBE: case GEOM.RIBBON: case GEOM.SPHERE:
      case GEOM.CAPSULE: case GEOM.GROUP:
        this.es.createMesh(param);
        this.logService.log(param, "created", "ToolMenuComponent")
        break;
      case LIGHT.DIRECTIONAL: case LIGHT.SPOT: case LIGHT.POINT: case LIGHT.HEMISPHERIC:
        this.es.createLight(param);
        this.logService.log(param, "created", "ToolMenuComponent")
        break;
      case GEOM.TEXT:
        this.library.createNewGeometryText();
        this.logService.log(param, "created", "ToolMenuComponent")
        break;
      case 'CONSOLE':
        this.logService.log("Console", "ToolMenuComponent", "open");
        this.appService.openConsole();
        break;
      case 'ABOUTODIN':
        this.logService.log("About Odin", "ToolMenuComponent", "open");
        this.appService.openAboutOdin();
        break;
      case 'SETTINGS':
        this.logService.log("Settings", "ToolMenuComponent", "open");
        this.appService.openSettings();
        break;
      case 'LOGIN':
        this.logService.log("Login", "ToolMenuComponent", "open");
        this.appService.openLogin();
        break;
      case 'USER_DETAILS':
        this.logService.log("User details", "ToolMenuComponent", "open");
        break;
      case 'SIGNOUT':
        this.sessionService.signOut();
        break;
      default:
        break;
    }
  }

  setMenu() {
    this.menus = [
      {
        displayName: "User", icon: 'icon-user', child: [
          { displayName: 'Login', param: "LOGIN" },
        ]
      },
      {
        displayName: 'Geometry', icon: 'icon-geometry', child: [
          { displayName: 'Group', param: "GROUP" },
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
      { displayName: "Settings", icon: 'icon-settings', param: "SETTINGS" },
      { displayName: "Console", icon: 'icon-console', param: "CONSOLE" },
      { displayName: "About Odin", icon: 'icon-info', param: "ABOUTODIN" }
    ];
  }

  authenticateUserMenu(user: User) {
    if (user == undefined) {
      this.menus[0].child = [{ displayName: 'Login', param: "LOGIN" }];
    } else {
      this.menus[0].child = [
        { displayName: user.name != undefined ? user.name : user.email, param: "" },
        { displayName: "Sign out", param: "SIGNOUT" }
      ];
    };

  }

}
