import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService } from 'src/app/services/data-service.service';
import { compresorDims, equipo, Proyecto, tren } from 'src/app/services/data-service.service';
import { DimensionesService } from 'src/app/services/dimensiones.service';
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
  compresor = new datosCompresor
  proyecto: Proyecto;
  equipo: equipo;
  tren: tren = new tren()
  

  // Datos tecnicos inherentes al modelo de compresor

  //potencia: string;
  //.. 
  //..
  //Se debe completar esta info con enrique


  constructor(
    public data: DataServiceService, private afs: AngularFirestore, public dims: DimensionesService, private route: ActivatedRoute, public icon: IconServiceService
    ) { }

  ngOnInit(): void {
    this.compresor.tipologia = "Inline"
  }

}
