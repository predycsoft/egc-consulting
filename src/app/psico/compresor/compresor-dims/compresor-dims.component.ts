import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { compresorDims, DataServiceService, equipo, Proyecto, tren } from 'src/app/services/data-service.service';
import { DimensionesService } from 'src/app/services/dimensiones.service';

@Component({
  selector: 'compresor-dims',
  templateUrl: './compresor-dims.component.html',
  styleUrls: ['./compresor-dims.component.css']
})
export class CompresorDimsComponent implements OnInit {

  constructor(public data: DataServiceService, private afs: AngularFirestore, public dims: DimensionesService, private route: ActivatedRoute) { }

  compresorDims = new compresorDims
  proyecto: Proyecto;
  equipo: equipo;
  tren: tren = new tren()

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.route.params.subscribe(params => {
          const trenTag = params.trenTag;
          const equipoTag = params.equipoTag;
          this.data.getTren(this.proyecto.id,trenTag).subscribe(tren => {
            this.tren = tren
            this.compresorDims = this.tren.dimensiones
            console.log(this.compresorDims)
          })
        })
      })
    })
  }

  guardarTren(){
    this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(this.tren.tag).update({
      dimensiones: JSON.parse(JSON.stringify(this.tren.dimensiones))
    })
  }

}
