import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { empty, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Utils } from 'src/app/engine/Utils/Utils';
import { PopupDialogAction } from 'src/app/models';
import { AudioDto } from 'src/app/models/AudioDto.model';
import { BtnFooter } from 'src/app/shared/popup-window/popup-window.component';
import { openUploadNewAudio } from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.reducer';
import { DatabaseService } from './../../services/database.service';

@Component({
  selector: 'upload-new-audio',
  templateUrl: './upload-new-audio.component.html',
  styleUrls: ['./upload-new-audio.component.scss'],
})
export class UploadNewAudioComponent implements OnInit {
  isOpen = false;
  folderId = '';
  saveBtnFooter: BtnFooter;

  constructor(
    private store: Store<AppState>,
    private databaseServ: DatabaseService
  ) {
    this.saveBtnFooter = {
      name: 'Upload Audio',
      event: this.uploadNewAudio.bind(this),
    };
  }

  ngOnInit() {
    this.store.select('ui').subscribe((ui) => {
      this.isOpen = ui.uploadNewAudio.open;
      this.folderId = ui.folderExplorerId;
    });
  }

  uploadNewAudio(): void {
    let fileData = this.formData.get('fileFormControl');
    let fileGUIDName =
      Utils.generatorUuid() + '.' + this.filename.split('.')[1];
    let ref = this.databaseServ.refAudioCloudStorage(fileGUIDName);
    let task = this.databaseServ.uploadAudioToStorage(fileGUIDName, fileData);

    task
      .percentageChanges()
      .pipe(
        switchMap((percent) => {
          this.percent = Math.round(percent);
          if (this.percent == 100) {
            this.finished = true;
            return timer(2000).pipe(switchMap(() => ref.getDownloadURL()));
          }
          return empty();
        }),
        switchMap((url) => {
          let audio: AudioDto = {
            name: this.filename,
            guid: fileGUIDName,
            url: url,
            folderId: this.folderId,
            date: new Date(),
          };
          return timer(2000).pipe(
            switchMap(() => this.databaseServ.addAudioToDatabase(audio))
          );
        })
      )
      .subscribe((val) => {});
  }

  closeDialog() {
    this.store.dispatch(
      openUploadNewAudio({ uploadNewAudio: new PopupDialogAction(false) })
    );
  }

  public fileFormGroup = new FormGroup({
    fileFormControl: new FormControl(null, Validators.required),
  });

  public formData = new FormData();
  public filename = '';
  public percent = 0;
  public finished = false;

  public changeFile(event) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.filename = event.target.files[i].name;
        this.formData.delete('fileFormControl');
        this.formData.append(
          'fileFormControl',
          event.target.files[i],
          event.target.files[i].name
        );
      }
    }
  }
}
