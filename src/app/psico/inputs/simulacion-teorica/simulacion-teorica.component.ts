import { Component, OnInit } from '@angular/core';

interface parametros{
  p1: number,
  t1: number,
  p2: number,
  t2: number,
  numImpulsores: number;
}

@Component({
  selector: 'simulacion-teorica',
  templateUrl: './simulacion-teorica.component.html',
  styleUrls: ['./simulacion-teorica.component.css']
})
export class SimulacionTeoricaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
