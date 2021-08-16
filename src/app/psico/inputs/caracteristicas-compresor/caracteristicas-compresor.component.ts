import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';






interface operatingConditions {
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

  operatingConditions: operatingConditions[] = []

  aux: string;

  constructor() { }

  variables: string[] = ["Gas Handled", "Molecular Weight (%)", "mmscfd", "massFlow", "weightFlow", "inletVolume ", "p1", "t1", "k1", "z1", "p2", "t2", "k2", "z2", "brakeHorsepower", "compressorGasPower", "rpm", "Hpoly", "Hisen", "Npoly", "Nisen", "pRatio", "certifiedPoint", "performanceCurve"]

  ngOnInit(): void {
    this.operatingConditions.push({
      gasHandled: 0,
      molecularWeight: 0,
      mmscfd: 0,
      massFlow: 0,
      weightFlow: 0,
      inletVolume: 0,
      p1: 0,
      t1: 0,
      k1: 0,
      z1: 0,
      p2: 0,
      t2: 0,
      k2: 0,
      z2: 0,
      brakeHorsepower: 0,
      compressorGasPower: 0,
      rpm: 0,
      Hpoly: 0,
      Hisen: 0,
      Npoly: 0,
      Nisen: 0,
      pRatio: 0,
      certifiedPoint: 0,
      performanceCurve: 0,
    })
    console.log("hola")
  }

  nuevaColumna() {
    this.operatingConditions.push({
      gasHandled: 0,
      molecularWeight: 0,
      mmscfd: 0,
      massFlow: 0,
      weightFlow: 0,
      inletVolume: 0,
      p1: 0,
      t1: 0,
      k1: 0,
      z1: 0,
      p2: 0,
      t2: 0,
      k2: 0,
      z2: 0,
      brakeHorsepower: 0,
      compressorGasPower: 0,
      rpm: 0,
      Hpoly: 0,
      Hisen: 0,
      Npoly: 0,
      Nisen: 0,
      pRatio: 0,
      certifiedPoint: 0,
      performanceCurve: 0,
    })
    console.log(this.operatingConditions)
  }

  returnZero() {
    return 0;
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

}
