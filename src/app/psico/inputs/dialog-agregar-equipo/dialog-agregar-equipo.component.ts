import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


interface data {
  tagEquipo: string,
  tipoEquipo: string,
}

@Component({
  selector: 'app-dialog-agregar-equipo',
  templateUrl: './dialog-agregar-equipo.component.html',
  styleUrls: ['./dialog-agregar-equipo.component.css']
})
export class DialogAgregarEquipoComponent implements OnInit {

  data: data = {
    tagEquipo: '',
    tipoEquipo: '',
  }
  
  constructor(
    public dialogRef: MatDialogRef<DialogAgregarEquipoComponent>,
  ) { }

  
  ngOnInit(): void {
  }

  confirmar() {
    this.dialogRef.close(this.data);
  }

}
