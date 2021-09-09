import { Component, OnInit, SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPolinomiosCurvasCompresorComponent } from '../dialog-polinomios-curvas-compresor/dialog-polinomios-curvas-compresor.component';

interface curvas {
  // Data general de las curvas delimpulsor
  numSeccion: number;
  numImpulsor: number; // 0 es el default para el impulsor requivalente y 1++ el numero que ocuparian los impulsores individuales
  diametro: number; // diametro de cada impulsor
  limSurge: number, //Límite Q/N de surge
  limStw: number, //Límite Q/N de stw

  // Coeficiente de Head 
  coefHeadDataSet: any; //es una matriz que contiene Num de punto, Q/N y u (miu = head)
  coefHeadA1: number; //termino independiente a0*x^0
  coefHeadA2: number; //a1*X^1
  coefHeadA3: number; //a2*X^2
  coefHeadA4: number; //a3*X^3
  coefHeadExp: number;
  coefHeadError: number;

  // Eficiencia politropica 
  eficPoliDataSet: any;  //es una matriz que contiene Num de punto, Q/N y n (eta = eficiencia)
  eficPoliA1: number; //termino independiente a0*x^0
  eficPoliA2: number; //a1*X^1
  eficPoliA3: number; //a2*X^2
  eficPoliA4: number; //a3*X^3
  eficPoliExp: number;
  eficPoliError: number;
}

// A traves del front:
// 1: Se selecciona la seccion -> se filtra la data segun el numero de la sección
// 2: 

@Component({
  selector: 'curvas-compresor',
  templateUrl: './curvas-compresor.component.html',
  styleUrls: ['./curvas-compresor.component.css']
})
export class CurvasCompresorComponent implements OnInit {

  impulsorSeleccionado: number;
  numSecciones: number;
  seccionActual: number;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  seleccionarImpulsor(i) {
    this.impulsorSeleccionado = i;
  }

  openDialogPolinomios() {
    const dialogRef = this.dialog.open(DialogPolinomiosCurvasCompresorComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
