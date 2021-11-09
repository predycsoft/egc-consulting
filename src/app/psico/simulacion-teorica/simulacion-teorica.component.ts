import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { cromatografia, curva, curvaEquipo, DataServiceService, equipo, Proyecto, simulacionTeorica, tren } from 'src/app/services/data-service.service';
import { CromatografiaComponent } from '../inputs/cromatografia/cromatografia.component';

@Component({
  selector: 'app-simulacion-teorica',
  templateUrl: './simulacion-teorica.component.html',
  styleUrls: ['./simulacion-teorica.component.css']
})
export class SimulacionTeoricaComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, public data: DataServiceService, private afs: AngularFirestore, public dialog: MatDialog) { }

  proyecto: Proyecto;
  tren: tren = new tren();
  equipos: equipo[];
  curvas: curvaEquipo[]
  simulaciones: Array<simulacionTeorica> = []

  F: number = 0
  C: number = 0
  K: number = 0
  cambiando = "";
  mezclas: cromatografia[] = []
  envio = []
  pruebaId;

  async ngOnInit() {
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

  simular() {
    let envio = []
    envio.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
      "TSUC", "PSUC", "FLUJO", "diametro", "RPM", "CP1", "CP2", "CP3", "CP4", "EXPOCP", "CE1", "CE2", "CE3", "CE4", "EXPOCE", "SURGE", "STONEW", "DDIM", "TDIM", "PDIM", "QDIM", "CAIPRES"])
    for (let index = 0; index < this.simulaciones.length; index++) {
      const sim = this.simulaciones[index];
      envio.push([+sim.inputs.Mezcla.cromatografia.metano, +sim.inputs.Mezcla.cromatografia.etano, +sim.inputs.Mezcla.cromatografia.propano, sim.inputs.Mezcla.cromatografia.iButano, sim.inputs.Mezcla.cromatografia.nButano, sim.inputs.Mezcla.cromatografia.iPentano, sim.inputs.Mezcla.cromatografia.nPentano, sim.inputs.Mezcla.cromatografia.hexano, sim.inputs.Mezcla.cromatografia.heptano, sim.inputs.Mezcla.cromatografia.octano, sim.inputs.Mezcla.cromatografia.nonano, sim.inputs.Mezcla.cromatografia.decano, sim.inputs.Mezcla.cromatografia.nitrogeno, sim.inputs.Mezcla.cromatografia.dioxCarbono, sim.inputs.Mezcla.cromatografia.sulfHidrogeno,
      sim.inputs.TSUC, sim.inputs.PSUC, sim.inputs.FLUJO, sim.curva.diametro, sim.inputs.RPM, sim.curva.cp1, sim.curva.cp2, sim.curva.cp3, sim.curva.cp4, sim.curva.expocp, sim.curva.ce1, sim.curva.ce2, sim.curva.ce3, sim.curva.ce4, sim.curva.expoce, sim.curva.limSurge, sim.curva.limStw, "[pulg]", "[°F]", "[psig]", "[MMSCFD]", sim.inputs.CAIPRES])
    }
    this.http.post("http://127.0.0.1:5000/simulacionTeorica/", JSON.stringify(envio)).subscribe((respuesta) => {
      if (respuesta) {
        let OUTPUT = respuesta as Array<Array<any>>
        console.log("Respuesta Teorica")
        console.log(respuesta)
        for (let j = 0; j < OUTPUT[0].length; j++) {
          for (let i = 0; i < OUTPUT.length; i++) {
            this.simulaciones[j].outputTeorico.TSUC = OUTPUT[4][j + 1]
            this.simulaciones[j].outputTeorico.PSUC = OUTPUT[2][j + 1]
            this.simulaciones[j].outputTeorico.RPM = OUTPUT[17][j + 1]
            this.simulaciones[j].outputTeorico.FLUJO = OUTPUT[16][j + 1]
            this.simulaciones[j].outputTeorico.PDES = OUTPUT[3][j + 1]
            this.simulaciones[j].outputTeorico.TDES = OUTPUT[5][j + 1]
            this.simulaciones[j].outputTeorico.HP = OUTPUT[14][j + 1]
            this.simulaciones[j].outputTeorico.HG = OUTPUT[7][j + 1]
            this.simulaciones[j].outputTeorico.DG = OUTPUT[6][j + 1]
            this.simulaciones[j].outputTeorico.SURGE = OUTPUT[8][j + 1]
            this.simulaciones[j].outputTeorico.QN = OUTPUT[9][j + 1]
            this.simulaciones[j].outputTeorico.STONEW = OUTPUT[10][j + 1]
            this.simulaciones[j].outputTeorico.CFHEAD = OUTPUT[11][j + 1]
            this.simulaciones[j].outputTeorico.EFIC = OUTPUT[13][j + 1]
            this.simulaciones[j].outputTeorico.POLLY = OUTPUT[15][j + 1]
          }
        }
      } else {
        console.log("no hubo respuesta")
      }
    })
  }

  async guardarSimulacion() {
    await this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(this.tren.tag)
      .collection("simulaciones-teoricas").doc(this.pruebaId).update({
        simulaciones: JSON.parse(JSON.stringify(this.simulaciones))
      })
  }

  openCromatografia(i) {
    const dialogRef = this.dialog.open(CromatografiaComponent, {
      data: {
        proyectoId: this.proyecto.id,
      }
    })
    dialogRef.afterClosed().subscribe((result => {
      if (result) {
        this.simulaciones[i].inputs.Mezcla = result
      }
    }))
  }

  async cargarSimulacion() {
    const sims = await this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(this.tren.tag).collection("simulaciones-teoricas").doc(this.pruebaId).ref.get()
    this.simulaciones = []
    this.simulaciones = sims.data().simulaciones
    if (this.simulaciones.length == 0) {
      this.armarSecciones()
    } else {
      this.actualizarRPMS()
    }
  }

  async armarSecciones() {
    try {
      let simulaciones: simulacionTeorica[] = []
      this.simulaciones = []
      for (let i = 0; i < this.equipos.length; i++) {
        let curvas = []
        const curvasDocs = await this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipos[i].tag).collection("curvas").ref.get();
        for (let j = 0; j < curvasDocs.docs.length; j++) {
          const curva = curvasDocs.docs[j].data() as curva;
          if (curva.equivalente == true) {
            curvas.push(curva)
          }
        }
        for (let sec = 1; sec < this.equipos[i].nSecciones + 1; sec++) {
          const simulacion = new simulacionTeorica()
          simulacion.equipoTag = this.equipos[i].tag
          simulacion.equipoFamilia = this.equipos[i].familia
          simulacion.seccion = sec
          simulacion.curvas = curvas.filter(x => x.numSeccion == sec)
          simulacion.curva = simulacion.curvas.find(x => x.default == true)
          simulacion.inputs.DDIM = this.tren.dimensiones.diametro
          simulacion.inputs.PDIM = this.tren.dimensiones.presion
          simulacion.inputs.QDIM = this.tren.dimensiones.flujo
          simulacion.inputs.TDIM = this.tren.dimensiones.temperatura
          simulaciones.push(simulacion)
        }
        curvas = []
      }
      this.simulaciones = simulaciones
      simulaciones = []
    } catch (err) {
      console.log(err)
    }
  }

  cambioCurva(i: number, curva: curva) {
    console.log("entre")
    this.simulaciones[i].curva = curva
  }

  actualizarRPMS() {
    for (let index = 0; index < this.simulaciones.length; index++) {
      if (index > 0) {
        this.simulaciones[index].inputs.RPM = this.simulaciones[0].inputs.RPM * this.simulaciones[index].inputs.RELVEL
      }
    }
  }
}
