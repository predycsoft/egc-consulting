import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-reporte-punto-sumario',
  templateUrl: './reporte-punto-sumario.component.html',
  styleUrls: ['./reporte-punto-sumario.component.css']
})


// class cromatografia {
//   etano = new componente;

// }


export class ReportePuntoSumarioComponent implements OnInit {
  
  // Datos de simulacion
  fecha: Date; 
  tipoSim: string = 'Real'   //Real, RealTeorico, Teorico
  
  // Datos del tren
  nCompresores: number = 2;  //Esta variable habilita la columna en donde se especifica el compresor. En caso de existir 1 solo compresor la columna no se muestra
  nCompresoresMultiSeccion: number = 0; //Esta variable habilita la columna en donde se especifica la sección de un compresor. En caso de no existir compresores multisección la columna no se muestra
  nCromatografias: number = 1; //Esta variable identifica la cantidad de cromatografias que se muestran en el reporte. Cada cromatografia corresponde a 1 columna

  constructor(public data: DataServiceService) { }

  ngOnInit(): void {
  }

}
