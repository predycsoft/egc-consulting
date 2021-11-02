import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';

class param {
  nombre: string = '';
  var: string = '';
  max: number = null;
  min: number = null;
}

@Component({
  selector: 'simulacion-campo-dashboard',
  templateUrl: './simulacion-campo-dashboard.component.html',
  styleUrls: ['./simulacion-campo-dashboard.component.css']
})
export class SimulacionCampoDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  title = 'Age vs Weight';
  type = ChartType.ScatterChart
  data = [
     [8,12],
     [4, 5.5],
     [11,14],
     [4,5],
     [3,3.5],
     [6.5,7]
  ];
  columnNames = ['Age', 'Weight'];
  options = {   
  };
  width = 550;
  height = 400;

  actualMin;
  actualMax;
  selectedParam;
  iParam;
  params: param[] = []
  // params = new param()

  agregarDataBlock(){
    const nuevo = new param()
    this.params = this.params.concat(nuevo)
  }

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

}
