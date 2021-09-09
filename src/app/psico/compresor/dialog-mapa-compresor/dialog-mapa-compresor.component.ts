import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';

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
  // dataSets: dataSet[]; // Asi tambien podria hacerse.. El numero de posicion del elemento en el array seria el "id comun"
}


@Component({
  selector: 'app-dialog-mapa-compresor',
  templateUrl: './dialog-mapa-compresor.component.html',
  styleUrls: ['./dialog-mapa-compresor.component.css']
})
export class DialogMapaCompresorComponent implements OnInit {


  rpmSeleccionado: number = -1;
  tipoAjuste: string = 'Automatico';
  grado: number;
  unidadesX: string = 'psig';
  unidadesY: string = 'MMscfd';

  constructor(public dialogService: DialogService) { }

  ngOnInit(): void {
  }

  eliminarCurva() {
    this.dialogService.dialogConfirmar().afterClosed().subscribe(res => {
      if (res == true) {
      }
    });
  }

  seleccionarRPM(i){
    this.rpmSeleccionado = i;
  }

  configurarMapa(){
    this.rpmSeleccionado = -1;
  }

}
