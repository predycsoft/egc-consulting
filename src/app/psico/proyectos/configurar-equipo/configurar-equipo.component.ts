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



  constructor(private route: ActivatedRoute, private afs: AngularFirestore, private data: DataServiceService, public dialogAgregar: MatDialog) { }

  trenTag
  tagEquipo: string;
  proyecto: Proyecto
  equipo: equipo_tren
  id: string;

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.id = params.id
        this.route.params.subscribe(params => {
          this.trenTag = params.trenTag;

          const equipoTag = params.equipoTag;
          this.data.obtenerEquipo(this.proyecto.id, equipoTag).subscribe((equipo) => {
            this.equipo = equipo
          })
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
