import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { cromatografia, curva, DataServiceService, equipo, Proyecto, tren, simulacionPE, curvaEquipo } from 'src/app/services/data-service.service';
import { CromatografiaComponent } from '../../inputs/cromatografia/cromatografia.component';

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
            let tags = []
            for (let index = 0; index < this.tren.equipos.length; index++) {
              const element = this.tren.equipos[index];
              tags.push(element.tag)
            }
            this.data.getEquipos(this.proyecto.id, trenTag).subscribe(async equipos => {
              this.equipos = []
              this.equipos = equipos.filter(x => tags.includes(x.tag))
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

  async guardarSimulacion() {
    for (let index = 0; index < this.simulaciones.length; index++) {
      const sim: simulacionPE[] = this.simulaciones[index]
      await this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(this.tren.tag).collection("pruebas-eficiencia").doc(this.pruebaId).collection("puntos").doc(`punto-${index}`)
        .set({ simulacion: JSON.parse(JSON.stringify(sim)) })
    }
  }

  async cargarSimulacion() {
    const sims = await this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(this.tren.tag).collection("pruebas-eficiencia").doc(this.pruebaId).collection("puntos").ref.get()
    this.simulaciones = []
    if (sims.docs.length > 0) {
      sims.docs.forEach(doc => {
        this.simulaciones = [...this.simulaciones, doc.data().simulacion as simulacionPE[]]
      })
    } else {
      this.armarSecciones()
    }
  }

  simular() {
    this.envio = []
    this.envio.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
      "Diametro", "TSUC", "PSUC", "TDES", "PDES", "FLUJO", "RPM", "DDIM", "TDIM", "PDIM", "QDIM"])
    for (let i = 0; i < this.simulaciones.length; i++) {
      for (let j = 0; j < this.simulaciones[i].length; j++) {
        const sim = this.simulaciones[i][j]
        this.envio.push([+sim.inputs.Mezcla.cromatografiaNormalizada.metano, +sim.inputs.Mezcla.cromatografiaNormalizada.etano, +sim.inputs.Mezcla.cromatografiaNormalizada.propano, sim.inputs.Mezcla.cromatografiaNormalizada.iButano, sim.inputs.Mezcla.cromatografiaNormalizada.nButano, sim.inputs.Mezcla.cromatografiaNormalizada.iPentano, sim.inputs.Mezcla.cromatografiaNormalizada.nPentano, sim.inputs.Mezcla.cromatografiaNormalizada.hexano, sim.inputs.Mezcla.cromatografiaNormalizada.heptano, sim.inputs.Mezcla.cromatografiaNormalizada.octano, sim.inputs.Mezcla.cromatografiaNormalizada.nonano, sim.inputs.Mezcla.cromatografiaNormalizada.decano, sim.inputs.Mezcla.cromatografiaNormalizada.nitrogeno, sim.inputs.Mezcla.cromatografiaNormalizada.dioxCarbono, sim.inputs.Mezcla.cromatografiaNormalizada.sulfHidrogeno,
        sim.curva.diametro, sim.inputs.TSUC, sim.inputs.PSUC, sim.inputs.TDES, sim.inputs.PDES, sim.inputs.FLUJOSUC, sim.inputs.RPM, sim.inputs.DDIM, sim.inputs.TDIM, sim.inputs.PDIM, sim.inputs.QDIM])
      }
      this.http.post("http://127.0.0.1:5000/adimensional/", JSON.stringify(this.envio)).subscribe(async (res) => {
        let OUTPUT: Array<Array<any>> = []
        if (res) {
          OUTPUT = res as []
          console.log("Respuesta de adimensional")
          console.log(res)
          for (let index = 0; index < this.simulaciones[i].length; index++) {
            this.simulaciones[i][index].outputAdim.EFICPOLI = OUTPUT[0][index+1]
            this.simulaciones[i][index].outputAdim.CFWORKPOLI = OUTPUT[1][index+1]
            this.simulaciones[i][index].outputAdim.CFHEADPOLI = OUTPUT[2][index+1]
            this.simulaciones[i][index].outputAdim.WORKPOLI = OUTPUT[3][index+1]
            this.simulaciones[i][index].outputAdim.HPGAS = OUTPUT[4][index+1]
            this.simulaciones[i][index].outputAdim.FLUJOMAS = OUTPUT[5][index+1]
            this.simulaciones[i][index].outputAdim.RELCOMP = OUTPUT[6][index+1]
            this.simulaciones[i][index].outputAdim.RELVOL = OUTPUT[7][index+1]
            this.simulaciones[i][index].outputAdim.TISEN = OUTPUT[8][index+1]
            this.simulaciones[i][index].outputAdim.PISEN = OUTPUT[9][index+1]
            this.simulaciones[i][index].outputAdim.DENSUC = OUTPUT[10][index+1]
            this.simulaciones[i][index].outputAdim.DENDES = OUTPUT[11][index+1]
            this.simulaciones[i][index].outputAdim.DENISEN = OUTPUT[12][index+1]
            this.simulaciones[i][index].outputAdim.VOLSUC = OUTPUT[13][index+1]
            this.simulaciones[i][index].outputAdim.VOLDES = OUTPUT[14][index+1]
            this.simulaciones[i][index].outputAdim.VOLISEN = OUTPUT[15][index+1]
            this.simulaciones[i][index].outputAdim.HSUC = OUTPUT[16][index+1]
            this.simulaciones[i][index].outputAdim.HDES = OUTPUT[17][index+1]
            this.simulaciones[i][index].outputAdim.HISEN = OUTPUT[18][index+1]
            this.simulaciones[i][index].outputAdim.SSUC = OUTPUT[19][index+1]
            this.simulaciones[i][index].outputAdim.SDES = OUTPUT[20][index+1]
            this.simulaciones[i][index].outputAdim.SISEN = OUTPUT[21][index+1]
            this.simulaciones[i][index].outputAdim.ZSUC = OUTPUT[22][index+1]
            this.simulaciones[i][index].outputAdim.ZDES = OUTPUT[23][index+1]
            this.simulaciones[i][index].outputAdim.ZISEN = OUTPUT[24][index+1]
            this.simulaciones[i][index].outputAdim.YWM = OUTPUT[25][index+1]
            this.simulaciones[i][index].outputAdim.QN = OUTPUT[26][index+1]
          }
        }
      })
    }
  }

  pruebaEficiencia() {
    for (let i = 0; i < this.simulaciones.length; i++) {
      let envioPrueba = []
      envioPrueba.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
        "TSUC", "PSUC", "FLUJO", "diametro", "RPM", "CP1", "CP2", "CP3", "CP4", "EXPOCP", "CE1", "CE2", "CE3", "CE4", "EXPOCE", "SURGE", "STONEW", "DDIM", "TDIM", "PDIM", "QDIM", "PDESCAMPO"])
      for (let j = 0; j < this.simulaciones[i].length; j++) {
        const sim = this.simulaciones[i][j]
        envioPrueba.push([+sim.inputs.Mezcla.cromatografiaNormalizada.metano, +sim.inputs.Mezcla.cromatografiaNormalizada.etano, +sim.inputs.Mezcla.cromatografiaNormalizada.propano, sim.inputs.Mezcla.cromatografiaNormalizada.iButano, sim.inputs.Mezcla.cromatografiaNormalizada.nButano, sim.inputs.Mezcla.cromatografiaNormalizada.iPentano, sim.inputs.Mezcla.cromatografiaNormalizada.nPentano, sim.inputs.Mezcla.cromatografiaNormalizada.hexano, sim.inputs.Mezcla.cromatografiaNormalizada.heptano, sim.inputs.Mezcla.cromatografiaNormalizada.octano, sim.inputs.Mezcla.cromatografiaNormalizada.nonano, sim.inputs.Mezcla.cromatografiaNormalizada.decano, sim.inputs.Mezcla.cromatografiaNormalizada.nitrogeno, sim.inputs.Mezcla.cromatografiaNormalizada.dioxCarbono, sim.inputs.Mezcla.cromatografiaNormalizada.sulfHidrogeno,
        sim.inputs.TSUC, sim.inputs.PSUC, sim.inputs.FLUJOSUC, sim.curva.diametro, sim.inputs.RPM, sim.curva.cc0, sim.curva.cc1, sim.curva.cc2, sim.curva.cc3, sim.curva.expocc, sim.curva.ce0, sim.curva.ce1, sim.curva.ce2, sim.curva.ce3, sim.curva.expoce, sim.curva.limSurge, sim.curva.limStw, sim.inputs.DDIM, sim.inputs.TDIM, sim.inputs.PDIM, sim.inputs.QDIM, sim.inputs.PDES])
      }
      console.log("hice el llamado a prueba de eficiencia")
      this.http.post("http://127.0.0.1:5000/pruebaEficiencia/", JSON.stringify(envioPrueba)).subscribe((respuesta) => {
        let OUTPUT: Array<Array<any>> = []
        if (respuesta) {
          OUTPUT = respuesta as []
          console.log("Respuesta Teorica")
          for (let index = 0; index < this.simulaciones[i].length; index++) {
            this.simulaciones[i][index].outputTeorico.PSUC = OUTPUT[2][index+1]
            this.simulaciones[i][index].outputTeorico.PDES = OUTPUT[3][index+1]
            this.simulaciones[i][index].outputTeorico.TSUC = OUTPUT[4][index+1]
            this.simulaciones[i][index].outputTeorico.TDES = OUTPUT[5][index+1]
            this.simulaciones[i][index].outputTeorico.DENDES = OUTPUT[6][index+1]
            this.simulaciones[i][index].outputTeorico.HDES = OUTPUT[7][index+1]
            this.simulaciones[i][index].outputTeorico.SURGE = OUTPUT[8][index+1]
            this.simulaciones[i][index].outputTeorico.QN = OUTPUT[9][index+1]
            this.simulaciones[i][index].outputTeorico.STONEW = OUTPUT[10][index+1]
            this.simulaciones[i][index].outputTeorico.CFHEADPOLI = OUTPUT[11][index+1]
            this.simulaciones[i][index].outputTeorico.HEADPOLI = OUTPUT[12][index+1]
            this.simulaciones[i][index].outputTeorico.EFICPOLI = OUTPUT[13][index+1]
            this.simulaciones[i][index].outputTeorico.HPGAS = OUTPUT[14][index+1]
            this.simulaciones[i][index].outputTeorico.EXPPOLI = OUTPUT[15][index+1]
            this.simulaciones[i][index].outputTeorico.FLUJODES = OUTPUT[16][index+1]
            this.simulaciones[i][index].outputTeorico.RPM = OUTPUT[17][index+1]
          }
          console.log(respuesta)
        } else {
          console.log("no hubo respuesta")
        }
      })
    }
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
