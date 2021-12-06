import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-comentario',
  templateUrl: './dialog-comentario.component.html',
  styleUrls: ['./dialog-comentario.component.css']
})
export class DialogComentarioComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogComentarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  mensaje: string = ""

  ngOnInit(): void {
    this.mensaje = this.data.mensaje
  }

}
