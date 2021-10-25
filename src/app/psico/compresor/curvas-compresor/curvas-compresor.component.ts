import { Component, OnInit, SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPolinomiosCurvasCompresorComponent } from '../dialog-polinomios-curvas-compresor/dialog-polinomios-curvas-compresor.component';



// A traves del front:
// 1: Se selecciona la seccion -> se filtra la data segun el numero de la sección
// 2: 

@Component({
  selector: 'curvas-compresor',
  templateUrl: './curvas-compresor.component.html',
  styleUrls: ['./curvas-compresor.component.css']
})
export class CurvasCompresorComponent implements OnInit {

  impEqSel: string = '';
  impSel: number;

  numSecciones: number;
  seccionActual: number;



  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  seleccionarImpulsorEquivalente(data) {
    this.impEqSel = data;
    this.impSel = -1;
  }


  seleccionarImpulsor(i) {
    this.impSel = i;
  }

  openDialogPolinomios() {
    const dialogRef = this.dialog.open(DialogPolinomiosCurvasCompresorComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
