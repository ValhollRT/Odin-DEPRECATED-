import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { empty } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Utils } from 'src/app/engine/Utils/Utils';
import { PopupDialogAction } from 'src/app/models';
import { FontDto } from 'src/app/models/FontDto.model';
import { BtnFooter } from 'src/app/shared/popup-window/popup-window.component';
import { openUploadNewFont } from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.reducer';
import { DatabaseService } from './../../services/database.service';

@Component({
  selector: 'upload-new-font',
  templateUrl: './upload-new-font.component.html',
  styleUrls: ['./upload-new-font.component.scss'],
})
export class UploadNewFontComponent implements OnInit {
  isOpen = false;
  folderId = '';
  saveBtnFooter: BtnFooter;

  constructor(
    private store: Store<AppState>,
    private databaseServ: DatabaseService
  ) {
    this.saveBtnFooter = {
      name: 'Upload Font',
      event: this.uploadNewFont.bind(this),
    };
  }

  ngOnInit() {
    this.store.select('ui').subscribe((ui) => {
      this.isOpen = ui.uploadNewFont.open;
      this.folderId = ui.folderExplorerId;
    });
  }

  uploadNewFont(): void {
    let fileData = this.formData.get('fileFormControl');
    let fileGUIDName =
      Utils.generatorUuid() + '.' + this.filename.split('.')[1];
    let ref = this.databaseServ.refFontCloudStorage(fileGUIDName);
    let task = this.databaseServ.uploadFontToStorage(fileGUIDName, fileData);

    task
      .percentageChanges()
      .pipe(
        switchMap((percent) => {
          this.percent = Math.round(percent);
          if (this.percent == 100) {
            this.finished = true;
            return ref.getDownloadURL();
          }
          return empty();
        }),
        switchMap((url) => {
          let font: FontDto = {
            name: this.filename,
            guid: fileGUIDName,
            url: url,
            folderId: this.folderId,
            date: new Date(),
          };
          return this.databaseServ.addFontToDatabase(font);
        })
      )
      .subscribe((url) => {});
  }

  closeDialog() {
    this.store.dispatch(
      openUploadNewFont({ uploadNewFont: new PopupDialogAction(false) })
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
