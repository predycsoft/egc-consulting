import { Component, OnInit } from '@angular/core';
import { IconServiceService } from 'src/app/services/icon-service.service';


class datosCompresor{
  familia: string = '';
  tipologia: string = '';
  secciones: number = 1;
  fabricante: string = '';
  modelo: string = '';
  numSerial: string = '';
  tag: string = '';
  nombre: string = '';
  cliente: string = '';
  servicio: string = '';
  sitio: string = '';
  instalacion: string = '';
  numImpulsores: string = '';
  diametroEq: string = '';
  rpmDiseno: number = 0;
  rpmRated: number = 0;
  tipoDriver: string = '';
}

@Component({
  selector: 'info-general-compresor',
  templateUrl: './info-general-compresor.component.html',
  styleUrls: ['./info-general-compresor.component.css']
})
export class InfoGeneralCompresor implements OnInit {

  // Datos generales del equipo asociado al proyecto
  
  compresor = new datosCompresor;



  // Datos tecnicos inherentes al modelo de compresor

  //potencia: string;
  //.. 
  //..
  //Se debe completar esta info con enrique


  constructor(public icon: IconServiceService) { }

  ngOnInit(): void {
  }

}
