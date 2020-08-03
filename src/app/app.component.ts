import { Component } from '@angular/core';
import { EngineService } from './engine/engine.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Odin';
  constructor(engineService: EngineService) { }
}
