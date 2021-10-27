import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DialogService } from 'src/app/services/dialog.service';
import { HttpClient } from '@angular/common/http';
import { curva } from 'src/app/services/data-service.service';
import { ChartType } from 'angular-google-charts';

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

  constructor(public dialogService: DialogService, private ngxCsvParser: NgxCsvParser, private data: DataServiceService, private http: HttpClient) { }

  csvRecords: any[] = [];
  dataSetCP: any[] = [];
  dataSetCE: any[] = []
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
    this.dataSetCP = []
    this.dataSetCE = []
    for (let index = 0; index < this.csvRecords.length; index++) {
      const cpData = {
        x: this.csvRecords[index]["x1"],
        y: this.csvRecords[index]["CP"]
      }
      const efiData = {
        x: this.csvRecords[index]["x2"],
        y: this.csvRecords[index]["EFI"]
      }
      this.dataSetCP.push(cpData)
      this.dataSetCE.push(efiData)
    }
    this.dataSetCP = this.dataSetCP.filter(x => x.x != "")
    this.dataSetCE = this.dataSetCE.filter(x => x.x != "")
  }

  @ViewChild('fileImportInput', { static: false }) myInputVariable: ElementRef;
  reset() {
    this.myInputVariable.nativeElement.value = '';
    this.csvRecords = []
    this.dataSetCE = []
    this.dataSetCP = []
  }

  eliminarCurva() {
    this.dialogService.dialogConfirmar().afterClosed().subscribe(res => {
      if (res == true) {
      }
    });
  }

  descargarCSV() {
    this.csvRecords = []
    let len = 0
    const cpLen = this.dataSetCP.length
    const efiLen = this.dataSetCE.length
    if (this.dataSetCP.length > this.dataSetCE.length) {
      len = this.dataSetCP.length
    } else {
      len = this.dataSetCE.length
    }
    for (let index = 0; index < len; index++) {
      let x1 = ""
      let CP = ""
      let x2 = ""
      let EFI = ""
      if (index < cpLen) {
        x1 = this.dataSetCP[index]["x"]
        CP = this.dataSetCP[index]["y"]
      } else {
        x1 = ""
        CP = ""
      }
      if (index < efiLen) {
        x2 = this.dataSetCE[index]["x"]
        EFI = this.dataSetCE[index]["y"]
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
    this.dataSetCP.sort((a, b) => a.x - b.x)
    let minx: number = +this.dataSetCP[0].x
    minx = +minx.toFixed(1) - 0.05
    let maxx: number = +this.dataSetCP[this.dataSetCP.length - 1].x
    maxx = +maxx.toFixed(1) + 0.05
    const nPuntos = (this.dataSetCP[this.dataSetCP.length - 1].x - this.dataSetCP[0].x) / 100
    for (let index = +this.dataSetCP[0].x; index <= this.dataSetCP[this.dataSetCP.length - 1].x; index = index + nPuntos) {
      const punto = this.curva.cp4 + this.curva.cp3 * index + this.curva.cp2 * (index ** 2) + this.curva.cp1 * (index ** this.curva.expocp)
      let row: Array<number> = [+index, , punto]
      if (this.dataSetCP.find(x => x.x == index)) {
        const value = +this.dataSetCP.find(x => x.x == index).y
        row = [+index, +value, punto]
      }
      this.yDataCp = [...this.yDataCp, row]
    }
    for (let index = 0; index < this.dataSetCP.length; index++) {
      const element = this.dataSetCP[index];
      const row: Array<number> = [+element.x, +element.y, ,]
      this.yDataCp = [...this.yDataCp, row]
    }
    const ultimoPunto = this.dataSetCP[this.dataSetCP.length - 1]
    const ultimoPuntoValue = this.curva.cp4 + this.curva.cp3 * ultimoPunto.x + this.curva.cp2 * (ultimoPunto.x ** 2) + this.curva.cp1 * (ultimoPunto.x ** this.curva.expocp)
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
    this.dataSetCE.sort((a, b) => a.x - b.x)
    let minx: number = +this.dataSetCE[0].x
    minx = +minx.toFixed(1) - 0.05
    let maxx: number = +this.dataSetCE[this.dataSetCE.length - 1].x
    maxx = +maxx.toFixed(1) + 0.05
    const step = (this.dataSetCE[this.dataSetCE.length - 1].x - this.dataSetCE[0].x) / 100
    for (let index = +this.dataSetCE[0].x; index <= this.dataSetCE[this.dataSetCE.length - 1].x; index = index + step) {
      const punto = this.curva.ce4 + this.curva.ce3 * index + this.curva.ce2 * (index ** 2) + this.curva.ce1 * (index ** this.curva.expoce)
      let row: Array<number> = [+index, , punto]
      if (this.dataSetCE.find(x => x.x == index)) {
        const value = +this.dataSetCE.find(x => x.x == index).y
        row = [+index, +value, punto]
      }
      this.yDataCe = [...this.yDataCe, row]
    }

    for (let index = 0; index < this.dataSetCE.length; index++) {
      const element = this.dataSetCE[index];
      const row: Array<number> = [+element.x, +element.y, ,]
      this.yDataCe = [...this.yDataCe, row]
    }
    const ultimoPunto = this.dataSetCE[this.dataSetCE.length - 1]
    const ultimoPuntoValue = this.curva.ce4 + this.curva.ce3 * ultimoPunto.x + this.curva.ce2 * (ultimoPunto.x ** 2) + this.curva.ce1 * (ultimoPunto.x ** this.curva.expoce)
    this.yDataCe = [...this.yDataCe, [ultimoPunto.x, ultimoPunto.y, ultimoPuntoValue]]
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
    const cpLen = this.dataSetCP.length
    const efiLen = this.dataSetCE.length
    this.envio.push(["X Coef Head", "Y Coef Head", "X Coef Efic", "Y Coef Efic"])
    // Seleccion puede ser 1: Manual, 2: Automatico y Orden debe ser mayor a 3
    let seleccion = 1
    if (this.curva.tipoAjuste == "Manual") {
      seleccion = 1
    } else {
      seleccion = 2
    }
    this.envio.push(["Seleccion", seleccion, "Orden", this.curva.orden])
    if (this.dataSetCP.length > this.dataSetCE.length) {
      len = this.dataSetCP.length
    } else {
      len = this.dataSetCE.length
    }
    for (let index = 0; index < len; index++) {
      let x1 = 0
      let CP = 0
      let x2 = 0
      let EFI = 0
      if (index < cpLen) {
        x1 = this.dataSetCP[index]["x"]
        CP = this.dataSetCP[index]["y"]
      } else {
        x1 = 0
        CP = 0
      }
      if (index < efiLen) {
        x2 = this.dataSetCE[index]["x"]
        EFI = this.dataSetCE[index]["y"]
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
}
