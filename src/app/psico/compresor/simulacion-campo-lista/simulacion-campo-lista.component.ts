import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { find, timestamp } from 'rxjs/operators';
import { cromatografia, curva, equipo, mezcla, outputTren, outputTrenAdim, pruebaCampo, simSeccion, simulacionPE, simulacionTren, tren } from 'src/app/services/data-service.service';
import { SimulacionCampoInputComponent } from '../../simulacion-campo-input/simulacion-campo-input.component';
import { DialogSimCampoComponent } from '../dialog-sim-campo/dialog-sim-campo.component';
import { SimulacionCampoDialogResultadosComponent } from '../simulacion-campo-dialog-resultados/simulacion-campo-dialog-resultados.component';
import * as firebase from 'firebase/app';
import { SimulacionService } from 'src/app/services/simulacion.service';
import { DialogService } from 'src/app/services/dialog.service';

interface param {
  nombre: string;
  var: string;
  filter: filter[];
  filtered: boolean
}

interface filter {
  min: number,
  max: number,
}

@Component({
  selector: 'simulacion-campo-lista',
  templateUrl: './simulacion-campo-lista.component.html',
  styleUrls: ['./simulacion-campo-lista.component.css']
})
export class SimulacionCampoListaComponent implements OnInit {

  params: param[] = []

  proyectoId: string;
  trenTag: string;
  indice;
  simulaciones: pruebaCampo[] = []
  filteredSimulaciones: pruebaCampo[] = []
  tren: tren
  equipos: equipo[]
  listaSimulaciones: string[] = []

