import { Component, OnInit } from '@angular/core';


interface datosDeCampo{
  mezclaGas: string,
  hora: Date,
  numRuedas: number,
  diametro: number,
  flujo: number,
  p1: number,
  t1: number,
  p2: number,
  t2: number,
  rpm: number,
}

interface propCompresor {
  flujoMasico: number,
  potenciaGas: number,
  Npoly: number,
  Hpoly: number,
  coefWorkInput: number,
  trabajoPolitropico: number,
  relacionCompresion: number,
  relacionVolumen: number,
  volumenACFM: number,
}

interface variable {
  valor: number,
  dimension: string,
}

interface propTermodinamicas{
  t1: variable,
  t2: variable,
  tIsen: variable,
  p1: variable,
  p2: variable,
  pIsen: variable,
  dens1: variable,
  desn2: variable,
  desnIsen: variable,
  v1: variable,
  v2: variable,
  vIsen: variable,
  entalpia1: variable,
  entalpia2: variable,
  entalpiaIsen: variable, 
  entropia1: variable,
  entropia2: variable,
  entropiaIsen: variable,
  calidad1: variable,
  calidad2: variable,
  calidadIsen: variable, 
  pesoMolecular: variable,
}

@Component({
  selector: 'adimensionalizacion',
  templateUrl: './adimensionalizacion.component.html',
  styleUrls: ['./adimensionalizacion.component.css']
})
export class AdimensionalizacionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
