import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'console-debug',
  templateUrl: './console-debug.component.html',
  styleUrls: ['./console-debug.component.scss']
})
export class ConsoleDebugComponent implements OnInit {
  @ViewChild('scroller') scroller: ElementRef;

  constructor(public logService: LogService) { }

  ngOnInit(): void { }

  public onElementScroll(event) {
    this.scroller.nativeElement.scrollTop = this.scroller.nativeElement.scrollHeight;
  }


}
