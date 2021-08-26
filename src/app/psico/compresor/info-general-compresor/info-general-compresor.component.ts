import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'info-general-compresor',
  templateUrl: './info-general-compresor.component.html',
  styleUrls: ['./info-general-compresor.component.css']
})
export class InfoGeneralCompresor implements OnInit {

  // Datos generales del equipo asociado al proyecto
  
  tag: string;
  modelo: string;
  fabricante: string;
  familia: string;
  tipo: string;
  tipologia: string;
  secciones: number;

  // Datos tecnicos inherentes al modelo de compresor

  //potencia: string;
  //.. 
  //..
  //Se debe completar esta info con enrique


  constructor() { }

  ngOnInit(): void {
  }

}
