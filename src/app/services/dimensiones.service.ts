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


  transformarTemperatura(valor: number, a: string, b: string): number {
    let c = 0;
    const kelvin = this.tempToKelvin(valor, a)
    switch (b) {
      case "[°F]": {
        c = (kelvin - 273.15) * 9 / 5 + 32
        return c
      }
      case "[°C]": {
        c = kelvin - 273.15
        return c
      }
      case "[°K]": {
        c = kelvin
        return c
      }
      case "[°R]": {
        c = kelvin * 9 / 5;
        return c
      }
      default: {
        return c
      }
    }
  }

  tempToKelvin(valor: number, a: string) {
    let c = 0
    switch (a) {
      case "[°F]": {
        c = (valor + 459.67) * (5 / 9);
        return c
      }
      case "[°C]": {
        c = valor + 273.15
        return c
      }
      case "[°K]": {
        c = valor
        return c
      }
      case "[°R]": {
        c = valor * 5 / 9;
        return c
      }
      default: {
        return c
      }
    }
  }

  transformarPresion(valor: number, a: string, b: string): number {
    let c = 0;
    const psia = this.presToPsia(valor, a);
    switch (b) {
      case "[psig]": {
        c = psia - 14.7
        return c
      }
      case "[psia]": {
        c = psia;
        return c
      }
      case "[barg]": {
        c = psia / 14.50377
        return c
      }
      case "[KPag]": {
        c = psia * 6.895 - 14.7
        return c
      }
      default: {
        return c
      }
    }
  }

  presToPsia(valor: number, a: string) {
    let c = 0;
    switch (a) {
      case "[psig]": {
        c = valor + 14.7
        return c
      }
      case "[psia]": {
        c = valor;
        return c
      }
      case "[barg]": {
        c = valor * 14.50377
        return c
      }
      case "[KPag]": {
        c = valor / 6.895 + 14.7
        return c
      }
      default: {
        return c
      }
    }
  }

  transformarDensidad(valor: number, a: string, b: string): number {
    let c = 0;

    return valor
  }
  densToGCm3(valor:number, a:string){
    let c = 0
    switch (a) {
      case "[lbmol/pie3]":{

      }
      case "[lbm/pie3]":{

      }
      case "[lbm/pulg3]":{

      }
      case "[Kg/m3]":{

      }
      case "[g/cm3]":{

      }
      case "[°API]":{

      }

    }
  }

  transformarVolumen(valor: number, a: string, b: string): number {
    return valor
  }

  transformarEntalpia(valor: number, a: string, b: string): number {
    return valor
  }

  transformarEntropia(valor: number, a: string, b: string): number {
    return valor
  }

  transformarFlujo(valor: number, a: string, b: string): number {
    return valor
  }


}
