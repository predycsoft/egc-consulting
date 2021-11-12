import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { tren } from 'src/app/services/data-service.service';
import { SimulacionCampoInputComponent } from '../../simulacion-campo-input/simulacion-campo-input.component';
import { DialogSimCampoComponent } from '../dialog-sim-campo/dialog-sim-campo.component';
import { SimulacionCampoDialogResultadosComponent } from '../simulacion-campo-dialog-resultados/simulacion-campo-dialog-resultados.component';

interface param {
  nombre: string;
  var: string;
  max: number;
  min: number;
}

class pruebaCampo {
  simDate: Date = new Date;
  simTipo: string = '';
  simCurvas: string = '';
  simSecciones: simSeccion[] = []
  totHP: number = 0;
  simId: string = '';
}

class simSeccion {
  equipoTag: string = '';
  numSeccion: number = 0;
  numCompresor: number = 0;
  seccion: number = 0;
  FLUJO: number = 0;
  PSUC: number = 0;
  PDES: number = 0;
  TSUC: number = 0;
  TDES: number = 0;
  RPM: number = 0;
  HP: number = 0;
  QN: number = 0;
  CFHEAD: number = 0;
  EFIC: number = 0;
  metano: number = 0;
  etano: number = 0;
  propano: number = 0;
  iButano: number = 0;
  nButano: number = 0;
  iPentano: number = 0;
  nPentano: number = 0;
  hexano: number = 0;
  heptano: number = 0;
  octano: number = 0;
  nonano: number = 0;
  decano: number = 0;
  nitrogeno: number = 0;
  dioxCarbono: number = 0;
  sulfHidrogeno: number = 0;
}

@Component({
  selector: 'simulacion-campo-lista',
  templateUrl: './simulacion-campo-lista.component.html',
  styleUrls: ['./simulacion-campo-lista.component.css']
})
export class SimulacionCampoListaComponent implements OnInit {

  params: param[] = [

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

  constructor(private ngxCsvParser: NgxCsvParser, public dialog: MatDialog, private route: ActivatedRoute, private afs: AngularFirestore) { }
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
        this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("indices-campo").doc("indice-campo").valueChanges().subscribe(indice => {
          this.indice = indice
          this.simulaciones = Object.values(this.indice)
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
  openSimCampo(simId) {
    // const dialogRef = this.dialog.open(DialogSimCampoComponent);
    const dialogRef = this.dialog.open(SimulacionCampoInputComponent, {
      data: {
        proyectoId: this.proyectoId,
        trenTag: this.trenTag,
        simId: simId
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

  totalizarHp(){
    for (let index = 0; index < this.simulaciones.length; index++) {
      const element = this.simulaciones[index]
      let totHP = 0
      for (let index = 0; index < element.simSecciones.length; index++) {
        const sim = element.simSecciones[index];
        totHP+= +sim.HP
      }
      this.simulaciones[index].totHP = totHP
    }
  }

  armarData() {
    let simulaciones: pruebaCampo[] = []
    for (let index = 1; index < this.csvRecords.length; index++) {
      const punto: Array<any> = this.csvRecords[index]
      const sim: pruebaCampo = new pruebaCampo
      sim.simId = punto[0]
      sim.simDate = new Date((+punto[0]-25569)*86400*1000)
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
          let RPM = punto[1 + 21 * (i - 1)]
          let FLUJO = punto[2 + 21 * (i - 1)]
          let PSUC = punto[3 + 21 * (i - 1)]
          let PDES = punto[4 + 21 * (i - 1)]
          let TSUC = punto[5 + 21 * (i - 1)]
          let TDES = punto[6 + 21 * (i - 1)]
          let metano = punto[7 + 21 * (i - 1)]
          let etano = punto[8 + 21 * (i - 1)]
          let propano = punto[9 + 21 * (i - 1)]
          let iButano = punto[10 + 21 * (i - 1)]
          let nButano = punto[11 + 21 * (i - 1)]
          let iPentano = punto[12+ 21 * (i - 1)]
          let nPentano = punto[13 + 21 * (i - 1)]
          let hexano = punto[14 + 21 * (i - 1)]
          let heptano = punto[15 + 21 * (i - 1)]
          let octano = punto[16+ 21 * (i - 1)]
          let nonano = punto[17 + 21 * (i - 1)]
          let decano = punto[18 + 21 * (i - 1)]
          let nitrogeno = punto[19 + 21 * (i - 1)]
          let dioxCarbono = punto[20 + 21 * (i - 1)]
          let sulfHidrogeno = punto[21 + 21 * (i - 1)]
          const obj = {
            equipoTag: this.tren.equipos[comp - 1].tag,
            numSeccion: sec,
            numCompresor: comp,
            seccion: sec,
            RPM: RPM,
            FLUJO: FLUJO,
            PSUC: PSUC,
            PDES: PDES,
            TSUC: TSUC,
            TDES: TDES,
            HP: 0,
            QN: 0,
            CFHEAD: 0,
            EFIC: 0,
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
            sulfHidrogeno: sulfHidrogeno
          }
          sim.simSecciones.push(obj)
        }
      }
      simulaciones.push(sim)
      // sim.simTipo =
      // sim.simCurvas
    }
    this.simulaciones = simulaciones
    this.totalizarHp()
    console.log(this.simulaciones)
  }

}
