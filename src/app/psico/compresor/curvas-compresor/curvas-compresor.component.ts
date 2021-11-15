import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'angular-google-charts';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { curva, DataServiceService, equipo, Proyecto } from 'src/app/services/data-service.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DialogPolinomiosCurvasCompresorComponent } from '../dialog-polinomios-curvas-compresor/dialog-polinomios-curvas-compresor.component';



// A traves del front:
// 1: Se selecciona la seccion -> se filtra la data segun el numero de la sección
// 2: 

@Component({
  selector: 'curvas-compresor',
  templateUrl: './curvas-compresor.component.html',
  styleUrls: ['./curvas-compresor.component.css']
})
export class CurvasCompresorComponent implements OnInit {

  proyecto: Proyecto;
  equipo: equipo
  impEqSel: string = '';
  impSel: number;
  impulsores: curva[] = []
  filteredImpulsores: curva[] = []
  impusoresEq: curva[] = []
  filteredImpulsoresEq: curva[] = []
  curvas: curva[] = []
  seccionActual: number = 1;
  secciones: number[] = [];
  trenTag;
  nSecciones;
  flagEqFab = false
  flagEqPsico = false

  nombre = ""
  agregando = false


  usuario = JSON.parse(localStorage.getItem("user"))

  // VARIABLES DE CREACION Y VISUALIZACION DE POLINOMIOS

  curvaCargada = false

  // Carga de documento
  csvRecords: any[] = [];
  header = true;
  file;

  // Envio de data
  url = "http://127.0.0.1:5000/ajustecurva/"
  envio;
  ///////////////// Grafica //////////////////////
  // Data para el plot
  yDataCp: Array<Array<number>> = [];
  yDataCe: Array<Array<number>> = [];
  // options
  type = ChartType.LineChart
  mostrarGraficaCP = false
  mostrarGraficaCE = false
  columnsCP = ["Q/N", "Escaneada", "Generada"]
  columnsCE = ["Q/N", "Escaneada", "Generada"]
  optionsCp;
  optionsCe;
  width = 390;
  height = 290;
  // 
  curva: curva = new curva

  tipoAjuste: string = 'Automatico';
  grado: number;
  unidadFlujo: string = 'Q/N';

