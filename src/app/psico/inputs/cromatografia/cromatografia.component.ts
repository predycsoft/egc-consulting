import { Component, OnInit } from '@angular/core';

interface componente{
  nombre: string,
  formula: string,
  pesoMolecular: number,
  fraccionMolar: number;
  normalizado: number;
}

@Component({
  selector: 'cromatografia',
  templateUrl: './cromatografia.component.html',
  styleUrls: ['./cromatografia.component.css']
})
export class CromatografiaComponent implements OnInit {

  cromatografia: componente[] = [
    {nombre: 'metano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: .2, normalizado: .2 },
    {nombre: 'etano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: .2, normalizado: .2 },
    {nombre: 'propano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: .2, normalizado: .2 },
    {nombre: 'i-butano', formula: 'C1', pesoMolecular: 16.042,  fraccionMolar: .2, normalizado: .2 },
    {nombre: 'n-butano', formula: 'C1', pesoMolecular: 16.042,  fraccionMolar: .2, normalizado: .2 },
    {nombre: 'i-pentano', formula: 'C1', pesoMolecular: 16.042,fraccionMolar: .2, normalizado: .2 },
    {nombre: 'n-pentano', formula: 'C1', pesoMolecular: 16.042,  fraccionMolar: .2, normalizado: .2 },
    {nombre: 'hexano', formula: 'C1', pesoMolecular: 16.042,  fraccionMolar: .2, normalizado: .2 },
    {nombre: 'heptano', formula: 'C1', pesoMolecular: 16.042,  fraccionMolar: .2, normalizado: .2 },
    {nombre: 'octano', formula: 'C1', pesoMolecular: 16.042,  fraccionMolar: .2, normalizado: .2 },
    {nombre: 'nonano', formula: 'C1', pesoMolecular: 16.042,  fraccionMolar: .2, normalizado: .2 },
    {nombre: 'decano', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: .2, normalizado: .2 },
    {nombre: 'nitrogeno', formula: 'C1', pesoMolecular: 16.042,  fraccionMolar: .2, normalizado: .2 },
    {nombre: 'dioxCarbono', formula: 'C1', pesoMolecular: 16.042,  fraccionMolar: .2, normalizado: .2 },
    {nombre: 'sulfHidrogeno', formula: 'C1', pesoMolecular: 16.042,  fraccionMolar: .2, normalizado: .2 },
    {nombre: 'aire', formula: 'C1', pesoMolecular: 16.042, fraccionMolar: .2, normalizado: .2 }
  ]

  constructor() { }

  ngOnInit(): void {
    const hexano = this.cromatografia.find(x => x.nombre == "hexano")
    hexano.formula;
  }

}
