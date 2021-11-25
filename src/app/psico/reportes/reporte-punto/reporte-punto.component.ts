import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService, equipo, Proyecto, simulacionPE, simulacionTren, tren } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-reporte-punto',
  templateUrl: './reporte-punto.component.html',
  styleUrls: ['./reporte-punto.component.css']
})
export class ReportePuntoComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    public data: DataServiceService,
  ) { }
  proyecto: Proyecto
  tren: tren
  equipos: equipo[]
  nSecciones: number
  punto: simulacionTren
  seccion: simulacionPE

  ngOnInit(): void {
    this.route.parent.params.subscribe(async (params) => {
      const docProyecto = await this.afs.collection("proyectos").doc(params.id).ref.get()
      this.proyecto = docProyecto.data() as Proyecto
      this.route.params.subscribe(async params => {
        const docTren = await this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(params.trenTag).ref.get()
        this.tren = docTren.data() as tren
        let tags = []
        for (let index = 0; index < this.tren.equipos.length; index++) {
          const element = this.tren.equipos[index];
          tags.push(element.tag)
        }
        this.afs.collection("proyectos").doc(this.proyecto.id).collection<equipo>("equipos").valueChanges().subscribe(equipos => {
          this.equipos = equipos.filter(x => tags.includes(x.tag))
          let conteoSecciones = 0
          for (let i = 0; i < this.equipos.length; i++) {
            for (let j = 0; j < this.equipos[i].nSecciones; j++) {
              conteoSecciones++
            }
          }
          this.nSecciones = conteoSecciones
        })
        const docPunto = await this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(this.tren.tag).collection<simulacionTren>("simulaciones-campo").doc(params.puntoId).ref.get()
        this.punto = docPunto.data() as simulacionTren
        console.log(this.punto)
        this.seccion = this.punto.simulacion[params.seccion ]
      })
    })
  }

}
