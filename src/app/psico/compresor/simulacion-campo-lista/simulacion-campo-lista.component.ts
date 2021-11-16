import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { find, timestamp } from 'rxjs/operators';
import { cromatografia, curva, equipo, mezcla, pruebaCampo, simSeccion, simulacionPE, simulacionTren, tren } from 'src/app/services/data-service.service';
import { SimulacionCampoInputComponent } from '../../simulacion-campo-input/simulacion-campo-input.component';
import { DialogSimCampoComponent } from '../dialog-sim-campo/dialog-sim-campo.component';
import { SimulacionCampoDialogResultadosComponent } from '../simulacion-campo-dialog-resultados/simulacion-campo-dialog-resultados.component';

interface param {
  nombre: string;
  var: string;
  max: number;
  min: number;
}

@Component({
  selector: 'simulacion-campo-lista',
  templateUrl: './simulacion-campo-lista.component.html',
  styleUrls: ['./simulacion-campo-lista.component.css']
})
export class SimulacionCampoListaComponent implements OnInit {

  params: param[] = [
    { nombre: "", var: "", min: null, max: null },
    { nombre: 'Fecha y hora.', var: 'fecha', min: null, max: null },
    { nombre: 'Simulacion', var: 'fecha', min: null, max: null },
    { nombre: 'Compresor/Seccion', var: 'fecha', min: null, max: null },
    { nombre: 'Q', var: 'q', min: null, max: null },
    { nombre: 'RPM', var: 'rpm', min: null, max: null },
    { nombre: 'Psucc.', var: 'psuc', min: null, max: null },
    { nombre: 'Pdesc.', var: 'pdesc', min: null, max: null },
    { nombre: 'Tsucc.', var: 'tsuc', min: null, max: null },
    { nombre: 'Tdesc.', var: 'tdesc', min: null, max: null },
    { nombre: 'Pot.', var: 'pot', min: null, max: null },
    { nombre: 'ΣPot.', var: 'potSum', min: null, max: null },
    // Coeficientes adimensionales
    { nombre: 'Q/N', var: 'cabP', min: null, max: null },
    { nombre: 'Coef. Cab. Poli', var: 'cabP', min: null, max: null },
    { nombre: 'Efic. Poli', var: 'efiP', min: null, max: null },
  ]

  proyectoId: string;
  trenTag: string;
  indice;
  simulaciones: pruebaCampo[] = []
  tren: tren
  equipos: equipo[]
  listaSimulaciones: string[] = []

