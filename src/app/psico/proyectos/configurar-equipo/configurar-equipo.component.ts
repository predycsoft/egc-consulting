import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService, equipo_tren, Proyecto } from 'src/app/services/data-service.service';
import { DialogLibreriaEquiposComponent } from '../../dialog-libreria-equipos/dialog-libreria-equipos.component';
import { DialogDuplicarNuevoTagComponent } from '../dialog-duplicar-nuevo-tag/dialog-duplicar-nuevo-tag.component';

@Component({
  selector: 'app-configurar-equipo',
  templateUrl: './configurar-equipo.component.html',
  styleUrls: ['./configurar-equipo.component.css']
})
export class ConfigurarEquipoComponent implements OnInit {

  tagEquipo: string;
  tipoEquipo: string = 'Compresor'

  constructor(private route: ActivatedRoute, private afs: AngularFirestore, private data: DataServiceService, public dialogAgregar: MatDialog) { }

  proyecto: Proyecto
  equipo: equipo_tren

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.route.params.subscribe(params => {
          const trenTag = params.trenTag;
          const equipoTag = params.equipoTag;
          const idxTren = this.proyecto.trenes.findIndex(x => x.tag == trenTag);
          const idxEquipo = this.proyecto.trenes[idxTren].equipos.findIndex(x => x.tag == equipoTag)
          this.equipo = this.proyecto.trenes[idxTren].equipos[idxEquipo]
          console.log(this.equipo)
        })
      })
    })
  }

  dialogDuplicarCompresor(){
    const dialogRef =  this.dialogAgregar.open(DialogDuplicarNuevoTagComponent);
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        alert(result)
       
      }
    })
  }

  dialogDuplicarTurbina(){
    const dialogRef =  this.dialogAgregar.open(DialogDuplicarNuevoTagComponent);
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        alert(result)
      }
    })
  }

  dialogCargarCompresor(){
    const dialogRef =  this.dialogAgregar.open(DialogLibreriaEquiposComponent);
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        alert(result)
      }
    })
  }

  dialogCargarTurbina(){
    const dialogRef =  this.dialogAgregar.open(DialogLibreriaEquiposComponent);
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        alert(result)
      }
    })
  }

  dialogGuardarCompresor(){

  }

  dialogGuardarTurbina(){
    
  }


}
