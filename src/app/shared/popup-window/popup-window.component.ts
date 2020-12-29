import { EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.scss']
})
export class PopupWindowComponent implements OnInit {

  @Input() title: string;
  @Input() isOpen: boolean;
  @Output() emitCloseDialog: EventEmitter<boolean> = new EventEmitter();

  constructor() { this.isOpen = false; }

  ngOnInit() { }

  closeDialog() { this.isOpen = false; this.emitCloseDialog.emit(this.isOpen); }
  openDialog() { this.isOpen = true; }

}
