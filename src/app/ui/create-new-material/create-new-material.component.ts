import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PopupDialogAction } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';
import { BtnFooter } from 'src/app/shared/popup-window/popup-window.component';
import { openCreateNewMaterial } from './../../store/actions/ui.actions';
import { AppState } from './../../store/app.reducer';

export interface NewMaterial {
  name: string;
  diffuseColor: string;
}
@Component({
  selector: 'create-new-material',
  templateUrl: './create-new-material.component.html',
  styleUrls: ['./create-new-material.component.scss'],
})
export class CreateNewMaterialComponent implements OnInit {
  isOpen = false;
  saveBtnFooter: BtnFooter;
  public newMaterial = {
    name: 'New Material',
    diffuseColor: '#333333',
  } as NewMaterial;
  folderId: any = undefined;

  constructor(
    private store: Store<AppState>,
    private databaseServ: DatabaseService
  ) {
    this.saveBtnFooter = {
      name: 'Save',
      event: this.createNewMaterial.bind(this),
    };
  }

  ngOnInit() {
    this.store.select('ui').subscribe((ui) => {
      this.isOpen = ui.createNewMaterial.open;
    });
  }

  createNewMaterial() {
    return this.databaseServ.saveNewMaterial(this.newMaterial);
  }

  closeDialog() {
    this.store.dispatch(
      openCreateNewMaterial({ createNewMaterial: new PopupDialogAction(false) })
    );
  }
}