  constructor(
    private ngxCsvParser: NgxCsvParser,
    public dialog: MatDialog,
    public dialogService: DialogService,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private ss: SimulacionService,
    private http: HttpClient) { }
  // Variables para descarga de CSV
  csvRecords: any[] = [];
  header = false;
  fechaMin = null;
  fechaMax = null;
  file;
  range = []

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
            let secciones = 0
            for (let eq = 0; eq < this.equipos.length; eq++) {
              secciones += this.equipos[eq].nSecciones;
            }
            let filter = []
            this.range = []
            console.log(secciones)
            for (let index = 0; index < secciones; index++) {
              filter.push({
                min: null,
                max: null,
              })
              this.range.push({
                min: null,
                max: null,
              })

            }
            this.params = [
              { nombre: "", var: "", filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              { nombre: 'Fecha y hora.', var: 'fecha', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              { nombre: 'Simulacion', var: 'simulacion', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              { nombre: 'Compresor/Seccion', var: 'compresor', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              { nombre: `Flujo ${this.tren.dimensiones.flujo}`, var: 'q', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              { nombre: 'RPM', var: 'rpm', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              { nombre: `Psucc. ${this.tren.dimensiones.presion}`, var: 'psuc', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              { nombre: `Pdesc. ${this.tren.dimensiones.presion}`, var: 'pdes', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              { nombre: `Tsucc. ${this.tren.dimensiones.temperatura}`, var: 'tsuc', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              { nombre: `Tdesc. ${this.tren.dimensiones.temperatura}`, var: 'tdes', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              { nombre: 'Pot.', var: 'hpgas', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              { nombre: 'ΣPot.', var: 'hpgastot', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              // Coeficientes adimensionales
              { nombre: 'Q/N', var: 'qn', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              { nombre: 'Coef. Cab. Poli', var: 'cabP', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
              { nombre: 'Efic. Poli', var: 'efiP', filter: JSON.parse(JSON.stringify(filter)), filtered: false },
            ]
          })
        this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("indices-campo").doc("indice-campo").valueChanges().subscribe(indice => {
          this.indice = indice
          this.simulaciones = Object.values(this.indice)
          this.simulaciones.sort((a, b) => +a.simTimestamp - +b.simTimestamp)
          this.filteredSimulaciones = this.simulaciones
          console.log(this.simulaciones)
        })
      })
    })
  }
  selectedParam;
  iParam;

  clickParam(param, i) {
    this.selectedParam = param
    this.iParam = i
    this.range = this.params[this.iParam].filter
  }

  aplicarFiltro($event: any, i) {
    $event.stopPropagation();
    //Another instructions
    if(this.selectedParam == "fecha"){
      if(this.fechaMin) this.range[0].min = +new Date(this.fechaMin)*10000; else this.range[0].min = null
      if(this.fechaMax) this.range[0].max = +new Date(this.fechaMax)*10000; else this.range[0].max = null
      console.log(this.range)
      console.log(this.simulaciones[0].simTimestamp)
    }
    this.params[this.iParam].filter[i].min = this.range[i].min;
    this.params[this.iParam].filter[i].max = this.range[i].max;
    this.filtrar()
  }

  borrarFiltro($event: any, i) {
    $event.stopPropagation();
    //Another instructions
    this.params[this.iParam].filter[i].min = null;
    this.params[this.iParam].filter[i].max = null;
    this.filtrar()
  }

  filtrar() {
    this.filteredSimulaciones = this.simulaciones
    for (let index = 0; index < this.params.length; index++) {
      for (let i = 0; i < this.simulaciones[0].simSecciones.length; i++) {
        let min = 0
        let max = 0
        if ( this.params[index].filter.findIndex(x => x.min != null) == -1 && this.params[index].filter.findIndex(x => x.max != null) == -1){
          this.params[index].filtered = false
        }
        if(this.params[index].filter[i].min == null){
          min = -1000000000000000000000000000
        } else {
          min = this.params[index].filter[i].min
          this.params[index].filtered = true
        }
        if(this.params[index].filter[i].max == null){
          max = 10000000000000000000000000000
        } else {
          max = this.params[index].filter[i].max
          this.params[index].filtered = true
        }
        const param = this.params[index].var;
        if (param == "fecha") {
          if(i == 0) this.filteredSimulaciones = this.filteredSimulaciones.filter(x => x.simTimestamp >= min && x.simTimestamp <= max)
        }
        if (param == "q") {
          this.filteredSimulaciones = this.filteredSimulaciones.filter(x => x.simSecciones[i].FLUJOSUC >= min && x.simSecciones[i].FLUJOSUC <= max)
        }
        if (param == "rpm") {
          this.filteredSimulaciones = this.filteredSimulaciones.filter(x => x.simSecciones[i].RPM >= min && x.simSecciones[i].RPM <= max)
        }
        if (param == "psuc") {
          this.filteredSimulaciones = this.filteredSimulaciones.filter(x => x.simSecciones[i].PSUC >= min && x.simSecciones[i].PSUC <= max)
        }
        if (param == "pdes") {
          this.filteredSimulaciones = this.filteredSimulaciones.filter(x => x.simSecciones[i].PDES >= min && x.simSecciones[i].PDES <= max)
        }
        if (param == "tsuc") {
          this.filteredSimulaciones = this.filteredSimulaciones.filter(x => x.simSecciones[i].TSUC >= min && x.simSecciones[i].TSUC <= max)
        }
        if (param == "tdes") {
          this.filteredSimulaciones = this.filteredSimulaciones.filter(x => x.simSecciones[i].TDES >= min && x.simSecciones[i].TDES <= max)
        }
        if (param == "hpgas") {
          this.filteredSimulaciones = this.filteredSimulaciones.filter(x => x.simSecciones[i].HPGAS >= min && x.simSecciones[i].HPGAS <= max)
        }
        if (param == "hpgastot") {
          this.filteredSimulaciones = this.filteredSimulaciones.filter(x => x.simTren.HPGAS >= min && x.simTren.HPGAS <= max)
        }
        if (param == "qn") {
          if(i == 0) this.filteredSimulaciones = this.filteredSimulaciones.filter(x => x.simSecciones[i].QN >= min && x.simSecciones[i].QN <= max)
        }
        if (param == "cabP") {
          this.filteredSimulaciones = this.filteredSimulaciones.filter(x => x.simSecciones[i].HEADPOLI >= min && x.simSecciones[i].HEADPOLI <= max)
        }
        if (param == "efiP") {
          console.log(min, max)
          this.filteredSimulaciones = this.filteredSimulaciones.filter(x => x.simSecciones[i].EFIC >= min && x.simSecciones[i].EFIC <= max)
        }
      }
    }
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
        simTimestamp: simTimestamp,
        simulacionResumen: this.simulaciones.find(x => x.simTimestamp == simTimestamp)
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
        totHP += +sim.HPGAS
      }
      this.simulaciones[index].totHP = totHP
    }
  }

  async armarData() {
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
        sim.simTren = new outputTrenAdim
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
              cromatografiaNormalizada:  this.ss.normalizarCromatografia(cromatografiaOriginal),
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
              HPGAS: 0,
              QN: 0,
              CFHEAD: 0,
              EFIC: 0,
              HEADPOLI: 0,
              HEADISEN: 0,
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
    await this.guardarIndice()
    this.dialogService.dialogExito()
  }

  async guardarIndice() {
    let indice = this.simulaciones.reduce((a, v) => ({ ...a, [v.simTimestamp]: JSON.parse(JSON.stringify(v)) }), {})
    console.log(indice)
    await this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("indices-campo").doc("indice-campo").set({
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
        simulacionesPE = await this.ss.armarNuevaSimPE(this.proyectoId, this.tren, simResumen, this.equipos, "indice")
        simulacion = {
          simId: `${simResumen.simTimestamp}`,
          simDate: new Date(simResumen.simDate),
          simTipo: simResumen.simTipo,
          simTimestamp: simResumen.simTimestamp,
          simulacion: simulacionesPE,
          outputTren: new outputTren,
          mapaTrenReal: [],
          mapaTrenTeorico: []
        }
      } else {
        simulacion = simulaciones.find(x => +x.simTimestamp == +simResumen.simTimestamp)
        console.log(simulacion)
      }
      await this.simularAdim(simulacion)
    }
    this.listaSimulaciones = []
  }

  async simularMasivamenteTeorica() {
    let simulaciones: simulacionTren[] = []
    const simulacionesRef = await this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection<simulacionTren>("simulaciones-campo").ref.get()
    simulacionesRef.docs.forEach(doc => {
      simulaciones.push(doc.data())
    })
    for (let index = 0; index < this.listaSimulaciones.length; index++) {
      const simResumen = this.simulaciones.find(x => +x.simTimestamp == +this.listaSimulaciones[index])
      let simulacion = new simulacionTren
      if (simResumen.simId == "") {
        alert("no se puede simular un punto que no ha sido evaluado")
      } else {
        simulacion = simulaciones.find(x => +x.simTimestamp == +simResumen.simTimestamp)
        await this.simularPE(simulacion)
      }
    }
    this.listaSimulaciones = []
  }

  ///// SIMULACIONES

  async simularAdim(simulacionTren: simulacionTren) {
    console.log(simulacionTren)
    await this.ss.simularAdim(this.proyectoId, this.tren.tag, simulacionTren)
  }

  async simularPE(simulacionTren: simulacionTren) {
    await this.ss.simularPE(this.proyectoId, this.tren.tag, simulacionTren)
    await this.ss.generarMapasPE(simulacionTren, this.equipos, this.proyectoId, this.tren.tag)
    await this.ss.generarMapasReal(simulacionTren, this.equipos, this.proyectoId, this.tren.tag)
  }

  async borrarPuntos() {
    for (let index = 0; index < this.listaSimulaciones.length; index++) {
      const element = this.listaSimulaciones[index];
      await this.borrarPunto(element)
    }
    this.listaSimulaciones = []
    this.dialogService.dialogExito()
  }

  async borrarPunto(timestamp: string) {
    let punto = this.simulaciones.find(x => +x.simTimestamp == +timestamp)
    console.log(punto)
    await this.ss.borrarPunto(this.proyectoId, this.tren.tag, timestamp, punto)
  }

  async marcarTodos() {
    this.listaSimulaciones = []
    this.simulaciones.forEach(x => {
      x.checked = true
      this.listaSimulaciones.push(x.simTimestamp.toString())
    })
    console.log(this.listaSimulaciones)
  }

  async marcarTodosNoSim() {
    this.listaSimulaciones = []
    this.simulaciones.forEach(x => {
      if (x.simTipo != "R+T") {
        x.checked = true
        this.listaSimulaciones.push(x.simTimestamp.toString())
      }
    })
    console.log(this.listaSimulaciones)
  }

  async desmarcarTodos() {
    this.listaSimulaciones = []
    this.simulaciones.forEach(x => x.checked = false)
    console.log(this.listaSimulaciones)
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }

  matpickerToTimestamp(){

  }
}
