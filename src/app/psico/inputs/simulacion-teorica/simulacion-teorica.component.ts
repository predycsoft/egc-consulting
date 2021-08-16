import { Component, OnInit } from '@angular/core';
import { DimensionesService, variable } from 'src/app/services/dimensiones.service';

// Variables compartidas para todas las corridas

interface compresorDims{
  p: string;
  t: string;
  q: string;
  rpm: string;
}

interface caracteristicasFisicas{
  numeroCompresor: number,
  tipoCompresor: string,
  numeroImpulsores: number,
  diametro: number; //
  tieneCaja: boolean, // si cuenta o no con caja de engranajes
  relCaja: number, //relacion de velocidad de la caja respecto altren
  perdidasCaja: number,
  perdidasMecanicas: string|number,
}

interface curvas {
  limSurge: number, //Límite Q/N de surge
  limStw: number, //Límite Q/N de stw
  coefHead: polinomio;
  eficPoli: polinomio;
}

interface polinomio {
  a0: number, //termino independiente a0*x^0
  a1: number, //a1*X^1
  a2: number, //a2*X^2
  a3: number, //a3*X^3
}

interface compresorInput{

  // variantes para cada punto de la simulacion
  cromatografiaId: string,
  cromatografia: cromatografia,
  cromatografiaAnterior: string,
  ps: number, //presion de succion
  ts: number, //temperatura de succion
  pd: number, //presion de descarga
  td: number, // temperatura de descarga
  rpm: number, // cuando es simulacion teorica se utiliza para el tanteo
  q: number,

  // cuando hay lineas de flujo entrantes
  sidestream: string, //para asignar si tiene o no un flujo de entrada
  deltaP: number, //utlizado para simulaciones teoricas
  deltaQ: number,
  tIn: number,
  cromatrografiaInId: string,
  cromatografiaIn: cromatografia,
}

interface cromatografia{
  metano: number,
  etano: number,
  propano: number,
  iButano: number,
  nButano: number,
  iPentano: number,
  nPentano: number,
  hexano: number,
  heptano: number,
  octano: number,
  nonano: number,
  decano: number,
  nitrogeno: number,
  dioxCarbono: number,
  sulfHidrogeno: number,
  aire: number,
}


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
