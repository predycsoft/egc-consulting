import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'dialog-polinomios-curvas-compresor',
  templateUrl: './dialog-polinomios-curvas-compresor.component.html',
  styleUrls: ['./dialog-polinomios-curvas-compresor.component.css']
})
export class DialogPolinomiosCurvasCompresorComponent implements OnInit {


  tipoAjuste: string = 'Automatico';
  grado: number;
  unidadFlujo: string = 'Q/N';

  constructor(public dialogService: DialogService, private ngxCsvParser: NgxCsvParser, private data: DataServiceService) { }

  csvRecords: any[] = [];
  dataSetCP: any[] = [];
  dataSetEfi: any[] = []
  header = true;
  file;

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
}
