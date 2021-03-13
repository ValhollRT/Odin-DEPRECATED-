import { AppService } from 'src/app/services/index.service';
import { EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

export interface BtnFooter {
  name: string;
  event: () => void;
}

@Component({
  selector: 'popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.scss']
})
export class PopupWindowComponent implements OnInit {

  @Input() title: string;
  @Input() isOpen: boolean;
  @Input() width: number;
  @Input() buttonsFooter: BtnFooter[];
  @Output() emitCloseDialog: EventEmitter<boolean> = new EventEmitter();

  constructor(public ap: AppService) {
    this.width = this.width == undefined ? 800 : this.width;
    this.isOpen = false;
  }

  ngOnInit() { }

  closeDialog() { this.isOpen = false; this.emitCloseDialog.emit(this.isOpen); }
  openDialog() { this.isOpen = true; }

}
