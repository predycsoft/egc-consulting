import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DialogService } from 'src/app/services/dialog.service';
import { HttpClient } from '@angular/common/http';
import { curva } from 'src/app/services/data-service.service';
import { ChartDataset, ChartOptions } from 'chart.js';
import { Colors, Label } from 'ng2-charts';

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
  dataSetEfi: any[] = []
  header = true;
  file;

  // envio de data
  url = "http://127.0.0.1:5000/ajustecurva/"
  envio;
  // recibir data
  cp1 = 0
  cp2 = 0
  cp3 = 0
  cp4 = 0
  expocp = 0
  errcp = 0
  ce1 = 0
  ce2 = 0
  ce3 = 0
  ce4 = 0
  expoce = 0
  errce = 0
  // Grafica
  lineChartData: ChartDataset[];
  lineChartLabels: Label[];
  lineChartOptions = {
    responsive: true,
  };
  lineChartColors: Colors[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,255,1)',
    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';



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
        if(result instanceof NgxCSVParserError) {
        } else {
          this.csvRecords = result;
          this.armarData();
        }
      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
      });
  }

  armarData(){
    this.dataSetCP = []
    this.dataSetEfi = []
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
      this.dataSetEfi.push(efiData)
    }
    this.dataSetCP = this.dataSetCP.filter(x => x.x != "")
    this.dataSetEfi = this.dataSetEfi.filter(x => x.x != "")
  }

  @ViewChild('fileImportInput', {static: false}) myInputVariable: ElementRef;
  reset() {
    this.myInputVariable.nativeElement.value = '';
    this.csvRecords = []
    this.dataSetEfi = []
    this.dataSetCP = []
  }

  eliminarCurva() {
    this.dialogService.dialogConfirmar().afterClosed().subscribe(res => {
      if (res == true) {
      }
    });
  }

  descargarCSV(){
    this.csvRecords = []
    let len = 0
    const cpLen = this.dataSetCP.length
    const efiLen = this.dataSetEfi.length
    if (this.dataSetCP.length > this.dataSetEfi.length){
      len = this.dataSetCP.length
    } else {
      len = this.dataSetEfi.length
    }
    for (let index = 0; index < len; index++) {
      let x1 = ""
      let CP = ""
      let x2 = ""
      let EFI = ""
      if  (index < cpLen) {
        x1 = this.dataSetCP[index]["x"]
        CP = this.dataSetCP[index]["y"]
      } else {
        x1 = ""
        CP = ""
      }
      if  (index < efiLen) {
        x2 = this.dataSetEfi[index]["x"]
        EFI = this.dataSetEfi[index]["y"]
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
    this.data.downloadFile(this.csvRecords,"data-curvas",['x1','CP', 'x2', 'EFI'])
  }

  verGraficaCP(){
    let xdata = []
    let ydata = []
    for (let index = 0; index < this.dataSetCP.length; index++) {
      const element = this.dataSetCP[index];
      xdata.push(element.x)
      ydata.push(element.y)

    }
    this.lineChartData = [
      { data: ydata, label: 'Coef Cabezal Politrópico' },
    ];
    this.lineChartLabels = xdata;
  }

  verGraficaEfi(){
    let xdata = []
    let ydata = []
    for (let index = 0; index < this.dataSetEfi.length; index++) {
      const element = this.dataSetEfi[index];
      xdata.push(element.x)
      ydata.push(element.y)

    }
    this.lineChartData = [
      { data: ydata, label: 'Coef Eficiencia Politrópica' },
    ];
    this.lineChartLabels = xdata;
  }

  ajustarPolinomios(){
    this.envio = []
    let len = 0
    const cpLen = this.dataSetCP.length
    const efiLen = this.dataSetEfi.length
    this.envio.push(["X Coef Head","Y Coef Head","X Coef Efic","Y Coef Efic"])
    // Seleccion puede ser 1: Manual, 2: Automatico y Orden debe ser mayor a 3
    let seleccion = 1
    if(this.curva.tipoAjuste == "Manual") {
      seleccion = 1
    } else {
      seleccion = 2
    }
    this.envio.push(["Seleccion",seleccion,"Orden",this.curva.orden])
    if (this.dataSetCP.length > this.dataSetEfi.length){
      len = this.dataSetCP.length
    } else {
      len = this.dataSetEfi.length
    }
    for (let index = 0; index < len; index++) {
      let x1 = 0
      let CP = 0
      let x2 = 0
      let EFI = 0
      if  (index < cpLen) {
        x1 = this.dataSetCP[index]["x"]
        CP = this.dataSetCP[index]["y"]
      } else {
        x1 = 0
        CP = 0
      }
      if  (index < efiLen) {
        x2 = this.dataSetEfi[index]["x"]
        EFI = this.dataSetEfi[index]["y"]
      } else {
        x2 = 0
        EFI = 0
      }
      const row = [x1, CP, x2, EFI]
      this.envio.push(row)
    }
    console.log(this.envio)
    this.http.post(this.url,JSON.stringify(this.envio)).subscribe(res => {
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
      } else {
        alert("Hubo un error, revisar la data")
      }
    })
  }
}
