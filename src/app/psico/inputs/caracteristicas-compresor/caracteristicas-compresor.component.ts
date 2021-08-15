import { Component, OnInit } from '@angular/core';

interface operatingConditions{
  gasHandled: number,
  molecularWeight: number,
  mmscfd: number,
  massFlow: number,
  weightFlow: number,
  inletVolume: number,
  p1: number,
  t1: number,
  k1: number,
  z1: number,
  p2: number,
  t2: number,
  k2: number,
  z2: number,
  brakeHorsepower: number,
  compressorGasPower: number,
  rpm: number,
  Hpoly: number,
  Hisen: number,
  Npoly: number,
  Nisen: number,
  pRatio: number,
  certifiedPoint: number,
  performanceCurve: number,
} 

@Component({
  selector: 'caracteristicas-compresor',
  templateUrl: './caracteristicas-compresor.component.html',
  styleUrls: ['./caracteristicas-compresor.component.css']
})
export class CaracteristicasCompresorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
