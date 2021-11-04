import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cromatografia, DataServiceService } from 'src/app/services/data-service.service';
import { DialogLibreriaCromatografiasComponent } from '../dialog-libreria-cromatografias/dialog-libreria-cromatografias.component';

class propiedadesCromatografia{
    // Propiedades calculadas del gas
    presion: number = 0; //input
    temperatura: number = 0; //input
    densidad: number;
    volumen: number;
    entalpia: number;
    entropia: number;
    pesoMolecular: number;
    compresibilidad: number;
    calidad: number;
    LHV: number;
    HHV: number;
    gravedadEspecifica: number;
    wi: number
}

@Component({
  selector: 'cromatografia',
  templateUrl: './cromatografia.component.html',
  styleUrls: ['./cromatografia.component.css']
})
export class CromatografiaComponent implements OnInit {

  nombreCromatografia: string = ''
  cromatografiaOriginal = new cromatografia
  cromatografiaNormalizada = new cromatografia
  propidadesCromatografia = new propiedadesCromatografia();
  fraccMolarTotal: number = 0;

  constructor(private dialog: MatDialog, public data: DataServiceService) { }

  ngOnInit(): void {

  }

  normalizar() {
    this.fraccMolarTotal = 0
    let val = JSON.parse(JSON.stringify(this.cromatografiaNormalizada))
    Object.keys(val).forEach(key => {
      this.fraccMolarTotal = this.fraccMolarTotal + +val[key]
    })
    Object.keys(val).forEach(key => {
      val[key] = val[key]/this.fraccMolarTotal
    })
    this.cromatografiaNormalizada= val;
  }

  returnZero() {
    return 0
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  openLibreriaCromatografias(){
    const dialogRef = this.dialog.open(DialogLibreriaCromatografiasComponent, {
    });
  }


}
