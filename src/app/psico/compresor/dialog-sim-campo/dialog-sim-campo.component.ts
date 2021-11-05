import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { cromatografia, curva, DataServiceService, equipo, Proyecto, tren } from 'src/app/services/data-service.service';
import { CromatografiaComponent } from '../../inputs/cromatografia/cromatografia.component';

interface curvaEquipo {
  equipoTag: string,
  seccion: number,
  curvas: curva[]
}

interface mezcla {
  id: string,
  nombre: string,
  cromatografia: cromatografia,
}

class inputs {
  TSUC: number = 0;
  PSUC: number = 0;
  PDES: number = 0;
  TDES: number = 0;
  RPM: number = 0;
  FLUJO: number = 0;
  Mezcla: mezcla = {
    id: "",
    nombre: "",
    cromatografia: new cromatografia()
  }
  TDIM: string = "";
  QDIM: string = "";
  PDIM: string = "";
  DDIM: string = "";
}

class outputAdim {
  EFIC: number = 0
  coefWorkInput: number = 0
  CFHEAD: number = 0
  workPoli: number = 0
  HP: number = 0
  flujoMasico: number = 0
  relacion_de_compresion: number = 0
  relacion_de_volumen: number = 0
  tIsent: number = 0
  pIsent: number = 0
  densSuc: number = 0
  densDes: number = 0
  densIsen: number = 0
  volSuc: number = 0
  volDes: number = 0
  volIsent: number = 0
  hSuc: number = 0
  hDes: number = 0
  hIsnet: number = 0
  sSuc: number = 0
  sDes: number = 0
  sIsent: number = 0
  compSuc: number = 0
  compDes: number = 0
  compIsent: number = 0
  ymw: number = 0
  qn: number = 0
}

class outputTeorico {
  PSUC: number = 0
  PDES: number = 0
  TSUC: number = 0
  TDES: number = 0
  DG: number = 0
  HG: number = 0
  SURGE: number = 0
  QN: number = 0
  STONEW: number = 0
  CFHEAD: number = 0
  HEAD: number = 0
  EFIC: number = 0
  HP: number = 0
  POLLY: number = 0
  FLUJO: number = 0
  RPM: number = 0
}

class simulacionPE {
  equipoTag: string = "";
  equipoFamilia: string = "";
  equipoTipologia: string = "";
  seccion: number = 0;
  curvas: curva[] = [];
  curva: curva;
  inputs: inputs = new inputs()
  outputPE: outputTeorico = new outputTeorico()
  outputAdim: outputAdim = new outputAdim()
}

@Component({
  selector: 'app-dialog-sim-campo',
  templateUrl: './dialog-sim-campo.component.html',
  styleUrls: ['./dialog-sim-campo.component.css']
})
export class DialogSimCampoComponent implements OnInit {

  constructor(private route: ActivatedRoute, public data: DataServiceService, private afs: AngularFirestore, private dialog: MatDialog, private http: HttpClient) { }
  proyecto: Proyecto;
  tren: tren;
  equipos: equipo[];
  curvas: curvaEquipo[]
  simulaciones: Array<Array<simulacionPE>> = []

