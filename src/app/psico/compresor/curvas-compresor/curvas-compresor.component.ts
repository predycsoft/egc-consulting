import { Component, OnInit, SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPolinomiosCurvasCompresorComponent } from '../dialog-polinomios-curvas-compresor/dialog-polinomios-curvas-compresor.component';

interface seccion{
  
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

@Component({
  selector: 'curvas-compresor',
  templateUrl: './curvas-compresor.component.html',
  styleUrls: ['./curvas-compresor.component.css']
})
export class CurvasCompresorComponent implements OnInit {

  impulsorSeleccionado: number;
  numSecciones: number;

  constructor(public dialog: MatDialog ) { }

  ngOnInit(): void {
  }

  seleccionarImpulsor(i){
    this.impulsorSeleccionado = i;
  }

  openDialogPolinomios() {
    const dialogRef = this.dialog.open(DialogPolinomiosCurvasCompresorComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