  constructor(private route: ActivatedRoute, public dialog: MatDialog, public data: DataServiceService, private afs: AngularFirestore, public dialogService: DialogService, private ngxCsvParser: NgxCsvParser, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.route.params.subscribe(params => {
          const trenTag = params.trenTag;
          const equipoTag = params.equipoTag;
          this.data.obtenerEquipo(this.proyecto.id, equipoTag).subscribe((equipo) => {
            this.equipo = equipo
            console.log("equipo tag" + this.equipo.tag)
            this.nSecciones = this.equipo.nSecciones
            this.secciones = Array(this.nSecciones).fill(0).map((x,i)=>i+1); // [0,1,2,3,4]
            this.cargarImpulsores();
          })
        })
      })
    })
  }
  verCurva(equivalente, nombre, numImpulsor){
    if (equivalente == true){
      this.curva = this.filteredImpulsoresEq.find(x => x.nombre == nombre)
    } else {
      this.curva = this.filteredImpulsores.find(x => x.numImpulsor == numImpulsor)
    }
    console.log(this.curva)
    this.curvaCargada = true
    if (this.curva.expocp != 0) {
      this.verGraficaCP()
      this.verGraficaEfi()
    }
  }

  seleccionarImpulsorEquivalente(data) {
    this.impEqSel = data;
    this.impSel = -1;
  }


  seleccionarImpulsor(i) {
    this.impSel = i;
  }

  // openDialogPolinomios(i:number,nombre: string) {
  //   if(i == 0){
  //       let impulsor = this.impusoresEq.find(x => x.nombre == nombre)
  //       console.log(impulsor)
  //       const dialogRef = this.dialog.open(DialogPolinomiosCurvasCompresorComponent, {
  //         data: {
  //           equipoTag: this.equipo.tag,
  //           proyectoId: this.proyecto.id,
  //           impulsor: impulsor,
  //           equivalente: true,
  //           fab: false,
  //           seccion: this.seccionActual,
  //         }
  //       });
  //     } else {
  //     const dialogRef = this.dialog.open(DialogPolinomiosCurvasCompresorComponent, {
  //       data: {
  //         equipoTag: this.equipo.tag,
  //           proyectoId: this.proyecto.id,
  //           impulsor: this.filteredImpulsores.find(x => x.numImpulsor == i ),
  //           equivalente: false,
  //           fab: true,
  //           seccion: this.seccionActual,
  //       }
  //     });
  //   }
  // }

  cargarImpulsores() {
    this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipo.tag).collection<curva>("curvas").valueChanges().subscribe(curvas => {
      this.curvas = curvas
      this.impusoresEq = []
      this.impulsores = []
      for (let index = 0; index < this.curvas.length; index++) {
        const curva: curva = curvas[index];
        if(curva.equivalente == true){
            this.impusoresEq = this.impusoresEq.concat(curva)
        } else {
          this.impulsores = this.impulsores.concat(curva)
        }
      }
      this.filterImpulsores()
    })
  }
  async agregarImpulsor(){
    let impulsor = new curva()
    impulsor.numImpulsor = this.filteredImpulsores.length + 1
    console.log(this.usuario)
    impulsor.ultimoEditor = this.usuario.correo
    impulsor.fab = true
    impulsor.equivalente = false
    impulsor.numSeccion = this.seccionActual
    await this.afs.collection("proyectos")
    .doc(this.proyecto.id)
    .collection("equipos")
    .doc(this.equipo.tag)
    .collection("curvas")
    .doc(`s${this.seccionActual}-impulsor-${impulsor.numImpulsor}`).set({...impulsor})
    this.equipo.nImpulsores[this.seccionActual -1]++
    await this.afs.collection("proyectos")
    .doc(this.proyecto.id)
    .collection("equipos")
    .doc(this.equipo.tag).update({
      nImpulsores: this.equipo.nImpulsores
    })
  }

  async agregarImpulsorEquivalente(nombre: string){
    nombre = nombre.replace(" ","-")
    let impulsor = new curva()
    impulsor.numImpulsor = 1
    impulsor.ultimoEditor = this.usuario.correo
    impulsor.fab = false
    impulsor.equivalente = true
    impulsor.numSeccion = this.seccionActual
    impulsor.nombre = nombre
    await this.afs.collection("proyectos")
    .doc(this.proyecto.id)
    .collection("equipos")
    .doc(this.equipo.tag)
    .collection("curvas")
    .doc(nombre).set({...impulsor})
  }

  eliminarImpulsor(idImpulsor){
    this.afs.collection("proyectos").doc(this.trenTag).collection("equipos").doc(this.equipo.tag).collection("curvas").doc(idImpulsor).delete()
  }

  filterImpulsores(){
    console.log("entre")
    this.filteredImpulsores = this.impulsores.filter(x => x.numSeccion == this.seccionActual).sort((a,b) => +a.numImpulsor - +b.numImpulsor)
    this.filteredImpulsoresEq = this.impusoresEq.filter(x => x.numSeccion == this.seccionActual)
    this.flagEqFab = false
    this.flagEqPsico = false
    this.filteredImpulsoresEq.forEach(impulsor => {
      if (impulsor.fab == true) {
        this.flagEqFab = true;
      }
      if (impulsor.fab == false) {
        this.flagEqPsico = true;
      }
    })
  }


  // Funciones de curva

  guardarCurva() {
    if (this.curva.equivalente == false) {
      this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipo.tag)
        .collection("curvas")
        .doc(`s${this.seccionActual}-impulsor-${this.curva.numImpulsor}`).set({
          ...this.curva
        })
    } else {
      console.log(this.curva.nombre)
      this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipo.tag)
        .collection("curvas")
        .doc(this.curva.nombre).set({
          ...this.curva
        })
    }
  }

  eliminarCurva() {
    this.dialogService.dialogConfirmar().afterClosed().subscribe(res => {
      if (res == true) {
        if (this.curva.equivalente) {
          this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipo.tag)
            .collection("curvas").ref.where("nombre", "==", this.curva.nombre).get().then(snap => {
              const id = snap.docs[0].id
              this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipo.tag)
                .collection("curvas").doc(id).delete()
            })
        }
      }
    });
  }

  fileChangeListener($event: any): void {
    // Select the files from the event
    const files = $event.srcElement.files;

    // Parse the file you want to select for the operation along with the configuration
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

  armarData() {
    this.curva.coefHeadDataSet = []
    this.curva.eficPoliDataSet = []
    for (let index = 0; index < this.csvRecords.length; index++) {
      const cpData = {
        x: this.csvRecords[index]["x1"],
        y: this.csvRecords[index]["CP"]
      }
      const efiData = {
        x: this.csvRecords[index]["x2"],
        y: this.csvRecords[index]["EFI"]
      }
      this.curva.coefHeadDataSet.push(cpData)
      this.curva.eficPoliDataSet.push(efiData)
    }
    this.curva.coefHeadDataSet = this.curva.coefHeadDataSet.filter(x => x.x != "")
    this.curva.eficPoliDataSet = this.curva.eficPoliDataSet.filter(x => x.x != "")
  }

  @ViewChild('fileImportInput', { static: false }) myInputVariable: ElementRef;
  reset() {
    this.myInputVariable.nativeElement.value = '';
    this.csvRecords = []
    this.curva.eficPoliDataSet = []
    this.curva.coefHeadDataSet = []
  }

  ajustarPolinomios() {
    this.envio = []
    let len = 0
    const cpLen = this.curva.coefHeadDataSet.length
    const efiLen = this.curva.eficPoliDataSet.length
    this.envio.push(["X Coef Head", "Y Coef Head", "X Coef Efic", "Y Coef Efic"])
    // Seleccion puede ser 1: Manual, 2: Automatico y Orden debe ser mayor a 3
    let seleccion = 1
    if (this.curva.tipoAjuste == "Manual") {
      seleccion = 1
    } else {
      seleccion = 2
    }
    this.envio.push(["Seleccion", seleccion, "Orden", this.curva.orden])
    if (this.curva.coefHeadDataSet.length > this.curva.eficPoliDataSet.length) {
      len = this.curva.coefHeadDataSet.length
    } else {
      len = this.curva.eficPoliDataSet.length
    }
    for (let index = 0; index < len; index++) {
      let x1: number | string = 0
      let CP: number | string = 0
      let x2: number | string = 0
      let EFI: number | string = 0
      if (index < cpLen) {
        x1 = this.curva.coefHeadDataSet[index]["x"]
        CP = this.curva.coefHeadDataSet[index]["y"]
      } else {
        x1 = 0
        CP = 0
      }
      if (index < efiLen) {
        x2 = this.curva.eficPoliDataSet[index]["x"]
        EFI = this.curva.eficPoliDataSet[index]["y"]
      } else {
        x2 = 0
        EFI = 0
      }
      const row = [x1, CP, x2, EFI]
      this.envio.push(row)
    }
    console.log(this.envio)
    this.http.post(this.url, JSON.stringify(this.envio)).subscribe(res => {
      let data = []
      data = res as Array<Array<any>>
      console.log(this.data)
      if (res) {
        this.curva.cp1 = data[0][0]
        this.curva.cp2 = data[1][0]
        this.curva.cp3 = data[2][0]
        this.curva.cp4 = data[3][0]
        this.curva.expocp = data[4][0]
        this.curva.errcp = data[5][0]
        this.curva.ce1 = data[0][1]
        this.curva.ce2 = data[1][1]
        this.curva.ce3 = data[2][1]
        this.curva.ce4 = data[3][1]
        this.curva.expoce = data[4][1]
        this.curva.errce = data[5][1]
        this.verGraficaEfi()
        this.verGraficaCP()
      } else {
        alert("Hubo un error, revisar la data")
      }
    })
  }

  verGraficaCP() {
    this.yDataCp = []
    console.log(this.curva)
    this.curva.coefHeadDataSet.sort((a, b) => +a.x - +b.x)
    let minx: number = +this.curva.coefHeadDataSet[0].x
    minx = +minx.toFixed(1) - 0.05
    let maxx: number = +this.curva.coefHeadDataSet[this.curva.coefHeadDataSet.length - 1].x
    maxx = +maxx.toFixed(1) + 0.05
    const nPuntos = (+this.curva.coefHeadDataSet[this.curva.coefHeadDataSet.length - 1].x - +this.curva.coefHeadDataSet[0].x) / 100
    for (let index = +this.curva.coefHeadDataSet[0].x; index <= this.curva.coefHeadDataSet[this.curva.coefHeadDataSet.length - 1].x; index = index + nPuntos) {
      const punto = this.curva.cp4 + this.curva.cp3 * index + this.curva.cp2 * (index ** 2) + this.curva.cp1 * (index ** this.curva.expocp)
      let row: Array<number> = [+index, , punto]
      if (this.curva.coefHeadDataSet.find(x => x.x == index)) {
        const value = +this.curva.coefHeadDataSet.find(x => x.x == index).y
        row = [+index, +value, punto]
      }
      this.yDataCp = [...this.yDataCp, row]
    }
    for (let index = 0; index < this.curva.coefHeadDataSet.length; index++) {
      const element = this.curva.coefHeadDataSet[index];
      const row: Array<number> = [+element.x, +element.y, ,]
      this.yDataCp = [...this.yDataCp, row]
    }
    const ultimoPunto = this.curva.coefHeadDataSet[this.curva.coefHeadDataSet.length - 1]
    const ultimoPuntoValue = this.curva.cp4 + this.curva.cp3 * +ultimoPunto.x + this.curva.cp2 * (+ultimoPunto.x) ** 2 + this.curva.cp1 * (+ultimoPunto.x) ** this.curva.expocp
    this.yDataCp = [...this.yDataCp, [+ultimoPunto.x, +ultimoPunto.y, +ultimoPuntoValue]]
    this.yDataCp.sort((a, b) => a[0] - b[0])
    this.optionsCp = {
      interpolateNulls: true,
      chartArea: { top: 30, bottom: 66, left: 60, right: 18, backgroundColor: 'transparent' },
      height: this.height,
      width: this.width,
      series: {
        0: {
          lineWidth: 0,
          pointsVisible: true,
          pointSize: 4
        }
      },
      hAxis: {
        title: 'Q/N',
        titleTextStyle: { italic: false, fontSize: 13, fontName: 'Roboto' },
        viewWindowMode: 'explicit',
        viewWindow: { max: maxx, min: minx },
        minorGridlines: { interval: 0.005 }
      },
      vAxis: {
        title: 'Coeficiente μ',
        titleTextStyle: { italic: false, fontSize: 13, fontName: 'Roboto', },
        minorGridlines: { interval: 0.005 }
      },
      legend: { position: 'bottom', alignment: 'center' },
    };
    this.mostrarGraficaCP = true
  }

  verGraficaEfi() {
    this.yDataCe = []
    this.curva.eficPoliDataSet.sort((a, b) => +a.x - +b.x)
    let minx: number = +this.curva.eficPoliDataSet[0].x
    minx = +minx.toFixed(1) - 0.05
    let maxx: number = +this.curva.eficPoliDataSet[this.curva.eficPoliDataSet.length - 1].x
    maxx = +maxx.toFixed(1) + 0.05
    const step = (+this.curva.eficPoliDataSet[this.curva.eficPoliDataSet.length - 1].x - +this.curva.eficPoliDataSet[0].x) / 100
    for (let index = +this.curva.eficPoliDataSet[0].x; index <= this.curva.eficPoliDataSet[this.curva.eficPoliDataSet.length - 1].x; index = index + step) {
      const punto = this.curva.ce4 + this.curva.ce3 * index + this.curva.ce2 * (index ** 2) + this.curva.ce1 * (index ** this.curva.expoce)
      let row: Array<number> = [+index, , punto]
      if (this.curva.eficPoliDataSet.find(x => x.x == index)) {
        const value = +this.curva.eficPoliDataSet.find(x => x.x == index).y
        row = [+index, +value, punto]
      }
      this.yDataCe = [...this.yDataCe, row]
    }

    for (let index = 0; index < this.curva.eficPoliDataSet.length; index++) {
      const element = this.curva.eficPoliDataSet[index];
      const row: Array<number> = [+element.x, +element.y, ,]
      this.yDataCe = [...this.yDataCe, row]
    }
    const ultimoPunto = this.curva.eficPoliDataSet[this.curva.eficPoliDataSet.length - 1]
    const ultimoPuntoValue = this.curva.ce4 + this.curva.ce3 * +ultimoPunto.x + this.curva.ce2 * (+ultimoPunto.x) ** 2 + this.curva.ce1 * (+ultimoPunto.x) ** this.curva.expoce
    this.yDataCe = [...this.yDataCe, [+ultimoPunto.x, +ultimoPunto.y, ultimoPuntoValue]]
    this.yDataCe.sort((a, b) => a[0] - b[0])
    console.log(this.yDataCe)
    this.optionsCe = {
      interpolateNulls: true,
      chartArea: { top: 30, bottom: 66, left: 60, right: 18, backgroundColor: 'transparent' },
      height: this.height,
      width: this.width,
      series: {
        0: {
          lineWidth: 0,
          pointsVisible: true,
          pointSize: 4
        }
      },
      hAxis: {
        title: 'Q/N',
        titleTextStyle: { italic: false, fontSize: 13, fontName: 'Roboto' },
        viewWindowMode: 'explicit',
        viewWindow: { max: maxx, min: minx },
        minorGridlines: { interval: 0.005 }
      },
      vAxis: {
        title: 'Coeficiente μ',
        titleTextStyle: { italic: false, fontSize: 13, fontName: 'Roboto', },
        minorGridlines: { interval: 0.005 }
      },
      legend: { position: 'bottom', alignment: 'center' },
    };
    this.mostrarGraficaCE = true
  }
}
