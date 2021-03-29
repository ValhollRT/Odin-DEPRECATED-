import { Component, Input, OnInit } from '@angular/core';
import { AlertType } from '../../models/AlertType.model';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() message: string;
  @Input() inline: boolean;
  @Input() type: AlertType;

  constructor() { }

  ngOnInit(): void { }

}