  F: number = 0
  C: number = 0
  K: number = 0
  cambiando = "";
  mezclas: cromatografia[] = []
  envio = []

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.route.params.subscribe(params => {
          const trenTag = params.trenTag;
          this.data.getTren(this.proyecto.id, trenTag).subscribe(tren => {
            this.tren = tren
            this.data.getEquipos(this.proyecto.id, trenTag).subscribe(async equipos => {
              this.equipos = []
              this.equipos = equipos
              await this.armarSecciones()
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

  async armarSecciones() {
    try {
      let simulaciones: simulacionPE[] = []
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
          const simulacion = new simulacionPE()
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
      this.simulaciones = [simulaciones]
      simulaciones = []
    } catch (err) {
      console.log(err)
    }
  }

  agregarPunto() {
    const len = this.simulaciones.length
    const simulacion: simulacionPE[] = this.simulaciones[len - 1]
    this.simulaciones = [...this.simulaciones, simulacion]

  }

  openCromatografia(i, j) {
    const dialogRef = this.dialog.open(CromatografiaComponent, {
      data: {
        proyectoId: this.proyecto.id,
      }
    })
    dialogRef.afterClosed().subscribe((result => {
      if (result) {
        this.simulaciones[i][j].inputs.Mezcla = result
      }
    }))
  }

  cargarCromatografias() {
    this.afs.collection("proyectos").doc(this.proyecto.id).collection
  }

  guardarSimulacion(){
    
  }

  simular() {
    this.envio = []
    this.envio.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
      "Diametro", "TSUC", "PSUC", "TDES", "PDES", "FLUJO", "RPM", "DDIM", "TDIM", "PDIM", "QDIM"])
    for (let i = 0; i < this.simulaciones.length; i++) {
      for (let j = 0; j < this.simulaciones[i].length; j++) {
        const sim = this.simulaciones[i][j]
        this.envio.push([sim.inputs.Mezcla.cromatografia.metano, sim.inputs.Mezcla.cromatografia.etano, sim.inputs.Mezcla.cromatografia.propano, sim.inputs.Mezcla.cromatografia.iButano, sim.inputs.Mezcla.cromatografia.nButano, sim.inputs.Mezcla.cromatografia.iPentano, sim.inputs.Mezcla.cromatografia.nPentano, sim.inputs.Mezcla.cromatografia.hexano, sim.inputs.Mezcla.cromatografia.heptano, sim.inputs.Mezcla.cromatografia.octano, sim.inputs.Mezcla.cromatografia.nonano, sim.inputs.Mezcla.cromatografia.decano, sim.inputs.Mezcla.cromatografia.nitrogeno, sim.inputs.Mezcla.cromatografia.dioxCarbono, sim.inputs.Mezcla.cromatografia.sulfHidrogeno,
        sim.curva.diametro, sim.inputs.TSUC, sim.inputs.PSUC, sim.inputs.TDES, sim.inputs.PDES, sim.inputs.FLUJO, sim.inputs.RPM, sim.inputs.DDIM, sim.inputs.TDIM, sim.inputs.PDIM, sim.inputs.QDIM])
      }
      this.http.post("http://127.0.0.1:5000/adimensional/", JSON.stringify(this.envio)).subscribe((res) => {
        if (res) {
          console.log(res)
        }
      })
    }
    // this.envio.push([this.mezcla.metano, this.mezcla.etano, this.mezcla.propano, this.mezcla.iButano, this.mezcla.nButano, this.mezcla.iPentano, this.mezcla.nPentano, this.mezcla.hexano, this.mezcla.heptano, this.mezcla.octano, this.mezcla.nonano, this.mezcla.decano, this.mezcla.nitrogeno, this.mezcla.dioxCarbono, this.mezcla.sulfHidrogeno,
    // this.curva.diametro, this.TSUC, this.PSUC, this.TDES, this.PDES, this.flujo, this.RPM, this.ddim, this.tdim, this.pdim, this.qdim])
    // console.log(this.envio)
    // this.http.post("http://127.0.0.1:5000/adimensional/", JSON.stringify(this.envio)).subscribe((res) => {
    //   if (res) {
    //     console.log(res)
    //     let envioPrueba = []
    //     envioPrueba.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
    //       "TSUC", "PSUC", "FLUJO", "diametro", "RPM", "CP1", "CP2", "CP3", "CP4", "EXPOCP", "CE1", "CE2", "CE3", "CE4", "EXPOCE", "SURGE", "STONEW", "DDIM", "TDIM", "PDIM", "QDIM", "PDESCAMPO"])
    //     envioPrueba.push([this.mezcla.metano, this.mezcla.etano, this.mezcla.propano, this.mezcla.iButano, this.mezcla.nButano, this.mezcla.iPentano, this.mezcla.nPentano, this.mezcla.hexano, this.mezcla.heptano, this.mezcla.octano, this.mezcla.nonano, this.mezcla.decano, this.mezcla.nitrogeno, this.mezcla.dioxCarbono, this.mezcla.sulfHidrogeno,
    //     this.TSUC, this.PSUC, this.flujo, this.curva.diametro, this.RPM, this.curva.cp1, this.curva.cp2, this.curva.cp3, this.curva.cp4, this.curva.expocp, this.curva.ce1, this.curva.ce2, this.curva.ce3, this.curva.ce4, this.curva.expoce, this.curva.limSurge, this.curva.limStw, this.ddim, this.tdim, this.pdim, this.qdim, this.PDES])
    //     this.http.post("http://127.0.0.1:5000/pruebaEficiencia/", JSON.stringify(envioPrueba)).subscribe((res) => {
    //       if (res) {
    //         console.log(res)
    //       }
    //     })
    //   }v
    // })
  }

  // cambiar(){
  //   if (this.cambiando == "F"){
  //     this.C = (this.F-32)/1.8
  //     this.K = this.C +273.15
  //   }
  //   if (this.cambiando == "C"){
  //     this.F = this.C*1.8 + 32
  //     this.K = this.C + 273.15
  //   }
  //   if (this.cambiando == "K"){
  //     this.C = this.K - 273.15
  //     this.F = this.C*1.8 + 32
  //   }
  // }
}
