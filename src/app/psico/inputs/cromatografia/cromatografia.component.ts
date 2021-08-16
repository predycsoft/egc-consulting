import { Component, OnInit } from '@angular/core';

interface componente {
  nombre: string,
  formula: string,
  pesoMolecular: number,
  fraccionMolar: number;
  normalizado: number;
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

@Component({
  selector: 'cromatografia',
  templateUrl: './cromatografia.component.html',
  styleUrls: ['./cromatografia.component.css']
})
export class CromatografiaComponent implements OnInit {


  cr: cromatografia = new cromatografia();

  fraccMolarTotal: number = 0;

  cromatografia: componente[] = [
    { nombre: 'metano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.metano, normalizado: .2 },
    { nombre: 'etano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.etano, normalizado: .2 },
    { nombre: 'propano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.propano, normalizado: .2 },
    { nombre: 'i-butano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.iButano, normalizado: .2 },
    { nombre: 'n-butano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.nButano, normalizado: .2 },
    { nombre: 'i-pentano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.iPentano, normalizado: .2 },
    { nombre: 'n-pentano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.nPentano, normalizado: .2 },
    { nombre: 'hexano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.hexano, normalizado: .2 },
    { nombre: 'heptano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.heptano, normalizado: .2 },
    { nombre: 'octano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.octano, normalizado: .2 },
    { nombre: 'nonano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.nonano, normalizado: .2 },
    { nombre: 'decano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.decano, normalizado: .2 },
    { nombre: 'nitrogeno', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.nitrogeno, normalizado: .2 },
    { nombre: 'dioxCarbono', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.dioxCarbono, normalizado: .2 },
    { nombre: 'sulfHidrogeno', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.sulfHidrogeno, normalizado: .2 },
    { nombre: 'aire', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: this.cr.aire, normalizado: .2 }
  ]




  constructor() { }

  ngOnInit(): void {
    const hexano = this.cromatografia.find(x => x.nombre == "hexano")
    hexano.formula;
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
