import { Component, OnInit } from '@angular/core';

interface componente {
  nombre: string,
  formula: string,
  pesoMolecular: number,
  fraccionMolar: number;
}

class cromatografia {
  metano: number = 0;
  etano: number = 0;
  propano: number = 0;
  iButano: number = 0;
  nButano: number = 0;
  iPentano: number = 0;
  nPentano: number = 0;
  hexano: number = 0;
  heptano: number = 0;
  octano: number = 0;
  nonano: number = 0;
  decano: number = 0;
  nitrogeno: number = 0;
  dioxCarbono: number = 0;
  sulfHidrogeno: number = 0;
  aire: number = 0;
}

class propiedadesCromatografia{
    // Propiedades calculadas del gas
    presion: number = 0;
    temperatura: number = 0;
    densidad: number = 0;
    volumen: number = 0;
    entalpia: number = 0;
    entropia: number = 0;
    pesoMolecular: number = 0;
    compresibilidad: number = 0;
    calidad: number = 0;
    LHV: number = 0;
    HHV: number = 0;
    gravedadEspecifica: number = 0;
    wi: number = 0;
}

@Component({
  selector: 'cromatografia',
  templateUrl: './cromatografia.component.html',
  styleUrls: ['./cromatografia.component.css']
})
export class CromatografiaComponent implements OnInit {


  cr: cromatografia = new cromatografia();
  propidadesCromatografia = new propiedadesCromatografia();
  fraccMolarTotal: number = 0;

  cromatografia: componente[] = [
    { nombre: 'Metano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.metano},
    { nombre: 'Etano', formula: 'C1', pesoMolecular: 30.07, fraccionMolar: this.cr.etano},
    { nombre: 'Propano', formula: 'C1', pesoMolecular: 44.097, fraccionMolar: this.cr.propano},
    { nombre: 'I-butano', formula: 'C1', pesoMolecular: 58.124, fraccionMolar: this.cr.iButano},
    { nombre: 'N-butano', formula: 'C1', pesoMolecular: 58.128, fraccionMolar: this.cr.nButano},
    { nombre: 'I-pentano', formula: 'C1', pesoMolecular: 72.151, fraccionMolar: this.cr.iPentano},
    { nombre: 'N-pentano', formula: 'C1', pesoMolecular: 72.151, fraccionMolar: this.cr.nPentano},
    { nombre: 'Hexano', formula: 'C1', pesoMolecular: 86.178, fraccionMolar: this.cr.hexano},
    { nombre: 'Heptano', formula: 'C1', pesoMolecular: 100.205, fraccionMolar: this.cr.heptano},
    { nombre: 'Octano', formula: 'C1', pesoMolecular: 114.232, fraccionMolar: this.cr.octano},
    { nombre: 'Nonano', formula: 'C1', pesoMolecular: 128.259, fraccionMolar: this.cr.nonano},
    { nombre: 'Decano', formula: 'C1', pesoMolecular: 142.259, fraccionMolar: this.cr.decano},
    { nombre: 'Nitrogeno', formula: 'C1', pesoMolecular: 28.013, fraccionMolar: this.cr.nitrogeno},
    { nombre: 'DioxCarbono', formula: 'C1', pesoMolecular: 44.13, fraccionMolar: this.cr.dioxCarbono},
    { nombre: 'SulfHidrogeno', formula: 'C1', pesoMolecular: 34.076, fraccionMolar: this.cr.sulfHidrogeno},
    { nombre: 'Aire', formula: 'C1', pesoMolecular: 28.966, fraccionMolar: this.cr.aire}
  ]

  constructor() { }

  ngOnInit(): void {

  }

  normalizar() {
    this.fraccMolarTotal = 0
    let val = JSON.parse(JSON.stringify(this.cr))
    Object.keys(val).forEach(key => {
      this.fraccMolarTotal = this.fraccMolarTotal + +val[key]
    })
    Object.keys(val).forEach(key => {
      val[key] = val[key]/this.fraccMolarTotal
    })
    this.cr= val;
  }

  returnZero() {
    return 0
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }


}
