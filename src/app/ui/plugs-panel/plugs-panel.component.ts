import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'plugs-panel',
  templateUrl: './plugs-panel.component.html',
  styleUrls: ['./plugs-panel.component.scss']
})
export class PlugsPanelComponent implements OnInit {

  @Input() plugs: any;
  constructor() { }

  ngOnInit(): void { }

  executeFn(plug: any): void {
    plug.fn(plug.param);
  }
}
