import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DimensionesService, variable } from 'src/app/services/dimensiones.service';
import { CromatografiaComponent } from '../../inputs/cromatografia/cromatografia.component';

class compresorInline{
  mezclaGas: string;
  mezclaGasId: string;
  T1: number = 0;
  T2: number = 0; 
  P1: number = 0;
  P2: number = 0; 
  N:number = 0;
  Nrel: number = 0;
  numImpulsores: number = 0; //lo debe tomar de la cantidad de impulsores que tiene
  extraccionGC: number = 0;
  deltaP: number;
  perdidasMecanicas: number;
  perdidasCaja: number;
  Qin: number = 0;
  Qout: number = 0;
  Tin: number = 0;
  Deq: boolean = true;
}


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
