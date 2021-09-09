import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogMapaCompresorComponent } from '../dialog-mapa-compresor/dialog-mapa-compresor.component';

interface mapa {
  numSeccion: number;
  nombre : string;
  vigencia: string;
  fechaEntradaVigor: string;
  fechaSalidaVigor: string;
  foto: string;
  unidadesX: string;
  unidadesY: string;
  comentario: string;
  rpms: rpm[]; 
  // dataSets: dataSet[]; // Asi tambien podria hacerse.. El numero de posicion del elemento en el array seria el "id comun"
}

interface rpm { 
  rpm: number;
  a0: number;
  a1: number;
  a2: number;
  a3: number;
  exp: number;
  error: number;
  dataSet: dataSet;
}

interface dataSet{
  punto: number;
  valX: number;
  valY: number;
}

// En el front:
// 1: Se selecciona la seccion -> se filtra la data segun el numero de la sección
// 2: Se muestran los mapas asociados a esa sección
// 3: Se muestra la data del mapa seleccionado


@Component({
  selector: 'mapas-compresor',
  templateUrl: './mapas-compresor.component.html',
  styleUrls: ['./mapas-compresor.component.css']
})
export class MapasCompresorComponent implements OnInit {

  seccionActual: number;
  
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  configurarMapa(){
    const dialogRef = this.dialog.open(DialogMapaCompresorComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
