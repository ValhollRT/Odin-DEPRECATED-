import { Component, OnInit } from '@angular/core';
import { CAMERA, GEOM, LIGHT } from 'src/app/configuration/AppConstants';
import { EngineService } from 'src/app/services/engine.service';
import { LogService } from 'src/app/services/index.service';

@Component({
  selector: 'tabs-plugs-panel',
  templateUrl: './tabs-plugs-panel.component.html',
  styleUrls: ['./tabs-plugs-panel.component.scss']
})
export class TabsPlugsPanelComponent implements OnInit {

  public plugs;

  constructor(
    private engineServ: EngineService,
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
      }
    ];
  }
}
