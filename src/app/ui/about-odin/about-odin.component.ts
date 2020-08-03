import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'about-odin',
  templateUrl: './about-odin.component.html',
  styleUrls: ['./about-odin.component.scss']
})
export class AboutOdinComponent implements OnInit {

  isOpen = false;
  constructor(public appService: AppService) { }

  ngOnInit() {
    this.appService.isOpenAboutUs.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
  }
  closeDialog() { this.appService.isOpenAboutUs.next(false); }

}
