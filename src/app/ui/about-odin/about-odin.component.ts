import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PopupDialogAction } from 'src/app/models/actions/PopupDialogAction';
import { openAboutOdin } from './../../store/actions';
import { AppState } from './../../store/reducers/app.reducer';

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