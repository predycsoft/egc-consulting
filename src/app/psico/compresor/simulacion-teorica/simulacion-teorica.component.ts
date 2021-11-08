import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { cromatografia, curvaEquipo, DataServiceService, equipo, Proyecto, simulacionTeorica, tren } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-simulacion-teorica',
  templateUrl: './simulacion-teorica.component.html',
  styleUrls: ['./simulacion-teorica.component.css']
})
export class SimulacionTeoricaComponent implements OnInit {

  constructor(private route: ActivatedRoute, private data: DataServiceService, private afs: AngularFirestore) { }
  proyecto: Proyecto;
  tren: tren;
  equipos: equipo[];
  curvas: curvaEquipo[]
  simulaciones: Array<Array<simulacionTeorica>> = []

  F: number = 0
  C: number = 0
  K: number = 0
  cambiando = "";
  mezclas: cromatografia[] = []
  envio = []
  pruebaId;

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.route.params.subscribe(params => {
          const trenTag = params.trenTag;
          this.pruebaId = params.idPrueba
          this.data.getTren(this.proyecto.id, trenTag).subscribe(tren => {
            this.tren = tren
            this.data.getEquipos(this.proyecto.id, trenTag).subscribe(async equipos => {
              this.equipos = []
              this.equipos = equipos
              await this.cargarSimulacion()
              console.log(this.proyecto)
              console.log(this.tren)
              console.log(this.equipos)
              console.log(this.simulaciones)
            })
          })
        })
      })
    })
  }

 
  async cargarSimulacion() {
    const sims = await this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(this.tren.tag).collection("simulaciones-teoricas").doc(this.pruebaId).ref.get()
    this.simulaciones = []
    this.simulaciones = sims.data().simulaciones
    if (this.simulaciones.length == 0){
      this.armarSecciones()
    }
  }

  armarSecciones(){
    
  }

}
