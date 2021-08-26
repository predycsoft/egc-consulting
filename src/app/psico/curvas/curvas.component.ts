import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPolinomiosCurvasComponent } from '../dialog-polinomios-curvas/dialog-polinomios-curvas.component';

@Component({
  selector: 'curvas',
  templateUrl: './curvas.component.html',
  styleUrls: ['./curvas.component.css']
})
export class CurvasComponent implements OnInit {

  impulsorSeleccionado: number;
  numSecciones: number;

  constructor(public dialog: MatDialog ) { }

  ngOnInit(): void {
  }

  seleccionarImpulsor(i){
    this.impulsorSeleccionado = i;
  }

  openDialogPolinomios() {
    const dialogRef = this.dialog.open(DialogPolinomiosCurvasComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
