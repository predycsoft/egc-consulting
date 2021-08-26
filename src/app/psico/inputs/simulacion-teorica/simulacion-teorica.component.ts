import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DimensionesService, variable } from 'src/app/services/dimensiones.service';
import { DialogPolinomiosCurvasComponent } from '../../dialog-polinomios-curvas/dialog-polinomios-curvas.component';
import { CromatografiaComponent } from '../cromatografia/cromatografia.component';

@Component({
  selector: 'simulacion-teorica',
  templateUrl: './simulacion-teorica.component.html',
  styleUrls: ['./simulacion-teorica.component.css']
})
export class SimulacionTeoricaComponent implements OnInit {
  
  constructor(
    public dims: DimensionesService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialogCromatografia() {
    const dialogRef = this.dialog.open(CromatografiaComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
