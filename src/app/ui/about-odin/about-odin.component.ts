import { openAboutOdin } from './../ui.action';
import { AppState } from 'src/app/app.reducer';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PopupDialogAction } from 'src/app/models/actions/PopupDialogAction';

@Component({
  selector: 'about-odin',
  templateUrl: './about-odin.component.html',
  styleUrls: ['./about-odin.component.scss']
})
export class AboutOdinComponent implements OnInit {

  isOpen = false;
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('ui').subscribe(ui => {
      this.isOpen = ui.aboutOdin.open;
    });
  }

  closeDialog() {
    this.store.dispatch(openAboutOdin({ aboutOdin: new PopupDialogAction(false) }))
  }
}
