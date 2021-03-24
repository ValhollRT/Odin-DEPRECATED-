import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { PopupDialogAction } from 'src/app/models/actions/PopupDialogAction';
import { openConsole } from '../../store/actions';
import { AppState } from '../../store/reducers/app.reducer';
import { LogService } from './../../services/index.service';

@Component({
  selector: 'console-debug',
  templateUrl: './console-debug.component.html',
  styleUrls: ['./console-debug.component.scss']
})
export class ConsoleDebugComponent implements OnInit {

  @ViewChild('scroller') scroller: ElementRef;

  isOpen = false;

  constructor(public store: Store<AppState>, public logService: LogService) { }

  ngOnInit() {
    this.store.select('ui').subscribe(ui => {
      this.isOpen = ui.console.open;
    });
  }

  closeDialog() {
    this.store.dispatch(openConsole({ console: new PopupDialogAction(false) }))
  }

  public onElementScroll(event) {
    this.scroller.nativeElement.scrollTop = this.scroller.nativeElement.scrollHeight;
  }

  clearConsole = () => this.logService.bufferLogConsole = [];
}