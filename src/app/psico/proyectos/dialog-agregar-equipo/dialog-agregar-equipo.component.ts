import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { equipo_tren } from 'src/app/services/data-service.service';


@Component({
  selector: 'app-dialog-agregar-equipo',
  templateUrl: './dialog-agregar-equipo.component.html',
  styleUrls: ['./dialog-agregar-equipo.component.css']
})
export class DialogAgregarEquipoComponent implements OnInit {

  equipo: equipo_tren = new equipo_tren()

  constructor(
    public dialogRef: MatDialogRef<DialogAgregarEquipoComponent>,
  ) { }


  ngOnInit(): void {
  }

  guardar() {
    this.dialogRef.close(this.equipo);
  }

}
