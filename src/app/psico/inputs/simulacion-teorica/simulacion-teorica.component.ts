import { Component, OnInit } from '@angular/core';
import { DimensionesService, variable } from 'src/app/services/dimensiones.service';



@Component({
  selector: 'simulacion-teorica',
  templateUrl: './simulacion-teorica.component.html',
  styleUrls: ['./simulacion-teorica.component.css']
})
export class SimulacionTeoricaComponent implements OnInit {
  


  constructor( public dims: DimensionesService) { }

  ngOnInit(): void {
  }

}
