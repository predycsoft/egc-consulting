import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServiceService, tren } from '../../../services/data-service.service';
import { DialogService } from '../../../services/dialog.service';
import { DialogNuevoTrenComponent } from '../dialog-nuevo-tren/dialog-nuevo-tren.component';

@Component({
  selector: 'lista-trenes',
  templateUrl: './lista-trenes.component.html',
  styleUrls: ['./lista-trenes.component.css']
})
export class ListaTrenesComponent implements OnInit {

  constructor(public dialogService: DialogService,private route: ActivatedRoute, private data: DataServiceService, private dialog: MatDialog) { }

  id: string = "";
  trenes: tren[] = [];
  selectedTren: tren = new tren()


  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      console.log(params.id)
      this.id = params.id
      this.data.obtenerProyecto(this.id).subscribe((proyecto) => {
        this.trenes = proyecto.trenes
      })
    })
  }

  eliminarTren(tren: tren) {
    this.data.eliminarTren(this.id, tren)
  }

  openDialogNuevoTren() {
    const dialogRef = this.dialog.open(DialogNuevoTrenComponent);
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        console.log(result)
        await this.data.anexarTren(this.id, result);
        this.dialogService.dialogExito()
      }
    });
  }
}
