import { Component, OnInit } from '@angular/core';
import { Color3, Light, Mesh } from 'babylonjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { EngineService } from 'src/app/engine/engine.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'light-panel',
  templateUrl: './light-panel.component.html',
  styleUrls: ['./light-panel.component.scss']
})
export class LightPanelComponent implements OnInit {

  public currentLight: Light;
  constructor(public engineService: EngineService, public logService: LogService) {

    this.engineService.getCurrentSelected$()
      .pipe(
        filter((o: any) => o instanceof Light),
        filter((light: Light) => light !== null && light !== undefined))
      .subscribe((l: Light) => {
        console.log(l);
        this.currentLight = l;
        this.logService.log(l.name, "light selected", "LightPanelComponent")
      });
  }

  ngOnInit(): void { }

  hexToRgb(value, attribute): void {
    if (attribute === "DIFFUSECOLOR") { this.currentLight.diffuse = Color3.FromHexString(value); }
    if (attribute === "SPECULARCOLOR") { this.currentLight.specular = Color3.FromHexString(value); }
  }

}
