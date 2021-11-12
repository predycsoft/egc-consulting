import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { curva, curvaEquipo, DataServiceService, equipo, Proyecto, simulacionPE, tren } from 'src/app/services/data-service.service';
import { ChartType } from 'angular-google-charts';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CromatografiaComponent } from '../inputs/cromatografia/cromatografia.component';

class simInfo {
  simId: string = "";
  simDate: Date = new Date;
  simTipo: string = "";
}

// CLASES PARA INDICE
class pruebaCampo {
  simDate: Date = new Date;
  simTipo: string = '';
  simCurvas: string = '';
  simSecciones: simSeccion[] = []
  simId: string = '';
}

class simSeccion {
  equipoTag: string = '';
  numSeccion: number = 0;
  numCompresor: number = 0;
  RPM: number = 0;
  FLUJO: number = 0;
  PSUC: number = 0;
  PDES: number = 0;
  TSUC: number = 0;
  TDES: number = 0;
  HP: number = 0;
  QN: number = 0;
  CFHEAD: number = 0;
  EFIC: number = 0;
}

@Component({
  selector: 'app-simulacion-campo-input',
  templateUrl: './simulacion-campo-input.component.html',
  styleUrls: ['./simulacion-campo-input.component.css']
})
export class SimulacionCampoInputComponent implements OnInit {
  proyecto: Proyecto;
  tren: tren;
  equipos: equipo[];
  curvas: curvaEquipo[]
  resumen: pruebaCampo = new pruebaCampo

  simulacion: Array<simulacionPE> = [];
  simId: string = "";
  simInfo: simInfo = new simInfo;

  constructor(
    private route: ActivatedRoute,
    private data: DataServiceService,
    private afs: AngularFirestore,
    private http: HttpClient,
    private dialogRef: MatDialogRef<SimulacionCampoInputComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataEnviada
  ) { }




