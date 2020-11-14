import { Input, Component, OnInit } from '@angular/core';

@Component({
  selector: 'content-panel',
  templateUrl: './content-panel.component.html',
  styleUrls: ['./content-panel.component.scss']
})
export class ContentPanelComponent implements OnInit {

  @Input() title: string;
  @Input() icon: string;
  @Input() expand: boolean;

  isExpanded: boolean = false;
  constructor() { }

  ngOnInit(): void { 
    this.isExpanded = this.expand;
  }

  collapse() { this.isExpanded = !this.isExpanded; }

}
