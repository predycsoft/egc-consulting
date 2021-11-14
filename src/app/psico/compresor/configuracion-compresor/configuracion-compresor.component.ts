import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService, equipo_tren, Proyecto } from 'src/app/services/data-service.service';
import { DialogLibreriaEquiposComponent } from '../../dialog-libreria-equipos/dialog-libreria-equipos.component';


// Variables compartidas para todas las corridas
interface compresorDims{
  p: string;
  t: string;
  q: string;
  rpm: string;
}

interface dataSheet{
  modelo: string;
}

interface caracteristicasFisicas{
  numeroCompresor: number,
  tipoCompresor: string,
  numeroImpulsores: number,
  diametro: number; //
  tieneCaja: boolean, // si cuenta o no con caja de engranajes
  relCaja: number, //relacion de velocidad de la caja respecto altren
  perdidasCaja: number,
  perdidasMecanicas: string|number,
}

interface curvas {
  limSurge: number, //Límite Q/N de surge
  limStw: number, //Límite Q/N de stw
  coefHead: polinomio;
  eficPoli: polinomio;
}

interface polinomio {
  a0: number, //termino independiente a0*x^0
  a1: number, //a1*X^1
  a2: number, //a2*X^2
  a3: number, //a3*X^3
}

interface compresorInput{
  // variantes para cada punto de la simulacion
  cromatografiaId: string,
  cromatografia: cromatografia,
  cromatografiaAnterior: string,
  ps: number, //presion de succion
  ts: number, //temperatura de succion
  pd: number, //presion de descarga
  td: number, // temperatura de descarga
  rpm: number, // cuando es simulacion teorica se utiliza para el tanteo
  q: number,

  // cuando hay lineas de flujo entrantes
  sidestream: string, //para asignar si tiene o no un flujo de entrada
  deltaP: number, //utlizado para simulaciones teoricas
  deltaQ: number,
  tIn: number,
  cromatrografiaInId: string,
  cromatografiaIn: cromatografia,
}

interface cromatografia{
  metano: number,
  etano: number,
  propano: number,
  iButano: number,
  nButano: number,
  iPentano: number,
  nPentano: number,
  hexano: number,
  heptano: number,
  octano: number,
  nonano: number,
  decano: number,
  nitrogeno: number,
  dioxCarbono: number,
  sulfHidrogeno: number,
  aire: number,
}

@Component({
  selector: 'configuracion-compresor',
  templateUrl: './configuracion-compresor.component.html',
  styleUrls: ['./configuracion-compresor.component.css']
})
export class ConfiguracionCompresorComponent implements OnInit {

  tabSelected: string = 'general';
  proyecto: Proyecto
  equipo: equipo_tren
  tagEquipo: string;
  tipoEquipo: string = 'Compresor'
  id: string;
  trenTag: string;



  constructor(private route: ActivatedRoute, private afs: AngularFirestore, private data: DataServiceService, public dialogAgregar: MatDialog) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.id = params.id
        this.route.params.subscribe(params => {
          this.trenTag = params.trenTag;
          this.tagEquipo = params.equipoTag;
          this.data.obtenerEquipo(this.proyecto.id, this.tagEquipo).subscribe((equipo) => {
            this.equipo = equipo
          })
          console.log(this.equipo)
        })
      })
    })
  }

  tabSelect(id: string){
    this.tabSelected = id;
  }
  
}
