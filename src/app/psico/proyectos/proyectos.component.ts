import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DataServiceService, Proyecto } from '../../services/data-service.service';
import { DialogNuevoProyectoComponent } from '../dialogs/dialog-nuevo-proyecto/dialog-nuevo-proyecto.component';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  proyectos: Proyecto[];
  sub: Subscription;
  menuData:any;

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
