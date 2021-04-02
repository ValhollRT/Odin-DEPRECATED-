import { Component, Input, OnInit } from '@angular/core';
import { CAMERA, GEOM, LIGHT } from 'src/app/configuration/AppConstants';
import { EngineService } from 'src/app/services/engine.service';

@Component({
  selector: 'plugs-panel',
  templateUrl: './plugs-panel.component.html',
  styleUrls: ['./plugs-panel.component.scss']
})
export class PlugsPanelComponent implements OnInit {

  @Input() plugs: any;
  constructor(private engineServ: EngineService) { }

  ngOnInit(): void { }

  executeCommandMenu(param: string): void {
    switch (param) {
      case GEOM.BOX: case GEOM.CYLINDER: case GEOM.DISC: case GEOM.ICOSPHERE: case GEOM.PLANE:
      case GEOM.POLYHEDRON: case GEOM.TORUS: case GEOM.TUBE: case GEOM.RIBBON: case GEOM.SPHERE:
      case GEOM.CAPSULE: case GEOM.GROUP:
        this.engineServ.createMesh(param);
        break;
      case LIGHT.DIRECTIONAL: case LIGHT.SPOT: case LIGHT.POINT: case LIGHT.HEMISPHERIC:
        this.engineServ.createLight(param);
        break;
      case GEOM.TEXT:
        this.engineServ.createNewGeometryText();
        break;
      case CAMERA.ARCROTATECAMERA:
        this.engineServ.createCameraContainer(param)
        break;
      default:
        break;
    }
  }
}
