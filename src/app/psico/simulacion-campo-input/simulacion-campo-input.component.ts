import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { cromatografia, curva, curvaEquipo, DataServiceService, equipo, mezcla, Proyecto, pruebaCampo, simSeccion, simulacionPE, tren } from 'src/app/services/data-service.service';
import { ChartType } from 'angular-google-charts';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CromatografiaComponent } from '../inputs/cromatografia/cromatografia.component';

class simInfo {
  simId: string = "";
  simDate: Date = new Date;
  simTipo: string = "";
  simTimestamp: number = 0
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

  tipoComparacion: string = 'porcentual'
  simFlag: boolean = false;

  simulacion: Array<simulacionPE> = [];
  simId: string = "";
  simInfo: simInfo = new simInfo;
  dataValidaAdim: boolean = false
  dataValidaTeorica: boolean = false


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
          // Caso de simulación existente o preexistente en el indice
          if (this.dataEnviada.simId == "nuevo") {
            const docIndice = await this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
              .collection("trenes").doc(this.dataEnviada.trenTag)
              .collection("indices-campo").doc("indice-campo").ref.get()
            let indice = docIndice.data()
            const punto = indice[this.dataEnviada.simTimestamp]
            this.resumen = punto
            this.simInfo = {
              simDate: punto.simDate,
              simId: punto.simTimestamp,
              simTipo: punto.simTipo,
              simTimestamp: punto.simtimestamp,
            }
            this.armarNuevaSim("indice")
          } else {
            const docSim = await this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
              .collection("trenes").doc(this.dataEnviada.trenTag)
              .collection("simulaciones-campo").doc(this.dataEnviada.simId).ref
              .get()
            this.simulacion = docSim.data()["simulacion"]
            this.simInfo = {
              simDate: docSim.data()["simDate"],
              simId: docSim.data()["simId"],
              simTipo: docSim.data()["simTipo"],
              simTimestamp: docSim.data()["timestamp"],
            }

          }
          // Caso de nuevo punto
        } else {
          this.armarNuevaSim("nuevo")
        }
      })
  }

  async armarNuevaSim(tipo: "nuevo" | "indice") {
    if (tipo == "nuevo") {
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
    if (tipo == "indice") {
      try {
        let simulaciones: simulacionPE[] = []
        this.simulacion = []
        let iSec = 0
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
            let cromatografiaOriginal: cromatografia = {
              metano: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.metano,
              etano: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.etano,
              propano: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.propano,
              iButano: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.iButano,
              nButano: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.nButano,
              iPentano: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.iPentano,
              nPentano: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.nPentano,
              hexano: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.hexano,
              heptano: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.heptano,
              octano: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.octano,
              nonano: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.nonano,
              decano: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.decano,
              nitrogeno: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.nitrogeno,
              dioxCarbono: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.dioxCarbono,
              sulfHidrogeno: this.resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.sulfHidrogeno,
              fraccMolar: 0,
            }
            let cromatografiaNormalizada: cromatografia = this.normalizarCromatografia(cromatografiaOriginal)
            let mezcla: mezcla = {
              id: "",
              nombre: `c:${i + 1}-s:${sec}-${this.resumen.simTimestamp}`,
              cromatografiaOriginal: cromatografiaOriginal,
              cromatografiaNormalizada: cromatografiaNormalizada
            }
            simulacion.inputs = {
              TSUC: this.resumen.simSecciones[iSec].TSUC,
              TDES: this.resumen.simSecciones[iSec].TDES,
              PSUC: this.resumen.simSecciones[iSec].PSUC,
              PDES: this.resumen.simSecciones[iSec].PDES,
              RPM: this.resumen.simSecciones[iSec].RPM,
              FLUJOSUC: this.resumen.simSecciones[iSec].FLUJOSUC,
              FLUJODES: this.resumen.simSecciones[iSec].FLUJODES,
              TDIM: this.tren.dimensiones.temperatura,
              PDIM: this.tren.dimensiones.presion,
              QDIM: this.tren.dimensiones.flujo,
              DDIM: this.tren.dimensiones.diametro,
              Mezcla: mezcla
            }
            simulacion.inputs.DDIM = this.tren.dimensiones.diametro
            simulacion.inputs.PDIM = this.tren.dimensiones.presion
            simulacion.inputs.QDIM = this.tren.dimensiones.flujo
            simulacion.inputs.TDIM = this.tren.dimensiones.temperatura
            simulaciones.push(simulacion)
            iSec++
          }
          curvas = []
        }
        this.simulacion = simulaciones
        simulaciones = []
      } catch (err) {
        console.log(err)
      }
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

    // Chequeo de variables para adim
    let seccionesValidas = 0
    for (let index = 0; index < this.simulacion.length; index++) {
      this.simulacion[index] = this.checkValidoAdim(this.simulacion[index]);
      if(this.simulacion[index].dataValidaAdim == true){
        seccionesValidas++
      }
    }
    if (seccionesValidas == this.simulacion.length) {
      // Rutina una vez que se ha validado
      // Armado de la data de envio
      let envio = []
      envio.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
        "Diametro", "TSUC", "PSUC", "TDES", "PDES", "FLUJO", "RPM", "DDIM", "TDIM", "PDIM", "QDIM"])
      for (let j = 0; j < this.simulacion.length; j++) {
        const sim = this.simulacion[j]
        envio.push([+sim.inputs.Mezcla.cromatografiaNormalizada.metano, +sim.inputs.Mezcla.cromatografiaNormalizada.etano, +sim.inputs.Mezcla.cromatografiaNormalizada.propano, sim.inputs.Mezcla.cromatografiaNormalizada.iButano, sim.inputs.Mezcla.cromatografiaNormalizada.nButano, sim.inputs.Mezcla.cromatografiaNormalizada.iPentano, sim.inputs.Mezcla.cromatografiaNormalizada.nPentano, sim.inputs.Mezcla.cromatografiaNormalizada.hexano, sim.inputs.Mezcla.cromatografiaNormalizada.heptano, sim.inputs.Mezcla.cromatografiaNormalizada.octano, sim.inputs.Mezcla.cromatografiaNormalizada.nonano, sim.inputs.Mezcla.cromatografiaNormalizada.decano, sim.inputs.Mezcla.cromatografiaNormalizada.nitrogeno, sim.inputs.Mezcla.cromatografiaNormalizada.dioxCarbono, sim.inputs.Mezcla.cromatografiaNormalizada.sulfHidrogeno,
        sim.curva.diametro, sim.inputs.TSUC, sim.inputs.PSUC, sim.inputs.TDES, sim.inputs.PDES, sim.inputs.FLUJOSUC, sim.inputs.RPM, sim.inputs.DDIM, sim.inputs.TDIM, sim.inputs.PDIM, sim.inputs.QDIM])
      }
      // Llamado a la rutina de adimensional en el servidor de python
      this.http.post("http://127.0.0.1:5000/adimensional/", JSON.stringify(envio)).subscribe(async (res) => {
        let OUTPUT: Array<Array<any>> = []
        if (res) {
          OUTPUT = res as []
          console.log("Respuesta de adimensional")
          console.log(res)
          // Actualizacion de las variables de Output
          for (let index = 0; index < this.simulacion.length; index++) {
            this.simulacion[index].outputAdim.EFICPOLI = OUTPUT[0][index + 1]
            this.simulacion[index].outputAdim.CFWORKPOLI = OUTPUT[1][index + 1]
            this.simulacion[index].outputAdim.CFHEADPOLI = OUTPUT[2][index + 1]
            this.simulacion[index].outputAdim.WORKPOLI = OUTPUT[3][index + 1]
            this.simulacion[index].outputAdim.HPGAS = OUTPUT[4][index + 1]
            this.simulacion[index].outputAdim.FLUJOMAS = OUTPUT[5][index + 1]
            this.simulacion[index].outputAdim.RELCOMP = OUTPUT[6][index + 1]
            this.simulacion[index].outputAdim.RELVOL = OUTPUT[7][index + 1]
            this.simulacion[index].outputAdim.TISEN = OUTPUT[8][index + 1]
            this.simulacion[index].outputAdim.PISEN = OUTPUT[9][index + 1]
            this.simulacion[index].outputAdim.DENSUC = OUTPUT[10][index + 1]
            this.simulacion[index].outputAdim.DENDES = OUTPUT[11][index + 1]
            this.simulacion[index].outputAdim.DENISEN = OUTPUT[12][index + 1]
            this.simulacion[index].outputAdim.VOLSUC = OUTPUT[13][index + 1]
            this.simulacion[index].outputAdim.VOLDES = OUTPUT[14][index + 1]
            this.simulacion[index].outputAdim.VOLISEN = OUTPUT[15][index + 1]
            this.simulacion[index].outputAdim.HSUC = OUTPUT[16][index + 1]
            this.simulacion[index].outputAdim.HDES = OUTPUT[17][index + 1]
            this.simulacion[index].outputAdim.HISEN = OUTPUT[18][index + 1]
            this.simulacion[index].outputAdim.SSUC = OUTPUT[19][index + 1]
            this.simulacion[index].outputAdim.SDES = OUTPUT[20][index + 1]
            this.simulacion[index].outputAdim.SISEN = OUTPUT[21][index + 1]
            this.simulacion[index].outputAdim.ZSUC = OUTPUT[22][index + 1]
            this.simulacion[index].outputAdim.ZDES = OUTPUT[23][index + 1]
            this.simulacion[index].outputAdim.ZISEN = OUTPUT[24][index + 1]
            this.simulacion[index].outputAdim.YWM = OUTPUT[25][index + 1]
            this.simulacion[index].outputAdim.QN = OUTPUT[26][index + 1]
            this.simulacion[index].simulacionAdim = true
          }
        }
      })
      this.simInfo.simTipo = "R"
    } else {
      alert("No se pudo simular porque la data no es valida")
    }
  }

  simularPE() {
    // Chequeo de variables para adim
    let seccionesValidas = 0
    for (let index = 0; index < this.simulacion.length; index++) {
      this.simulacion[index] = this.checkValidoTeorico(this.simulacion[index]);
      if(this.simulacion[index].dataValidaAdim == true){
        seccionesValidas++
      }
    }
    if(seccionesValidas == this.simulacion.length){
      let envioPrueba = []
      envioPrueba.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
        "TSUC", "PSUC", "FLUJO", "diametro", "RPM", "CP1", "CP2", "CP3", "CP4", "EXPOCP", "CE1", "CE2", "CE3", "CE4", "EXPOCE", "SURGE", "STONEW", "DDIM", "TDIM", "PDIM", "QDIM", "PDESCAMPO"])
      for (let j = 0; j < this.simulacion.length; j++) {
        const sim = this.simulacion[j]
        envioPrueba.push([+sim.inputs.Mezcla.cromatografiaNormalizada.metano, +sim.inputs.Mezcla.cromatografiaNormalizada.etano, +sim.inputs.Mezcla.cromatografiaNormalizada.propano, sim.inputs.Mezcla.cromatografiaNormalizada.iButano, sim.inputs.Mezcla.cromatografiaNormalizada.nButano, sim.inputs.Mezcla.cromatografiaNormalizada.iPentano, sim.inputs.Mezcla.cromatografiaNormalizada.nPentano, sim.inputs.Mezcla.cromatografiaNormalizada.hexano, sim.inputs.Mezcla.cromatografiaNormalizada.heptano, sim.inputs.Mezcla.cromatografiaNormalizada.octano, sim.inputs.Mezcla.cromatografiaNormalizada.nonano, sim.inputs.Mezcla.cromatografiaNormalizada.decano, sim.inputs.Mezcla.cromatografiaNormalizada.nitrogeno, sim.inputs.Mezcla.cromatografiaNormalizada.dioxCarbono, sim.inputs.Mezcla.cromatografiaNormalizada.sulfHidrogeno,
        sim.inputs.TSUC, sim.inputs.PSUC, sim.inputs.FLUJOSUC, sim.curva.diametro, sim.inputs.RPM, sim.curva.cc0, sim.curva.cc1, sim.curva.cc2, sim.curva.cc3, sim.curva.expocc, sim.curva.ce0, sim.curva.ce1, sim.curva.ce2, sim.curva.ce3, sim.curva.expoce, sim.curva.limSurge, sim.curva.limStw, sim.inputs.DDIM, sim.inputs.TDIM, sim.inputs.PDIM, sim.inputs.QDIM, sim.inputs.PDES])
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
            this.simulacion[index].outputTeorico.DENDES = OUTPUT[6][index + 1]
            this.simulacion[index].outputTeorico.HDES = OUTPUT[7][index + 1]
            this.simulacion[index].outputTeorico.SURGE = OUTPUT[8][index + 1]
            this.simulacion[index].outputTeorico.QN = OUTPUT[9][index + 1]
            this.simulacion[index].outputTeorico.STONEW = OUTPUT[10][index + 1]
            this.simulacion[index].outputTeorico.CFHEADPOLI = OUTPUT[11][index + 1]
            this.simulacion[index].outputTeorico.HEADPOLI = OUTPUT[12][index + 1]
            this.simulacion[index].outputTeorico.EFICPOLI = OUTPUT[13][index + 1]
            this.simulacion[index].outputTeorico.HPGAS = OUTPUT[14][index + 1]
            this.simulacion[index].outputTeorico.EXPPOLI = OUTPUT[15][index + 1]
            this.simulacion[index].outputTeorico.FLUJODES = OUTPUT[16][index + 1]
            this.simulacion[index].outputTeorico.RPM = OUTPUT[17][index + 1]
            this.simulacion[index].dataValidaTeorica = true
          }
          console.log(respuesta)
        } else {
          console.log("no hubo respuesta")
        }
      })
      this.simInfo.simTipo = "R+T"
    } else {
      alert("No se pudo simular porque la data no es valida")
    }
  }

  guardarPunto() {
    // Guardado en el documento
    console.log(this.simInfo.simId)
    if (this.simInfo.simId != "") {
      this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
        .collection("trenes").doc(this.dataEnviada.trenTag)
        .collection("simulaciones-campo").doc(`${this.simInfo.simId}`)
        .set({
          simulacion: JSON.parse(JSON.stringify(this.simulacion)),
          simDate: this.simInfo.simDate,
          simId: `${this.simInfo.simId}`,
          simTipo: this.simInfo.simTipo
        })
    } else {
      this.simInfo.simTimestamp = +this.simInfo.simDate * 1000
      const docRef = this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
        .collection("trenes").doc(this.dataEnviada.trenTag)
        .collection("simulaciones-campo").doc(`${this.simInfo.simTimestamp}`)
      docRef.set({
        simulacion: JSON.parse(JSON.stringify(this.simulacion)),
        simDate: this.simInfo.simDate,
        simId: this.simInfo.simId,
        simTipo: this.simInfo.simTipo,
        simTimestamp: this.simInfo.simTimestamp
      })
    }
    // Guardado en el indice:
    this.resumen.simId = `${this.simInfo.simId}`;
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
        seccion: element.seccion,
        FLUJOSUC: element.inputs.FLUJOSUC,
        FLUJODES: element.inputs.FLUJODES,
        PSUC: element.inputs.PSUC,
        RPM: element.inputs.RPM,
        PDES: element.inputs.PDES,
        TSUC: element.inputs.TSUC,
        TDES: element.inputs.TDES,
        HP: element.outputAdim.HPGAS,
        QN: element.outputAdim.QN,
        CFHEAD: element.outputAdim.CFHEADPOLI,
        EFIC: element.outputAdim.EFICPOLI,
        mezcla: element.inputs.Mezcla,
      }
      simSecciones.push(sim)
    }
    this.resumen.simSecciones = simSecciones
    this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
      .collection("trenes").doc(this.dataEnviada.trenTag)
      .collection("indices-campo").doc("indice-campo").set({
        [this.simInfo.simId]: JSON.parse(JSON.stringify(this.resumen))
      }, { merge: true })
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  normalizarCromatografia(original: cromatografia) {
    let sum =
      +original.metano
      + original.etano
      + original.propano
      + original.iButano
      + original.nButano
      + original.iPentano
      + original.nPentano
      + original.hexano
      + original.heptano
      + original.octano
      + original.nonano
      + original.decano
      + original.nitrogeno
      + original.dioxCarbono
      + original.sulfHidrogeno

    let normalizada: cromatografia = {
      metano: original.metano / sum,
      etano: original.etano / sum,
      propano: original.propano / sum,
      iButano: original.iButano / sum,
      nButano: original.nButano / sum,
      iPentano: original.iPentano / sum,
      nPentano: original.nPentano / sum,
      hexano: original.hexano / sum,
      heptano: original.heptano / sum,
      octano: original.octano / sum,
      nonano: original.nonano / sum,
      decano: original.decano / sum,
      nitrogeno: original.nitrogeno / sum,
      dioxCarbono: original.dioxCarbono / sum,
      sulfHidrogeno: original.sulfHidrogeno / sum,
      fraccMolar: 0
    }

    return normalizada
  }

  checkValidoAdim(simulacion: simulacionPE) {
    let sum = 0
    const cromatografia = Object.values(simulacion.inputs.Mezcla.cromatografiaNormalizada)
    for (let index = 0; index < cromatografia.length; index++) {
      sum += cromatografia[index];
    }
    if (sum != 1) {
      alert("cromatografia vacía o no normalizada")
      simulacion.dataValidaAdim = false
      return simulacion
    } else {
      if (
        simulacion.curva.diametro == 0 ||
        simulacion.inputs.TSUC == 0 ||
        simulacion.inputs.PSUC == 0 ||
        simulacion.inputs.TDES == 0 ||
        simulacion.inputs.PDES == 0 ||
        simulacion.inputs.FLUJOSUC == 0 ||
        simulacion.inputs.RPM == 0 ||
        simulacion.inputs.DDIM == "" ||
        simulacion.inputs.TDIM == "" ||
        simulacion.inputs.PDIM == "" ||
        simulacion.inputs.QDIM == ""
      ) {
        alert("faltan datos de simulación")
        simulacion.dataValidaAdim = false
        return simulacion
      } else {
        simulacion.dataValidaAdim = true
        return simulacion
      }
    }
  }

  checkValidoTeorico(simulacion: simulacionPE) {
    if (simulacion.simulacionAdim == false) {
      alert("No se ha realizado la prueba adimensional")
      simulacion.dataValidaTeorica = false
      return simulacion
    } else {
      let sum = 0
      const cromatografia = Object.values(simulacion.inputs.Mezcla.cromatografiaNormalizada)
      for (let index = 0; index < cromatografia.length; index++) {
        sum += cromatografia[index];
      }
      if (sum != 1) {
        alert("cromatografia vacía o no normalizada")
        simulacion.dataValidaTeorica = false
        return simulacion
      } else {
        if (
          simulacion.curva.diametro == 0 ||
          simulacion.inputs.TSUC == 0 ||
          simulacion.inputs.PSUC == 0 ||
          simulacion.inputs.PDES == 0 ||
          simulacion.inputs.FLUJOSUC == 0 ||
          simulacion.inputs.RPM == 0 ||
          simulacion.inputs.DDIM == "" ||
          simulacion.inputs.TDIM == "" ||
          simulacion.inputs.PDIM == "" ||
          simulacion.inputs.QDIM == "" ||
          simulacion.curva.expocc == 0 ||
          simulacion.curva.expoce == 0 ||
          simulacion.curva.limStw == 0 ||
          simulacion.curva.limSurge == 0
        ) {
          alert("faltan datos de simulación")
          simulacion.dataValidaTeorica = false
          return simulacion
        } else {
          simulacion.dataValidaTeorica = true
          return simulacion
        }
      }
    }
  }
}
