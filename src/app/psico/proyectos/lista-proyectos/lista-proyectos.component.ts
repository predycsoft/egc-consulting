import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DataServiceService, Proyecto } from '../../../services/data-service.service';
import { DialogNuevoProyectoComponent } from '../dialog-nuevo-proyecto/dialog-nuevo-proyecto.component';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'lista-proyectos',
  templateUrl: './lista-proyectos.component.html',
  styleUrls: ['./lista-proyectos.component.css']
})
export class ListaProyectosComponent implements OnInit {

  proyectos: Proyecto[];
  sub: Subscription;
  idSelected: string = "";

  constructor(public dialog: MatDialog, private data: DataServiceService, public dialogService: DialogService) { }

  usuario = JSON.parse(localStorage.getItem("user"));

  ngOnInit(): void {
    this.sub = this.data.obtenerProyectosUsuario()
      .subscribe(proyectos => {
        this.proyectos = proyectos;
      })
  }

  openDialogNuevoProyecto() {
    const dialogRef = this.dialog.open(DialogNuevoProyectoComponent);
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        console.log(result)
        await this.data.createProyecto(result);
        this.dialogService.dialogExito()
      }
    });
  }

  eliminarProyecto(id) {
    this.dialogService.dialogConfirmar().afterClosed().subscribe(async result => {
      if (result == true) {
        this.data.eliminarProyecto(id)
      }
    })
  }
}
