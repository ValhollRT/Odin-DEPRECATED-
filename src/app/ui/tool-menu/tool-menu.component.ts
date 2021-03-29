import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppService, EngineService, LogService, SessionService } from 'src/app/services/index.service';
import { CAMERA, GEOM, LIGHT } from '../../configuration/AppConstants';
import { PopupDialogAction, ToolMenu, User } from '../../models';
import { openAboutOdin, openConsole, openLogin, openSceneSettings } from '../../store/actions';
import { AppState } from '../../store/app.reducer';

@Component({
  selector: 'tool-menu',
  templateUrl: './tool-menu.component.html',
  styleUrls: ['./tool-menu.component.scss']
})
export class ToolMenuComponent implements OnInit {

  public menus: ToolMenu[] = [];

  constructor(
    public store: Store<AppState>,
    public engineServ: EngineService,
    public appService: AppService,
    public logServ: LogService,
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
        this.engineServ.createMesh(param);
        this.logServ.log(param, "created", "ToolMenuComponent")
        break;
      case LIGHT.DIRECTIONAL: case LIGHT.SPOT: case LIGHT.POINT: case LIGHT.HEMISPHERIC:
        this.engineServ.createLight(param);
        this.logServ.log(param, "created", "ToolMenuComponent")
        break;
      case GEOM.TEXT:
        this.engineServ.createNewGeometryText();
        this.logServ.log(param, "created", "ToolMenuComponent")
        break;
      case CAMERA.ARCROTATECAMERA:
        this.engineServ.createCameraContainer(param)
        this.logServ.log(param, "created", "ToolMenuComponent")
        break;
      case 'CONSOLE':
        this.logServ.log("Console", "ToolMenuComponent", "open");
        this.store.dispatch(openConsole({ console: new PopupDialogAction(true) }))
        break;
      case 'ABOUTODIN':
        this.logServ.log("About Odin", "ToolMenuComponent", "open");
        this.store.dispatch(openAboutOdin({ aboutOdin: new PopupDialogAction(true) }))
        break;
      case 'SETTINGS':
        this.logServ.log("Settings", "ToolMenuComponent", "open");
        this.store.dispatch(openSceneSettings({ sceneSettings: new PopupDialogAction(true) }))
        break;
      case 'LOGIN':
        this.logServ.log("Login", "ToolMenuComponent", "open");
        this.store.dispatch(openLogin({ login: new PopupDialogAction(true) }))
        break;
      case 'USER_DETAILS':
        this.logServ.log("User details", "ToolMenuComponent", "open");
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
      {
        displayName: 'Camera', icon: 'icon-camera', child: [
          { displayName: 'Rotate Camera', param: CAMERA.ARCROTATECAMERA },
        ]
      },
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
