import { DatabaseService } from './../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PopupDialogAction } from 'src/app/models';
import { BtnFooter } from 'src/app/shared/popup-window/popup-window.component';
import { openUploadNewImage } from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'upload-new-image',
  templateUrl: './upload-new-image.component.html',
  styleUrls: ['./upload-new-image.component.scss']
})
export class UploadNewImageComponent implements OnInit {

  isOpen = false;
  saveBtnFooter: BtnFooter;

  constructor(
    private store: Store<AppState>,
    private databaseServ: DatabaseService

  ) {
    this.saveBtnFooter = { name: "Save", event: this.uploadNewImage.bind(this) };
  }

  ngOnInit() {
    this.store.select('ui').subscribe(ui => {
      this.isOpen = ui.uploadNewImage.open;
    });
  }

  uploadNewImage(): void {
    this.subirArchivo();
  }

  closeDialog() {
    this.store.dispatch(openUploadNewImage({ uploadNewImage: new PopupDialogAction(false) }))
  }

  public archivoForm = new FormGroup({
    archivo: new FormControl(null, Validators.required),
  });
  public mensajeArchivo = 'No hay un archivo seleccionado';
  public datosFormulario = new FormData();
  public nombreArchivo = '';
  public URLPublica = '';
  public porcentaje = 0;
  public finalizado = false;

  //Evento que se gatilla cuando el input de tipo archivo cambia
  public cambioArchivo(event) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.mensajeArchivo = `Archivo preparado: ${event.target.files[i].name}`;
        this.nombreArchivo = event.target.files[i].name;
        this.datosFormulario.delete('archivo');
        this.datosFormulario.append('archivo', event.target.files[i], event.target.files[i].name)
      }
    } else {
      this.mensajeArchivo = 'No hay un archivo seleccionado';
    }
  }

  //Sube el archivo a Cloud Storage
  public subirArchivo() {
    let archivo = this.datosFormulario.get('archivo');
    let referencia = this.databaseServ.referenciaCloudStorage(this.nombreArchivo);
    let tarea = this.databaseServ.tareaCloudStorage(this.nombreArchivo, archivo);

    //Cambia el porcentaje
    tarea.percentageChanges().subscribe((porcentaje) => {
      this.porcentaje = Math.round(porcentaje);
      if (this.porcentaje == 100) {
        this.finalizado = true;
        console.log("archivo -- " ,archivo, "referencia -- ", referencia, "tarea -- ", tarea);
      }
    });

    referencia.getDownloadURL().subscribe((URL) => {
      this.URLPublica = URL;
    });
  }

}
