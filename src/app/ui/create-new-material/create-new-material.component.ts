import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PopupDialogAction } from 'src/app/models';
import { BtnFooter } from 'src/app/shared/popup-window/popup-window.component';
import { openCreateNewMaterial } from './../../store/actions/ui.actions';
import { AppState } from './../../store/app.reducer';

@Component({
  selector: 'create-new-material',
  templateUrl: './create-new-material.component.html',
  styleUrls: ['./create-new-material.component.scss']
})
export class CreateNewMaterialComponent implements OnInit {

  isOpen = false;
  saveBtnFooter: BtnFooter;

  constructor(
    private store: Store<AppState>
  ) {
    this.saveBtnFooter = { name: "Save", event: this.createNewMaterial.bind(this) };
  }

  ngOnInit() {
    this.store.select('ui').subscribe(ui => {
      this.isOpen = ui.createNewMaterial.open;
    });
  }

  createNewMaterial(): void {
  }

  closeDialog() {
    this.store.dispatch(openCreateNewMaterial({ createNewMaterial: new PopupDialogAction(false) }))
  }
}
