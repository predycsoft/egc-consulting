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
    { nombre: 'Compresor/Seccion', var: 'fecha', min:null, max:null},
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

  constructor( private ngxCsvParser: NgxCsvParser, public dialog:MatDialog, private route: ActivatedRoute, private afs: AngularFirestore) { }
  // Variables para descarga de CSV
  csvRecords: any[] = [];
  header = false;
  file;

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.proyectoId = params.id
      this.route.params.subscribe( async params => {
        this.trenTag = params.trenTag
        const docTren = await this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).ref.get()
        this.tren = docTren.data() as tren
        this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("indices-campo").doc("indice-campo").valueChanges().subscribe(indice => {
          this.indice = indice
          this.simulaciones = Object.values(this.indice)
          console.log(this.simulaciones)
        })
      })
    })
  }

  actualMin;
  actualMax;
  selectedParam;
  iParam;

  clickParam(param, i){
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

  openDialogResultados(){
    const dialogRef = this.dialog.open(SimulacionCampoDialogResultadosComponent);
  }

  nuevaSimCampo(){
    // const dialogRef = this.dialog.open(DialogSimCampoComponent);
    const dialogRef = this.dialog.open(SimulacionCampoInputComponent, {
      data:{
        proyectoId: this.proyectoId,
        trenTag: this.trenTag,
      }
    })
  }
  openSimCampo(simId){
    // const dialogRef = this.dialog.open(DialogSimCampoComponent);
    const dialogRef = this.dialog.open(SimulacionCampoInputComponent, {
      data:{
        proyectoId: this.proyectoId,
        trenTag: this.trenTag,
        simId: simId
      }
    })
  }

  fileChangeListener($event: any){
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

  armarData(){
    let simulaciones: pruebaCampo[] = []
    for (let index = 1; index < this.csvRecords.length; index++) {
      const punto: Array<any> = this.csvRecords[index]
      const sim: pruebaCampo = new pruebaCampo
      sim.simId = punto[0]
      sim.simDate = punto[0]
      // i es el conteo de cada seccion que forma parte del tren
      let i = 0
      for (let comp = 1; comp < this.tren.equipos.length+1; comp++) {
        let nSec = 0
        if (this.tren.equipos[comp -1].tipologia == "Inline"){
          nSec = 1
        }
        if (this.tren.equipos[comp - 1].tipologia == "Back to Back"){
          nSec = 2
        }
        for (let sec = 1; sec < nSec+1; sec++) {
          i++
          let RPM = punto[1+21*(i-1)]
          let FLUJO = punto[2+21*(i-1)]
          let PSUC = punto[3+21*(i-1)]
          let PDES = punto[4+21*(i-1)]
          let TSUC = punto[5+21*(i-1)]
          let TDES = punto[6+21*(i-1)]
          const obj  = {
            equipoTag: this.tren.equipos[comp-1].tag,
            numSeccion: sec,
            numCompresor: comp,
            seccion: sec,
            RPM: RPM,
            FLUJO: FLUJO,
            PSUC: PSUC,
            PDES: PDES,
            TSUC: TSUC,
            TDES: TDES,
            HP:0,
            QN:0,
            CFHEAD: 0,
            EFIC:0,
          }
          sim.simSecciones.push(obj)
        }
      }
      simulaciones.push(sim)
      // sim.simTipo =
      // sim.simCurvas
    }
    this.simulaciones = simulaciones
    console.log(this.simulaciones)
  }

}
