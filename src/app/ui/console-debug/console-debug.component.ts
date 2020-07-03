import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'console-debug',
  templateUrl: './console-debug.component.html',
  styleUrls: ['./console-debug.component.scss']
})
export class ConsoleDebugComponent implements OnInit {
  @ViewChild('scroller') scroller: ElementRef;

  isExpanded: boolean = false;
  constructor(public logService: LogService) { }

  ngOnInit(): void { }

  expand() { this.isExpanded = !this.isExpanded; }

  public onElementScroll(event) {
    console.log(event);
    this.scroller.nativeElement.scrollTop = this.scroller.nativeElement.scrollHeight;
  }


}
