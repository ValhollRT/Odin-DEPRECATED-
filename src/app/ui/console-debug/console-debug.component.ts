import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/index.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'console-debug',
  templateUrl: './console-debug.component.html',
  styleUrls: ['./console-debug.component.scss']
})
export class ConsoleDebugComponent implements OnInit {

  @ViewChild('scroller') scroller: ElementRef;

  isOpen = false;

  constructor(public appService: AppService, public logService: LogService) { }

  ngOnInit() {
    console.log("console init");
    this.appService.isOpenConsole.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
  }
  public onElementScroll(event) {
    this.scroller.nativeElement.scrollTop = this.scroller.nativeElement.scrollHeight;
  }
  clearConsole() {
    this.logService.bufferLogConsole = [];
  }

  closeDialog() { console.log("close console"); this.appService.isOpenConsole.next(false); }
}
