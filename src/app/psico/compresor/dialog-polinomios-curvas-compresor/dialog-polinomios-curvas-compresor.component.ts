import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DialogService } from 'src/app/services/dialog.service';
import { HttpClient } from '@angular/common/http';
import { curva } from 'src/app/services/data-service.service';
import { ChartType } from 'angular-google-charts';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';

interface point {
  "x": number,
  "y": number
}
interface dataset {
  "name": string,
  "series": point[],
}

@Component({
  selector: 'dialog-polinomios-curvas-compresor',
  templateUrl: './dialog-polinomios-curvas-compresor.component.html',
  styleUrls: ['./dialog-polinomios-curvas-compresor.component.css']
})
export class DialogPolinomiosCurvasCompresorComponent implements OnInit {


  tipoAjuste: string = 'Automatico';
  grado: number;
  unidadFlujo: string = 'Q/N';

  constructor(public dialogService: DialogService,
    private afs: AngularFirestore,
    private ngxCsvParser: NgxCsvParser,
    private data: DataServiceService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<DialogPolinomiosCurvasCompresorComponent>,
    @Inject(MAT_DIALOG_DATA) public dataEnviada) { }

  csvRecords: any[] = [];
  header = true;
  file;

  // envio de data
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

  curva = new curva

  ngOnInit(): void {
    if (this.dataEnviada.impulsor) {
      this.curva = this.dataEnviada.impulsor
      console.log(this.curva)
      if (this.curva.expocp != 0) {
        this.verGraficaCP()
        this.verGraficaEfi()
      }
    }
    this.curva.equivalente = this.dataEnviada.equivalente
    this.curva.fab = this.dataEnviada.fab
    this.curva.numSeccion = this.dataEnviada.seccion
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

  eliminarCurva() {
    this.dialogService.dialogConfirmar().afterClosed().subscribe(res => {
      if (res == true) {
        if (this.curva.equivalente) {
          this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId).collection("equipos").doc(this.dataEnviada.equipoTag)
            .collection("curvas").ref.where("nombre", "==", this.curva.nombre).get().then(snap => {
              const id = snap.docs[0].id
              this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId).collection("equipos").doc(this.dataEnviada.equipoTag)
                .collection("curvas").doc(id).delete()
            })
        }
      }
    });
  }

  descargarCSV() {
    this.csvRecords = []
    let len = 0
    const cpLen = this.curva.coefHeadDataSet.length
    const efiLen = this.curva.eficPoliDataSet.length
    if (this.curva.coefHeadDataSet.length > this.curva.eficPoliDataSet.length) {
      len = this.curva.coefHeadDataSet.length
    } else {
      len = this.curva.eficPoliDataSet.length
    }
    for (let index = 0; index < len; index++) {
      let x1: number | string = ""
      let CP: number | string = ""
      let x2: number | string = ""
      let EFI: number | string = ""
      if (index < cpLen) {
        x1 = this.curva.coefHeadDataSet[index]["x"]
        CP = this.curva.coefHeadDataSet[index]["y"]
      } else {
        x1 = ""
        CP = ""
      }
      if (index < efiLen) {
        x2 = this.curva.eficPoliDataSet[index]["x"]
        EFI = this.curva.eficPoliDataSet[index]["y"]
      } else {
        x2 = ""
        EFI = ""
      }
      const obj = {
        x1: x1,
        CP: CP,
        x2: x2,
        EFI: EFI
      }
      this.csvRecords.push(obj)
    }
    this.data.downloadFile(this.csvRecords, "data-curvas", ['x1', 'CP', 'x2', 'EFI'])
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

  guardarCurva() {
    if (this.curva.equivalente == false) {
      this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId).collection("equipos").doc(this.dataEnviada.equipoTag)
        .collection("curvas")
        .doc(`s${this.dataEnviada.seccion}-impulsor-${this.curva.numImpulsor}`).set({
          ...this.curva
        })
    } else {
      console.log(this.curva.nombre)
      this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId).collection("equipos").doc(this.dataEnviada.equipoTag)
        .collection("curvas")
        .doc(this.curva.nombre).set({
          ...this.curva
        })
    }
  }
}
