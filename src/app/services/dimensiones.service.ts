import { Injectable } from '@angular/core';

export interface variables {
  valor: number,
  dimension: string,
}

@Injectable({
  providedIn: 'root'
})

export class DimensionesService {

  constructor() {}

  temperatura = ["[°F]","[°K]","[°C]"];
  presion = ["[psig]","[psia]","[barg]","[KPag]"];
  densidad = ["[lbmol/pie3]","[lbm/pie3]", ["lbm/pulg3"],"[Kg/m3]","[g/cm3]",["°API"]];
  volumen = ["[pie3/lbm]","[pi3/lbmol]","[m3/kg]"];
  entalpia = ["[BTU/lbm]","[BTU/lbmol]","[KJ/kg]","[Cal/g]"];
  entropia = ["[BTU/lbm°F]","[BTU/lbmol°R]","[KJ/kg°K]","[Cal/g°C]"];
  pesoMolecular = ["[lbm/lbmol]"];
  flujo =  ["[MMSCFD]","[ACFM]", ["lbm/min"],"[lbmol/dia]","[m3/min]",["m3/sec"]];
}
