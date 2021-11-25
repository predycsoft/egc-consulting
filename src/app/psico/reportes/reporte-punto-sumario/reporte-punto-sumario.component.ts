import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService, equipo, Proyecto, simulacionTren, tren } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-reporte-punto-sumario',
  templateUrl: './reporte-punto-sumario.component.html',
  styleUrls: ['./reporte-punto-sumario.component.css']
})


// class cromatografia {
//   etano = new componente;

// }


export class ReportePuntoSumarioComponent implements OnInit {

  // Datos de simulacion
  fecha: Date;
  tipoSim: string = 'Real'   //Real, RealTeorico, Teorico

  // Datos del tren
  nCompresores: number = 2;  //Esta variable habilita la columna en donde se especifica el compresor. En caso de existir 1 solo compresor la columna no se muestra
  nCompresoresMultiSeccion: number = 0; //Esta variable habilita la columna en donde se especifica la sección de un compresor. En caso de no existir compresores multisección la columna no se muestra
  nCromatografias: number = 1; //Esta variable identifica la cantidad de cromatografias que se muestran en el reporte. Cada cromatografia corresponde a 1 columna

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
      })
    })
  }

}