  constructor(private ngxCsvParser: NgxCsvParser, public dialog: MatDialog, private route: ActivatedRoute, private afs: AngularFirestore, private http: HttpClient) { }
  // Variables para descarga de CSV
  csvRecords: any[] = [];
  header = false;
  file;

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.proyectoId = params.id
      this.route.params.subscribe(async params => {
        this.trenTag = params.trenTag
        const docTren = await this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).ref.get()
        this.tren = docTren.data() as tren
        let tags = []
        for (let index = 0; index < this.tren.equipos.length; index++) {
          const element = this.tren.equipos[index];
          tags.push(element.tag)
        }
        // Get Equipos
        this.afs.collection("proyectos").doc(this.proyectoId)
          .collection<equipo>("equipos").valueChanges().subscribe(async equipos => {
            this.equipos = []
            this.equipos = equipos.filter(x => tags.includes(x.tag))
          })
        this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("indices-campo").doc("indice-campo").valueChanges().subscribe(indice => {
          this.indice = indice
          this.simulaciones = Object.values(this.indice)
          this.simulaciones.sort((a, b) => +a.simTimestamp - +b.simTimestamp)
          this.totalizarHp()
          console.log(this.simulaciones)
        })
      })
    })
  }

  actualMin;
  actualMax;
  selectedParam;
  iParam;

  clickParam(param, i) {
    this.selectedParam = param
    this.iParam = i
    this.actualMin = this.params[this.iParam].min
    this.actualMax = this.params[this.iParam].max
  }

  aplicarFiltro($event: any) {
    $event.stopPropagation();
    //Another instructions
    this.params[this.iParam].min = this.actualMin;
    this.params[this.iParam].max = this.actualMax;
  }

  borrarFiltro($event: any) {
    $event.stopPropagation();
    //Another instructions
    this.params[this.iParam].min = null;
    this.params[this.iParam].max = null;
    this.actualMin = null;
    this.actualMax = null;
  }

  openDialogResultados() {
    const dialogRef = this.dialog.open(SimulacionCampoDialogResultadosComponent);
  }

  nuevaSimCampo() {
    // const dialogRef = this.dialog.open(DialogSimCampoComponent);
    const dialogRef = this.dialog.open(SimulacionCampoInputComponent, {
      data: {
        proyectoId: this.proyectoId,
        trenTag: this.trenTag,
      }
    })
  }
  openSimCampo(simId, simTimestamp) {
    // const dialogRef = this.dialog.open(DialogSimCampoComponent);
    if (simId == "") {
      simId = "nuevo"
    }
    const dialogRef = this.dialog.open(SimulacionCampoInputComponent, {
      data: {
        proyectoId: this.proyectoId,
        trenTag: this.trenTag,
        simId: simId,
        simTimestamp: simTimestamp
      }
    })
  }

  fileChangeListener($event: any) {
    const files = $event.srcElement.files;
    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ';' })
      .pipe().subscribe(result => {
        console.log('Result', result);
        if (result instanceof NgxCSVParserError) {
        } else {
          this.csvRecords = result;
          this.armarData();
        }
      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
      });
  }

  totalizarHp() {
    for (let index = 0; index < this.simulaciones.length; index++) {
      const element = this.simulaciones[index]
      let totHP = 0
      for (let index = 0; index < element.simSecciones.length; index++) {
        const sim = element.simSecciones[index];
        totHP += +sim.HP
      }
      this.simulaciones[index].totHP = totHP
    }
  }

  armarData() {
    let timestamps = []
    for (let index = 0; index < this.simulaciones.length; index++) {
      const element = this.simulaciones[index];
      timestamps.push(element.simTimestamp)
    }
    let simulaciones: pruebaCampo[] = []
    for (let index = 1; index < this.csvRecords.length; index++) {
      const punto: Array<any> = this.csvRecords[index]
      if (punto[0] != 0) {
        const sim: pruebaCampo = new pruebaCampo
        sim.simId = ""
        sim.simDate = new Date((+punto[0] - 25569) * 86400 * 1000)
        sim.simTimestamp = (+punto[0] - 25569) * 86400 * 1000 * 10000
        // i es el conteo de cada seccion que forma parte del tren
        let i = 0
        for (let comp = 1; comp < this.tren.equipos.length + 1; comp++) {
          let nSec = 0
          if (this.tren.equipos[comp - 1].tipologia == "Inline") {
            nSec = 1
          }
          if (this.tren.equipos[comp - 1].tipologia == "Back to Back") {
            nSec = 2
          }
          for (let sec = 1; sec < nSec + 1; sec++) {
            i++
            let RPM = +punto[1 + 21 * (i - 1)]
            let FLUJO = +punto[2 + 21 * (i - 1)]
            let PSUC = +punto[3 + 21 * (i - 1)]
            let PDES = +punto[4 + 21 * (i - 1)]
            let TSUC = +punto[5 + 21 * (i - 1)]
            let TDES = +punto[6 + 21 * (i - 1)]
            let metano = +punto[7 + 21 * (i - 1)]
            let etano = +punto[8 + 21 * (i - 1)]
            let propano = +punto[9 + 21 * (i - 1)]
            let iButano = +punto[10 + 21 * (i - 1)]
            let nButano = +punto[11 + 21 * (i - 1)]
            let iPentano = +punto[12 + 21 * (i - 1)]
            let nPentano = +punto[13 + 21 * (i - 1)]
            let hexano = +punto[14 + 21 * (i - 1)]
            let heptano = +punto[15 + 21 * (i - 1)]
            let octano = +punto[16 + 21 * (i - 1)]
            let nonano = +punto[17 + 21 * (i - 1)]
            let decano = +punto[18 + 21 * (i - 1)]
            let nitrogeno = +punto[19 + 21 * (i - 1)]
            let dioxCarbono = +punto[20 + 21 * (i - 1)]
            let sulfHidrogeno = +punto[21 + 21 * (i - 1)]
            let cromatografiaOriginal: cromatografia = {
              metano: metano,
              etano: etano,
              propano: propano,
              iButano: iButano,
              nButano: nButano,
              iPentano: iPentano,
              nPentano: nPentano,
              hexano: hexano,
              heptano: heptano,
              octano: octano,
              nonano: nonano,
              decano: decano,
              nitrogeno: nitrogeno,
              dioxCarbono: dioxCarbono,
              sulfHidrogeno: sulfHidrogeno,
              fraccMolar: 0,
            }
            let mezcla: mezcla = {
              cromatografiaOriginal: cromatografiaOriginal,
              cromatografiaNormalizada: this.normalizarCromatografia(cromatografiaOriginal),
              id: "",
              nombre: "",
            }
            const obj = {
              equipoTag: this.tren.equipos[comp - 1].tag,
              numSeccion: sec,
              numCompresor: comp,
              seccion: sec,
              RPM: RPM,
              FLUJODES: FLUJO,
              FLUJOSUC: FLUJO,
              PSUC: PSUC,
              PDES: PDES,
              TSUC: TSUC,
              TDES: TDES,
              HP: 0,
              QN: 0,
              CFHEAD: 0,
              EFIC: 0,
              mezcla: mezcla
            }

            sim.simSecciones.push(obj)
          }
        }
        if (timestamps.includes(sim.simTimestamp)) {
          simulaciones.push(this.simulaciones.find(x => x.simTimestamp == sim.simTimestamp))
        } else {
          simulaciones.push(sim)
        }
        // sim.simTipo =
        // sim.simCurvas
      }

    }
    this.simulaciones = simulaciones
    this.totalizarHp()
    console.log(this.simulaciones)
  }

  guardarIndice() {
    let indice = this.simulaciones.reduce((a, v) => ({ ...a, [v.simTimestamp]: JSON.parse(JSON.stringify(v)) }), {})
    console.log(indice)
    this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("indices-campo").doc("indice-campo").set({
      ...indice
    })
  }

  incluir(event, id) {
    if (event.checked) {
      this.listaSimulaciones.push(id)
    } else {
      const idx = this.listaSimulaciones.findIndex(x => x == id)
      this.listaSimulaciones.splice(idx, 1)
    }
    console.log(this.listaSimulaciones)
  }

  async simularMasivamenteAdim() {
    let simulaciones: simulacionTren[] = []
    const simulacionesRef = await this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection<simulacionTren>("simulaciones-campo").ref.get()
    simulacionesRef.docs.forEach(doc => {
      simulaciones.push(doc.data())
    })
    for (let index = 0; index < this.listaSimulaciones.length; index++) {
      const simResumen = this.simulaciones.find(x => +x.simTimestamp == +this.listaSimulaciones[index])
      let simulacion = new simulacionTren
      let simulacionesPE: simulacionPE[] = [];
      if (simResumen.simId == "") {
        if (this.armarNuevaSim(simResumen)) {
          simulacionesPE = await this.armarNuevaSim(simResumen)
        }
        simulacion = {
          simId: `${simResumen.simTimestamp}`,
          simDate: new Date(simResumen.simDate),
          simTipo: simResumen.simTipo,
          simTimestamp: simResumen.simTimestamp,
          simulaciones: simulacionesPE
        }
      } else {
        simulacion = simulaciones.find(x => +x.simTimestamp == +simResumen.simTimestamp)
        console.log(simulacion)
      }
      await this.simularAdim(simulacion)
    }
  }

  async simularMasivamenteTeorica(){
    let simulaciones: simulacionTren[] = []
    const simulacionesRef = await this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection<simulacionTren>("simulaciones-campo").ref.get()
    simulacionesRef.docs.forEach(doc => {
      simulaciones.push(doc.data())
    })
    for (let index = 0; index < this.listaSimulaciones.length; index++) {
      const simResumen = this.simulaciones.find(x => +x.simTimestamp == +this.listaSimulaciones[index])
      let simulacion = new simulacionTren
      let simulacionesPE: simulacionPE[] = [];
      if (simResumen.simId == "") {
        alert("no se puede simular un punto que no ha sido evaluado")
      } else {
        simulacion = {
          simId: `${simResumen.simTimestamp}`,
          simDate: new Date(simResumen.simDate),
          simTipo: simResumen.simTipo,
          simTimestamp: simResumen.simTimestamp,
          simulaciones: simulacionesPE
        }
        await this.simularPE(simulacion)
      }
    }
  }


  async armarNuevaSim(resumen: pruebaCampo) {
    let simulaciones: simulacionPE[] = []
    let iSec = 0
    for (let i = 0; i < this.equipos.length; i++) {
      let curvas = []
      const curvasDocs = await this.afs.collection("proyectos").doc(this.proyectoId).collection("equipos").doc(this.equipos[i].tag).collection("curvas").ref.get();
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
          metano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.metano,
          etano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.etano,
          propano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.propano,
          iButano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.iButano,
          nButano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.nButano,
          iPentano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.iPentano,
          nPentano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.nPentano,
          hexano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.hexano,
          heptano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.heptano,
          octano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.octano,
          nonano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.nonano,
          decano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.decano,
          nitrogeno: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.nitrogeno,
          dioxCarbono: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.dioxCarbono,
          sulfHidrogeno: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.sulfHidrogeno,
          fraccMolar: 0,
        }
        let cromatografiaNormalizada: cromatografia = this.normalizarCromatografia(cromatografiaOriginal)
        let mezcla: mezcla = {
          id: "",
          nombre: `c:${i + 1}-s:${sec}-${resumen.simTimestamp}`,
          cromatografiaOriginal: cromatografiaOriginal,
          cromatografiaNormalizada: cromatografiaNormalizada
        }
        simulacion.inputs = {
          TSUC: resumen.simSecciones[iSec].TSUC,
          TDES: resumen.simSecciones[iSec].TDES,
          PSUC: resumen.simSecciones[iSec].PSUC,
          PDES: resumen.simSecciones[iSec].PDES,
          RPM: resumen.simSecciones[iSec].RPM,
          FLUJOSUC: resumen.simSecciones[iSec].FLUJOSUC,
          FLUJODES: resumen.simSecciones[iSec].FLUJODES,
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
    return simulaciones

  }

  ///// SIMULACIONES

  async simularAdim(simulacionTren: simulacionTren) {
    console.log("entre a simular Adim")
    let simulacion = simulacionTren.simulaciones
    // Chequeo de variables para adim
    let seccionesValidas = 0
    for (let index = 0; index < simulacion.length; index++) {
      simulacion[index] = this.checkValidoAdim(simulacion[index]);
      if (simulacion[index].dataValidaAdim == true) {
        seccionesValidas++
      }
    }
    if (seccionesValidas == simulacion.length) {
      // Rutina una vez que se ha validado
      // Armado de la data de envio
      let envio = []
      envio.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
        "Diametro", "TSUC", "PSUC", "TDES", "PDES", "FLUJO", "RPM", "DDIM", "TDIM", "PDIM", "QDIM"])
      for (let j = 0; j < simulacion.length; j++) {
        const sim = simulacion[j]
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
          for (let index = 0; index < simulacion.length; index++) {
            simulacion[index].outputAdim.EFICPOLI = OUTPUT[0][index + 1]
            simulacion[index].outputAdim.CFWORKPOLI = OUTPUT[1][index + 1]
            simulacion[index].outputAdim.CFHEADPOLI = OUTPUT[2][index + 1]
            simulacion[index].outputAdim.WORKPOLI = OUTPUT[3][index + 1]
            simulacion[index].outputAdim.HPGAS = OUTPUT[4][index + 1]
            simulacion[index].outputAdim.FLUJOMAS = OUTPUT[5][index + 1]
            simulacion[index].outputAdim.RELCOMP = OUTPUT[6][index + 1]
            simulacion[index].outputAdim.RELVOL = OUTPUT[7][index + 1]
            simulacion[index].outputAdim.TISEN = OUTPUT[8][index + 1]
            simulacion[index].outputAdim.PISEN = OUTPUT[9][index + 1]
            simulacion[index].outputAdim.DENSUC = OUTPUT[10][index + 1]
            simulacion[index].outputAdim.DENDES = OUTPUT[11][index + 1]
            simulacion[index].outputAdim.DENISEN = OUTPUT[12][index + 1]
            simulacion[index].outputAdim.VOLSUC = OUTPUT[13][index + 1]
            simulacion[index].outputAdim.VOLDES = OUTPUT[14][index + 1]
            simulacion[index].outputAdim.VOLISEN = OUTPUT[15][index + 1]
            simulacion[index].outputAdim.HSUC = OUTPUT[16][index + 1]
            simulacion[index].outputAdim.HDES = OUTPUT[17][index + 1]
            simulacion[index].outputAdim.HISEN = OUTPUT[18][index + 1]
            simulacion[index].outputAdim.SSUC = OUTPUT[19][index + 1]
            simulacion[index].outputAdim.SDES = OUTPUT[20][index + 1]
            simulacion[index].outputAdim.SISEN = OUTPUT[21][index + 1]
            simulacion[index].outputAdim.ZSUC = OUTPUT[22][index + 1]
            simulacion[index].outputAdim.ZDES = OUTPUT[23][index + 1]
            simulacion[index].outputAdim.ZISEN = OUTPUT[24][index + 1]
            simulacion[index].outputAdim.YWM = OUTPUT[25][index + 1]
            simulacion[index].outputAdim.QN = OUTPUT[26][index + 1]
            simulacion[index].simulacionAdim = true
          }
        }
      })
      simulacionTren.simTipo = "R"
      await this.guardarPunto(simulacionTren)
    } else {
      return alert("No se pudo simular porque la data no es valida")
    }
  }

  async simularPE(simulacionTren: simulacionTren) {
    let simulacion = simulacionTren.simulaciones
    // Chequeo de variables para adim
    let seccionesValidas = 0
    for (let index = 0; index < simulacion.length; index++) {
      simulacion[index] = this.checkValidoTeorico(simulacion[index]);
      if (simulacion[index].dataValidaAdim == true) {
        seccionesValidas++
      }
    }
    if (seccionesValidas == simulacion.length) {
      let envioPrueba = []
      envioPrueba.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
        "TSUC", "PSUC", "FLUJO", "diametro", "RPM", "CP1", "CP2", "CP3", "CP4", "EXPOCP", "CE1", "CE2", "CE3", "CE4", "EXPOCE", "SURGE", "STONEW", "DDIM", "TDIM", "PDIM", "QDIM", "PDESCAMPO"])
      for (let j = 0; j < simulacion.length; j++) {
        const sim = simulacion[j]
        envioPrueba.push([+sim.inputs.Mezcla.cromatografiaNormalizada.metano, +sim.inputs.Mezcla.cromatografiaNormalizada.etano, +sim.inputs.Mezcla.cromatografiaNormalizada.propano, sim.inputs.Mezcla.cromatografiaNormalizada.iButano, sim.inputs.Mezcla.cromatografiaNormalizada.nButano, sim.inputs.Mezcla.cromatografiaNormalizada.iPentano, sim.inputs.Mezcla.cromatografiaNormalizada.nPentano, sim.inputs.Mezcla.cromatografiaNormalizada.hexano, sim.inputs.Mezcla.cromatografiaNormalizada.heptano, sim.inputs.Mezcla.cromatografiaNormalizada.octano, sim.inputs.Mezcla.cromatografiaNormalizada.nonano, sim.inputs.Mezcla.cromatografiaNormalizada.decano, sim.inputs.Mezcla.cromatografiaNormalizada.nitrogeno, sim.inputs.Mezcla.cromatografiaNormalizada.dioxCarbono, sim.inputs.Mezcla.cromatografiaNormalizada.sulfHidrogeno,
        sim.inputs.TSUC, sim.inputs.PSUC, sim.inputs.FLUJOSUC, sim.curva.diametro, sim.inputs.RPM, sim.curva.cc0, sim.curva.cc1, sim.curva.cc2, sim.curva.cc3, sim.curva.expocc, sim.curva.ce0, sim.curva.ce1, sim.curva.ce2, sim.curva.ce3, sim.curva.expoce, sim.curva.limSurge, sim.curva.limStw, sim.inputs.DDIM, sim.inputs.TDIM, sim.inputs.PDIM, sim.inputs.QDIM, sim.inputs.PDES])
      }
      console.log("hice el llamado a prueba de eficiencia")
      this.http.post("http://127.0.0.1:5000/pruebaEficiencia/", JSON.stringify(envioPrueba)).subscribe((respuesta) => {
        let OUTPUT: Array<Array<any>> = []
        if (respuesta) {
          OUTPUT = respuesta as []
          console.log("Respuesta Teorica")
          for (let index = 0; index < simulacion.length; index++) {
            simulacion[index].outputTeorico.PSUC = OUTPUT[2][index + 1]
            simulacion[index].outputTeorico.PDES = OUTPUT[3][index + 1]
            simulacion[index].outputTeorico.TSUC = OUTPUT[4][index + 1]
            simulacion[index].outputTeorico.TDES = OUTPUT[5][index + 1]
            simulacion[index].outputTeorico.DENDES = OUTPUT[6][index + 1]
            simulacion[index].outputTeorico.HDES = OUTPUT[7][index + 1]
            simulacion[index].outputTeorico.SURGE = OUTPUT[8][index + 1]
            simulacion[index].outputTeorico.QN = OUTPUT[9][index + 1]
            simulacion[index].outputTeorico.STONEW = OUTPUT[10][index + 1]
            simulacion[index].outputTeorico.CFHEADPOLI = OUTPUT[11][index + 1]
            simulacion[index].outputTeorico.HEADPOLI = OUTPUT[12][index + 1]
            simulacion[index].outputTeorico.EFICPOLI = OUTPUT[13][index + 1]
            simulacion[index].outputTeorico.HPGAS = OUTPUT[14][index + 1]
            simulacion[index].outputTeorico.EXPPOLI = OUTPUT[15][index + 1]
            simulacion[index].outputTeorico.FLUJODES = OUTPUT[16][index + 1]
            simulacion[index].outputTeorico.RPM = OUTPUT[17][index + 1]
            simulacion[index].dataValidaTeorica = true
          }
          console.log(respuesta)
        } else {
          console.log("no hubo respuesta")
        }
      })
      simulacionTren.simTipo = "R+T"
    } else {
      alert("No se pudo simular porque la data no es valida")
    }
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

  async guardarPunto(simulacion: simulacionTren) {
    console.log("entre a guardar punto")
    // Guardado en el documento
    console.log(simulacion.simId)
    if (simulacion.simId != "") {
      this.afs.collection("proyectos").doc(this.proyectoId)
        .collection("trenes").doc(this.trenTag)
        .collection("simulaciones-campo").doc(`${simulacion.simId}`)
        .set({
          simulacion: JSON.parse(JSON.stringify(simulacion.simulaciones)),
          simDate:simulacion.simDate,
          simId: `${simulacion.simId}`,
          simTipo: simulacion.simTipo,
          simTimestamp: simulacion.simTimestamp
        })
    } else {
      simulacion.simTimestamp = +simulacion.simDate * 1000
      const docRef = this.afs.collection("proyectos").doc(this.proyectoId)
        .collection("trenes").doc(this.trenTag)
        .collection("simulaciones-campo").doc(`${simulacion.simTimestamp}`)
      await docRef.set({
        simulacion: JSON.parse(JSON.stringify(simulacion)),
        simDate: simulacion.simDate,
        simId: simulacion.simId,
        simTipo: simulacion.simTipo,
        simTimestamp: simulacion.simTimestamp
      })
    }
    // Guardado en el indice:
    let resumen: pruebaCampo = new pruebaCampo
    resumen.simId = `${simulacion.simId}`;
    resumen.simDate = simulacion.simDate;
    resumen.simCurvas = "";
    resumen.simTipo = simulacion.simTipo;
    resumen.simTimestamp = simulacion.simTimestamp
    let simSecciones = []
    let numCompresor = 1
    for (let index = 0; index < simulacion.simulaciones.length; index++) {
      const element = simulacion.simulaciones[index];
      if (index > 0 && simulacion.simulaciones[index].equipoTag != simulacion.simulaciones[index - 1].equipoTag) {
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
    resumen.simSecciones = simSecciones
    await this.afs.collection("proyectos").doc(this.proyectoId)
      .collection("trenes").doc(this.trenTag)
      .collection("indices-campo").doc("indice-campo").set({
        [resumen.simId]: JSON.parse(JSON.stringify(resumen))
      }, { merge: true })
  }
}
