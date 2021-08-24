import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogConfirmarComponent } from '../psico/dialogs/dialog-confirmar/dialog-confirmar.component';
import { DialogFracasoComponent } from '../psico/dialogs/dialog-fracaso/dialog-fracaso.component';
import { DialogExitoComponent } from '../psico/dialogs/dialog-exito/dialog-exito.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor( public dialog: MatDialog,) { }

  dialogConfirmar() {
    return this.dialog.open(DialogConfirmarComponent)
  }

  dialogExito() {
    return this.dialog.open(DialogExitoComponent)
  }

  dialogFracaso() {
    return this.dialog.open(DialogFracasoComponent)
  }
}