  async ngOnInit() {
    // Get Proyecto
    const docProyecto = await this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId).ref.get()
    this.proyecto = docProyecto.data() as Proyecto
    // Get Tren
    const docTren = await this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
      .collection("trenes").doc(this.dataEnviada.trenTag).ref.get()
    this.tren = docTren.data() as tren
    let tags = []
    for (let index = 0; index < this.tren.equipos.length; index++) {
      const element = this.tren.equipos[index];
      tags.push(element.tag)
    }
    // Get Equipos
    this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
      .collection<equipo>("equipos").valueChanges().subscribe(async equipos => {
        this.equipos = []
        this.equipos = equipos.filter(x => tags.includes(x.tag))
        // Get punto de simulacion
        if (this.dataEnviada.simId) {
          const docSim = await this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
            .collection("trenes").doc(this.dataEnviada.trenTag)
            .collection("simulaciones-campo").doc(this.dataEnviada.simId).ref
            .get()
          this.simulacion = docSim.data()["simulacion"]
          this.simInfo.simDate = docSim.data()["simDate"]
          this.simInfo.simId = docSim.data()["simId"]
          this.simInfo.simTipo = docSim.data()["simTipo"]
        } else {
          this.armarNuevaSim()
        }
      })
  }

  async armarNuevaSim() {
    try {
      let simulaciones: simulacionPE[] = []
      this.simulacion = []
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
      this.simulacion = simulaciones
      simulaciones = []
    } catch (err) {
      console.log(err)
    }
  }

  openCromatografia(i) {
    const dialogRef = this.dialog.open(CromatografiaComponent, {
      data: {
        proyectoId: this.proyecto.id,
      }
    })
    dialogRef.afterClosed().subscribe((result => {
      if (result) {
        this.simulacion[i].inputs.Mezcla = result
      }
    }))
  }

  simularAdim() {
    let envio = []
    envio.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
      "Diametro", "TSUC", "PSUC", "TDES", "PDES", "FLUJO", "RPM", "DDIM", "TDIM", "PDIM", "QDIM"])
    for (let j = 0; j < this.simulacion.length; j++) {
      const sim = this.simulacion[j]
      envio.push([+sim.inputs.Mezcla.cromatografia.metano, +sim.inputs.Mezcla.cromatografia.etano, +sim.inputs.Mezcla.cromatografia.propano, sim.inputs.Mezcla.cromatografia.iButano, sim.inputs.Mezcla.cromatografia.nButano, sim.inputs.Mezcla.cromatografia.iPentano, sim.inputs.Mezcla.cromatografia.nPentano, sim.inputs.Mezcla.cromatografia.hexano, sim.inputs.Mezcla.cromatografia.heptano, sim.inputs.Mezcla.cromatografia.octano, sim.inputs.Mezcla.cromatografia.nonano, sim.inputs.Mezcla.cromatografia.decano, sim.inputs.Mezcla.cromatografia.nitrogeno, sim.inputs.Mezcla.cromatografia.dioxCarbono, sim.inputs.Mezcla.cromatografia.sulfHidrogeno,
      sim.curva.diametro, sim.inputs.TSUC, sim.inputs.PSUC, sim.inputs.TDES, sim.inputs.PDES, sim.inputs.FLUJO, sim.inputs.RPM, sim.inputs.DDIM, sim.inputs.TDIM, sim.inputs.PDIM, sim.inputs.QDIM])
    }
    this.http.post("http://127.0.0.1:5000/adimensional/", JSON.stringify(envio)).subscribe(async (res) => {
      let OUTPUT: Array<Array<any>> = []
      if (res) {
        OUTPUT = res as []
        console.log("Respuesta de adimensional")
        console.log(res)
        for (let index = 0; index < this.simulacion.length; index++) {
          this.simulacion[index].outputAdim.EFIC = OUTPUT[0][index + 1]
          this.simulacion[index].outputAdim.coefWorkInput = OUTPUT[1][index + 1]
          this.simulacion[index].outputAdim.CFHEAD = OUTPUT[2][index + 1]
          this.simulacion[index].outputAdim.workPoli = OUTPUT[3][index + 1]
          this.simulacion[index].outputAdim.HP = OUTPUT[4][index + 1]
          this.simulacion[index].outputAdim.flujoMasico = OUTPUT[5][index + 1]
          this.simulacion[index].outputAdim.relacion_de_compresion = OUTPUT[6][index + 1]
          this.simulacion[index].outputAdim.relacion_de_volumen = OUTPUT[7][index + 1]
          this.simulacion[index].outputAdim.tIsent = OUTPUT[8][index + 1]
          this.simulacion[index].outputAdim.pIsent = OUTPUT[9][index + 1]
          this.simulacion[index].outputAdim.densSuc = OUTPUT[10][index + 1]
          this.simulacion[index].outputAdim.densDes = OUTPUT[11][index + 1]
          this.simulacion[index].outputAdim.densIsen = OUTPUT[12][index + 1]
          this.simulacion[index].outputAdim.volSuc = OUTPUT[13][index + 1]
          this.simulacion[index].outputAdim.volDes = OUTPUT[14][index + 1]
          this.simulacion[index].outputAdim.volIsent = OUTPUT[15][index + 1]
          this.simulacion[index].outputAdim.hSuc = OUTPUT[16][index + 1]
          this.simulacion[index].outputAdim.hDes = OUTPUT[17][index + 1]
          this.simulacion[index].outputAdim.hIsnet = OUTPUT[18][index + 1]
          this.simulacion[index].outputAdim.sSuc = OUTPUT[19][index + 1]
          this.simulacion[index].outputAdim.sDes = OUTPUT[20][index + 1]
          this.simulacion[index].outputAdim.sIsent = OUTPUT[21][index + 1]
          this.simulacion[index].outputAdim.compSuc = OUTPUT[22][index + 1]
          this.simulacion[index].outputAdim.compDes = OUTPUT[23][index + 1]
          this.simulacion[index].outputAdim.compIsent = OUTPUT[24][index + 1]
          this.simulacion[index].outputAdim.ymw = OUTPUT[25][index + 1]
          this.simulacion[index].outputAdim.qn = OUTPUT[26][index + 1]
        }
      }
    })
    this.simInfo.simTipo = "R"
  }

  simularPE() {
    let envioPrueba = []
    envioPrueba.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
      "TSUC", "PSUC", "FLUJO", "diametro", "RPM", "CP1", "CP2", "CP3", "CP4", "EXPOCP", "CE1", "CE2", "CE3", "CE4", "EXPOCE", "SURGE", "STONEW", "DDIM", "TDIM", "PDIM", "QDIM", "PDESCAMPO"])
    for (let j = 0; j < this.simulacion.length; j++) {
      const sim = this.simulacion[j]
      envioPrueba.push([+sim.inputs.Mezcla.cromatografia.metano, +sim.inputs.Mezcla.cromatografia.etano, +sim.inputs.Mezcla.cromatografia.propano, sim.inputs.Mezcla.cromatografia.iButano, sim.inputs.Mezcla.cromatografia.nButano, sim.inputs.Mezcla.cromatografia.iPentano, sim.inputs.Mezcla.cromatografia.nPentano, sim.inputs.Mezcla.cromatografia.hexano, sim.inputs.Mezcla.cromatografia.heptano, sim.inputs.Mezcla.cromatografia.octano, sim.inputs.Mezcla.cromatografia.nonano, sim.inputs.Mezcla.cromatografia.decano, sim.inputs.Mezcla.cromatografia.nitrogeno, sim.inputs.Mezcla.cromatografia.dioxCarbono, sim.inputs.Mezcla.cromatografia.sulfHidrogeno,
      sim.inputs.TSUC, sim.inputs.PSUC, sim.inputs.FLUJO, sim.curva.diametro, sim.inputs.RPM, sim.curva.cp1, sim.curva.cp2, sim.curva.cp3, sim.curva.cp4, sim.curva.expocp, sim.curva.ce1, sim.curva.ce2, sim.curva.ce3, sim.curva.ce4, sim.curva.expoce, sim.curva.limSurge, sim.curva.limStw, sim.inputs.DDIM, sim.inputs.TDIM, sim.inputs.PDIM, sim.inputs.QDIM, sim.inputs.PDES])
    }
    console.log("hice el llamado a prueba de eficiencia")
    this.http.post("http://127.0.0.1:5000/pruebaEficiencia/", JSON.stringify(envioPrueba)).subscribe((respuesta) => {
      let OUTPUT: Array<Array<any>> = []
      if (respuesta) {
        OUTPUT = respuesta as []
        console.log("Respuesta Teorica")
        for (let index = 0; index < this.simulacion.length; index++) {
          this.simulacion[index].outputTeorico.PSUC = OUTPUT[2][index + 1]
          this.simulacion[index].outputTeorico.PDES = OUTPUT[3][index + 1]
          this.simulacion[index].outputTeorico.TSUC = OUTPUT[4][index + 1]
          this.simulacion[index].outputTeorico.TDES = OUTPUT[5][index + 1]
          this.simulacion[index].outputTeorico.DG = OUTPUT[6][index + 1]
          this.simulacion[index].outputTeorico.HG = OUTPUT[7][index + 1]
          this.simulacion[index].outputTeorico.SURGE = OUTPUT[8][index + 1]
          this.simulacion[index].outputTeorico.QN = OUTPUT[9][index + 1]
          this.simulacion[index].outputTeorico.STONEW = OUTPUT[10][index + 1]
          this.simulacion[index].outputTeorico.CFHEAD = OUTPUT[11][index + 1]
          this.simulacion[index].outputTeorico.HEAD = OUTPUT[12][index + 1]
          this.simulacion[index].outputTeorico.EFIC = OUTPUT[13][index + 1]
          this.simulacion[index].outputTeorico.HP = OUTPUT[14][index + 1]
          this.simulacion[index].outputTeorico.POLLY = OUTPUT[15][index + 1]
          this.simulacion[index].outputTeorico.FLUJO = OUTPUT[16][index + 1]
          this.simulacion[index].outputTeorico.RPM = OUTPUT[17][index + 1]
        }
        console.log(respuesta)
      } else {
        console.log("no hubo respuesta")
      }
    })
    this.simInfo.simTipo = "R+T"
  }

  guardarPunto() {
    // Guardado en el documento
    console.log(this.simInfo.simId)
    if (this.simInfo.simId != "") {
      this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
        .collection("trenes").doc(this.dataEnviada.trenTag)
        .collection("simulaciones-campo").doc(this.simInfo.simId)
        .set({
          simulacion: JSON.parse(JSON.stringify(this.simulacion)),
          simDate: this.simInfo.simDate,
          simId: this.simInfo.simId,
          simTipo: this.simInfo.simTipo
        })
    } else {
      const docRef = this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
        .collection("trenes").doc(this.dataEnviada.trenTag)
        .collection("simulaciones-campo").doc()
      this.simInfo.simId = docRef.ref.id
      docRef.set({
        simulacion: JSON.parse(JSON.stringify(this.simulacion)),
        simDate: this.simInfo.simDate,
        simId: this.simInfo.simId,
        simTipo: this.simInfo.simTipo
      })
    }
    // Guardado en el indice:
    this.resumen.simId = this.simInfo.simId;
    this.resumen.simDate = this.simInfo.simDate;
    this.resumen.simCurvas = "";
    this.resumen.simTipo = this.simInfo.simTipo
    let simSecciones = []
    let numCompresor = 1
    for (let index = 0; index < this.simulacion.length; index++) {
      const element = this.simulacion[index];
      if (index > 0 && this.simulacion[index].equipoTag != this.simulacion[index - 1].equipoTag) {
        numCompresor++
      }
      const sim: simSeccion = {
        equipoTag: element.equipoTag,
        numCompresor: numCompresor,
        numSeccion: element.seccion,
        FLUJO: element.inputs.FLUJO,
        PSUC: element.inputs.PSUC,
        RPM: element.inputs.RPM,
        PDES: element.inputs.PDES,
        TSUC: element.inputs.TSUC,
        TDES: element.inputs.TDES,
        HP: element.outputAdim.HP,
        QN: element.outputAdim.qn,
        CFHEAD: element.outputAdim.CFHEAD,
        EFIC: element.outputAdim.EFIC,
      }
      simSecciones.push(sim)
    }
    this.resumen.simSecciones = simSecciones
    this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
      .collection("trenes").doc(this.dataEnviada.trenTag)
      .collection("indices-campo").doc("indice-campo").set({
        [this.simInfo.simId]: JSON.parse(JSON.stringify(this.resumen))
      }, {merge: true})
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

}
