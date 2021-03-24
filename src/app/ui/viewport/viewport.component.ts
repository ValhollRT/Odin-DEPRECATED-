import {
  Component,
  ElementRef,
  NgZone, OnInit,
  ViewChild
} from '@angular/core';
import { EngineService } from '../../services/index.service';

@Component({
  selector: 'app-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss']
})
export class ViewportComponent implements OnInit {

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  public constructor(
    public ngZone: NgZone,
    private engServ: EngineService) { }

  public ngOnInit(): void {
    this.engServ.createScene(this.rendererCanvas);
    this.ngZone.runOutsideAngular(() => {
      this.engServ.animate();
    });
  }
}