import { Component, OnInit } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { ViewChild } from '@angular/core';
import { NgxCSVParserError } from 'ngx-csv-parser';

interface point {
  "name": number,
  "value": number
}

interface dataset {
  "name": string,
  "series": point[],
}

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
          this.armarData();
        } 
      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
      });
  }

  // Data para el plot 

  multi: dataset[] = [];
  view: [number, number] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  armarData() {
    for(let i = 0; i < this.csvRecords[0].length; i = i+2) {
      let dataset: dataset = {
        "name": this.csvRecords[0][i],
        "series": [],
      }
      for(let j = 2; j < this.csvRecords.length; j++) {
        if (this.csvRecords[j][i] != "") {
          const point: point = {
            "name": +this.csvRecords[j][i],
            "value": +this.csvRecords[j][i+1]
          }
          dataset.series = dataset.series.concat(point);
        }
      }
      this.multi = this.multi.concat(dataset);
    }
    console.log(this.multi)
    this.multi = JSON.parse(JSON.stringify(this.multi));
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }
}
