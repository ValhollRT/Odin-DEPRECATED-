import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/services/index.service';
import { toolMenuConf } from '../../configuration/ToolMenu.conf'
import { ToolMenu } from 'src/app/models/toolMenu';

@Component({
  selector: 'tool-menu',
  templateUrl: './tool-menu.component.html',
  styleUrls: ['./tool-menu.component.scss']
})
export class ToolMenuComponent implements OnInit {

  public menus: ToolMenu[] = toolMenuConf;
  constructor(public engine: EngineService) { }

  ngOnInit(): void { }

  createGeometry(param: string) {
    this.engine.createGeometry(param);
  }
}
