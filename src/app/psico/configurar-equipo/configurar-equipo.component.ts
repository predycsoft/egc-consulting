import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configurar-equipo',
  templateUrl: './configurar-equipo.component.html',
  styleUrls: ['./configurar-equipo.component.css']
})
export class ConfigurarEquipoComponent implements OnInit {

  tagEquipo: string;
  tipoEquipo: string = 'Compresor'

  constructor() { }

  ngOnInit(): void {
  }

}
