import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PopupDialogAction } from 'src/app/models';
import { BtnFooter } from 'src/app/shared/popup-window/popup-window.component';
import { openUploadNewFont } from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'upload-new-font',
  templateUrl: './upload-new-font.component.html',
  styleUrls: ['./upload-new-font.component.scss']
})
export class UploadNewFontComponent implements OnInit {

  isOpen = false;
  saveBtnFooter: BtnFooter;

  constructor(
    private store: Store<AppState>
  ) {
    this.saveBtnFooter = { name: "Save", event: this.uploadNewFont.bind(this) };
  }

  ngOnInit() {
    this.store.select('ui').subscribe(ui => {
      this.isOpen = ui.uploadNewFont.open;
    });
  }

  uploadNewFont(): void {
  }

  closeDialog() {
    this.store.dispatch(openUploadNewFont({ uploadNewFont: new PopupDialogAction(false) }))
  }

}
