import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

export interface variable {
  valor: number,
  dimension: string,
}

@Injectable({
  providedIn: 'root'
})

export class DimensionesService {

  constructor() { }

  temperatura = ["[°F]", "[°K]", "[°C]", "[°R]"];
  presion = ["[psig]", "[psia]", "[barg]", "[KPag]"];
  densidad = ["[lbmol/pie3]", "[lbm/pie3]", "[lbm/pulg3]", "[Kg/m3]", "[g/cm3]", "[°API]"];
  volumen = ["[pie3/lbm]", "[pi3/lbmol]", "[m3/kg]"];
  entalpia = ["[BTU/lbm]", "[BTU/lbmol]", "[KJ/kg]", "[Cal/g]"];
  entropia = ["[BTU/lbm°F]", "[BTU/lbmol°R]", "[KJ/kg°K]", "[Cal/g°C]"];
  pesoMolecular = ["[lbm/lbmol]"];
  flujo = ["[MMSCFD]", "[ACFM]", "[lbm/min]", "[lbmol/dia]", "[m3/min]", "[m3/sec]"];


  transformarTemperatura(valor:number, a: string, b: string): number {
    let c = 0;
    return valor
  }

  tempToK(valor: number, ) {
    return valor
  }

  transformarPresion(valor:number, a: string, b: string): number {
    return valor
  }

  transformarDensidad(valor:number, a: string, b: string): number {
    return valor
  }

  transformarVolumen(valor:number, a: string, b: string): number {
    return valor
  }

  transformarEntalpia(valor:number, a: string, b: string): number {
    return valor
  }

  transformarEntropia(valor:number, a: string, b: string): number {
    return valor
  }

  transformarFlujo(valor:number, a: string, b: string): number {
    return valor
  }


}
