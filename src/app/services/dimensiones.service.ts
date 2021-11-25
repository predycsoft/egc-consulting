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
  diametro = ["[pulg]"]
  temperatura = ["[°F]", "[°K]", "[°C]", "[°R]"];
  presion = ["[psig]", "[psia]", "[barg]", "[KPag]"];
  densidad = ["[lbmol/pie3]", "[lbm/pie3]", "[lbm/pulg3]", "[Kg/m3]", "[g/cm3]", "[°API]"];
  volumen = ["[pie3/lbm]", "[pi3/lbmol]", "[m3/kg]"];
  entalpia = ["[BTU/lbm]", "[BTU/lbmol]", "[KJ/kg]", "[Cal/g]"];
  entropia = ["[BTU/lbm°F]", "[BTU/lbmol°R]", "[KJ/kg°K]", "[Cal/g°C]"];
  pesoMolecular = ["[lbm/lbmol]"];
  flujo = ["[MMSCFD]", "[ACFM]", "[lbm/min]", "[lbmol/dia]", "[m3/min]", "[m3/sec]"]; 


  transformarTemperatura(valor: number, original: string, nueva: string): number {
    console.log(nueva)
    let c = 0;
    const kelvin = this.tempToKelvin(valor, original)
    switch (nueva) {
      case "[°F]": {
        c = (kelvin - 273.15) * 9 / 5 + 32
        return c
      }
      case "[°C]": {
        console.log("entre a C")
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
        alert("dimensión de temperatura no se encuentra en la lista")
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
    const GCM3 = this.densToGCm3(valor, a)
    switch (b) {
      case "[lbmol/pie3]": {
        // no entiendou
        return c
      }
      case "[lbm/pie3]": {
        c = GCM3 *62.428
        return c
      }
      case "[lbm/pulg3]": {
        c = GCM3 /27.68;1
        return c
      }
      case "[Kg/m3]": {
        c = GCM3*1000
        return c
      }
      case "[g/cm3]": {
        c = GCM3;
        return c;
      }
      case "[°API]": {
        // no entiendou
        return c
      }
      default: {
        return c;
      }
    }
    
  }

  densToGCm3(valor: number, a: string) {
    let c = 0
    switch (a) {
      case "[lbmol/pie3]": {
        // no entiendou
        return c
      }
      case "[lbm/pie3]": {
        c = valor / 62.428
        return c
      }
      case "[lbm/pulg3]": {
        c = valor * 27.68;1
        return c
      }
      case "[Kg/m3]": {
        c = valor/1000
        return c
      }
      case "[g/cm3]": {
        c = valor;
        return c;

      }
      case "[°API]": {
        // no entiendou
        return c
      }
      default: {
        return c;
      }

    }
  }

  // No entiendou
  transformarVolumen(valor: number, a: string, b: string): number {
    let c = 0;
    const pie3 = this.volToPie3(valor, a)
    switch(b) {
      case "[pie3/lbm]": {
        return c
      }
      case  "[pi3/lbmol]": {
        return c
      }
      case "[m3/kg]": {
        return c
      }
      default: {
        return c
      }
    }
  }
  
  volToPie3(valor: number, a: string) {
    let c = 0;
    switch (a) {
      case "[pie3/lbm]": {
        return c
      }
      case  "[pi3/lbmol]": {
        return c
      }
      case "[m3/kg]": {
        return c
      }
      default: {
        return c
      }
    }
  }

  transformarEntalpia(valor: number, a: string, b: string): number {
    let c = 0;
    const BTUlbm = this.entToBTULbm(valor,a)
    switch (b) {
      case "[BTU/lbm]": {
        c = BTUlbm 
        return c
      }
      case "[BTU/lbmol]": {
        // no entienodu
        return c
      }
      case "[KJ/kg]": {
        c = BTUlbm*2.326;
        return c
      }
      case "[Cal/g]": {
        c = BTUlbm/1.7988
        return c
      }
      default: {
        return c
      }
    }

  }

  entToBTULbm(valor: number, a: string) {
    let c = 0;
    switch (a) {
      case "[BTU/lbm]": {
        c = valor 
        return c
      }
      case "[BTU/lbmol]": {
        // no entienodu
        return c
      }
      case "[KJ/kg]": {
        c = valor/2.326;
        return c
      }
      case "[Cal/g]": {
        c = valor*1.7988
        return c
      }
      default: {
        return c
      }
    }
  }

  transformarEntropia(valor: number, a: string, b: string): number {
    let c = 0;
    const BTUlbm = this.entToBTULbmF(valor,a)
    switch (b) {
      case "[BTU/lbm°F]": {
        c = BTUlbm 
        return c
      }
      case "[BTU/lbmol°R]": {
        // no entienodu
        return c
      }
      case "[KJ/kg°K]": {
        c = BTUlbm*0.23884589663;
        return c
      }
      case "[Cal/g°C]": {
        c = BTUlbm
        return c
      }
      default: {
        return c
      }
    }
  }

  entToBTULbmF(valor: number, a: string) {
    let c = 0;
    switch (a) {
      case "[BTU/lbm°F]": {
        c = valor 
        return c
      }
      case "[BTU/lbmol°R]": {
        // no entienodu
        return c
      }
      case "[KJ/kg°K]": {
        c = valor*0.23884589663;
        return c
      }
      case "[Cal/g°C]": {
        c = valor
        return c
      }
      default: {
        return c
      }
    }
  }

  transformarFlujo(valor: number, a: string, b:  string): number {
    let c = 0;
    const flujo = this.fluToFlujo(valor, a)
    switch (b) {
      case "[MMSCFD]":{
        return c
      }
      case "[ACFM]":{
        return c
      }
      case "[lbm/min]":{
        return c
      }
      case "[lbm/min]":{
        return c
      }
      case "[lbmol/dia]": {
        return c
      }
      case "[m3/min]": {
        return c
      }
      case "[m3/sec]": {
        return c
      }
      default : {
        return c
      }
    }
  }

  fluToFlujo(valor: number, a: string) {
    let c = 0;
    switch (a) {
      case "[MMSCFD]":{
        return c
      }
      case "[ACFM]":{
        return c
      }
      case "[lbm/min]":{
        return c
      }
      case "[lbm/min]":{
        return c
      }
      case "[lbmol/dia]": {
        return c
      }
      case "[m3/min]": {
        return c
      }
      case "[m3/sec]": {
        return c
      }
      default : {
        return c
      }
    }
  }
}
