import { Component, OnInit } from '@angular/core';
import { CAMERA, GEOM, LIGHT } from 'src/app/configuration/app-constants';
import { AppService, LogService } from 'src/app/services/index.service';

@Component({
  selector: 'tabs-plugs-panel',
  templateUrl: './tabs-plugs-panel.component.html',
  styleUrls: ['./tabs-plugs-panel.component.scss']
})
export class TabsPlugsPanelComponent implements OnInit {

  public plugs;

  constructor(
    private appServ: AppService,
    private logServ: LogService
  ) {
    this.setMenu();
  }

  ngOnInit(): void {
  }

  setMenu() {
    this.plugs = [
      {
        displayName: 'Geometry', icon: 'icon-geometry', child: [
          { displayName: 'Box', param: GEOM.BOX, fn: (param) => { this.appServ.addPlugGeometry(param) } },
          { displayName: 'Cylinder', param: GEOM.CYLINDER, fn: (param) => { this.appServ.addPlugGeometry(param) } },
          { displayName: 'Disc', param: GEOM.DISC, fn: (param) => { this.appServ.addPlugGeometry(param) } },
          { displayName: 'Icosphere', param: GEOM.ICOSPHERE, fn: (param) => { this.appServ.addPlugGeometry(param) } },
          { displayName: 'Plane', param: GEOM.PLANE, fn: (param) => { this.appServ.addPlugGeometry(param) } },
          { displayName: 'Polyhedron', param: GEOM.POLYHEDRON, fn: (param) => { this.appServ.addPlugGeometry(param) } },
          { displayName: 'Torus', param: GEOM.TORUS, fn: (param) => { this.appServ.addPlugGeometry(param) } },
          { displayName: 'Capsule', param: GEOM.CAPSULE, fn: (param) => { this.appServ.addPlugGeometry(param) } },
          { displayName: 'Sphere', param: GEOM.SPHERE, fn: (param) => { this.appServ.addPlugGeometry(param) } },
          // { displayName: 'Text', param: GEOM.TEXT, fn: (param) => { this.appServ.addPlugText() } },
        ]
      },
      {
        displayName: 'Light', icon: 'icon-light', child: [
          { displayName: 'Directional', param: LIGHT.DIRECTIONAL, fn: (param) => { this.appServ.addPlugLight(param) } },
          { displayName: 'Spot', param: LIGHT.SPOT, fn: (param) => { this.appServ.addPlugLight(param) } },
          { displayName: 'Point', param: LIGHT.POINT, fn: (param) => { this.appServ.addPlugLight(param) } },
          { displayName: 'Hemispheric', param: LIGHT.HEMISPHERIC, fn: (param) => { this.appServ.addPlugLight(param) } }
        ]
      },
      {
        displayName: 'Camera', icon: 'icon-camera', child: [
          { displayName: 'Rotate Camera', param: CAMERA.ARCROTATECAMERA, fn: (param) => { this.appServ.addPlugCamera() } },
        ]
      }
    ];
  }
}
