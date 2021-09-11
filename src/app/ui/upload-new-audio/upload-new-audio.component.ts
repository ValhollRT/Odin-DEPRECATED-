import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PopupDialogAction } from 'src/app/models';
import { BtnFooter } from 'src/app/shared/popup-window/popup-window.component';
import { openUploadNewAudio } from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'upload-new-audio',
  templateUrl: './upload-new-audio.component.html',
  styleUrls: ['./upload-new-audio.component.scss']
})
export class UploadNewAudioComponent implements OnInit {

  isOpen = false;
  saveBtnFooter: BtnFooter;

  constructor(
    private store: Store<AppState>
  ) {
    this.saveBtnFooter = { name: "Save", event: this.uploadNewAudio.bind(this) };
  }

  ngOnInit() {
    this.store.select('ui').subscribe(ui => {
      this.isOpen = ui.uploadNewAudio.open;
    });
  }

  uploadNewAudio(): void {
  }

  closeDialog() {
    this.store.dispatch(openUploadNewAudio({ uploadNewAudio: new PopupDialogAction(false) }))
  }
}
