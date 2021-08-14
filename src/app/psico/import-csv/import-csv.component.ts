import { Component, OnInit } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { ViewChild } from '@angular/core';
import { NgxCSVParserError } from 'ngx-csv-parser';

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.css']
})
export class ImportCsvComponent {

  csvRecords: any[] = [];
  header = false;

  saleData = [
    { name: "Mobiles", value: 105000 },
    { name: "Laptop", value: 55000 },
    { name: "AC", value: 15000 },
    { name: "Headset", value: 150000 },
    { name: "Fridge", value: 20000 }
  ];
  
  constructor(private ngxCsvParser: NgxCsvParser) { }

  @ViewChild('fileImportInput', { static: false }) fileImportInput: any;

  // Your applications input change listener for the CSV File
  fileChangeListener($event: any): void {

    // Select the files from the event
    const files = $event.srcElement.files;

    // Parse the file you want to select for the operation along with the configuration
    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
      .pipe().subscribe(result => {
        console.log('Result', result);
        if(result instanceof NgxCSVParserError) {
        } else {
          this.csvRecords = result;
          console.log(this.csvRecords)
        } 
      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
      });
  }
}
