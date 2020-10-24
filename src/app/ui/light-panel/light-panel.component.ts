import { Component, OnInit } from '@angular/core';
import { Color3, Light } from 'babylonjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { EngineService } from 'src/app/engine/engine.service';

@Component({
  selector: 'light-panel',
  templateUrl: './light-panel.component.html',
  styleUrls: ['./light-panel.component.scss']
})
export class LightPanelComponent implements OnInit {

  public currentLight: Light;
  constructor(public engineService: EngineService) {

    this.engineService.getCurrentLightSelected()
      .pipe(filter((light: Light) => light !== null && light !== undefined))
      .pipe(distinctUntilChanged())
      .subscribe((l: Light) => {
        this.currentLight = l;
      });

  }

  ngOnInit(): void { }

  hexToRgb(value, attribute): void {
    if (attribute === "DIFFUSECOLOR") { this.currentLight.diffuse = Color3.FromHexString(value); }
    if (attribute === "SPECULARCOLOR") { this.currentLight.specular = Color3.FromHexString(value); }
  }

}
