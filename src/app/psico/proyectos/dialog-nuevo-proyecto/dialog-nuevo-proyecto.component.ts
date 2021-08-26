import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Proyecto, DataServiceService } from '../../../services/data-service.service';

@Component({
  selector: 'app-dialog-nuevo-proyecto',
  templateUrl: './dialog-nuevo-proyecto.component.html',
  styleUrls: ['./dialog-nuevo-proyecto.component.css']
})
export class DialogNuevoProyectoComponent implements OnInit {

  constructor(public matDialogRef: MatDialogRef<DialogNuevoProyectoComponent>) { }

  usuario = JSON.parse(localStorage.getItem("user"));

  proyecto: Proyecto = new Proyecto();

  ngOnInit(): void {
    this.proyecto.userId = this.usuario.id;
  }

  guardar() {
    this.matDialogRef.close(this.proyecto);
  }

}
