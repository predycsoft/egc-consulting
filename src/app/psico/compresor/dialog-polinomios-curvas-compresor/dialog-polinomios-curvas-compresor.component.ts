import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'dialog-polinomios-curvas-compresor',
  templateUrl: './dialog-polinomios-curvas-compresor.component.html',
  styleUrls: ['./dialog-polinomios-curvas-compresor.component.css']
})
export class DialogPolinomiosCurvasCompresorComponent implements OnInit {


  tipoAjuste: string = 'Automatico';
  grado: number;
  unidadFlujo: string = 'Q/N';

  constructor(public dialogService: DialogService) { }

  ngOnInit(): void {
  }

  eliminarCurva() {
    this.dialogService.dialogConfirmar().afterClosed().subscribe(res => {
      if (res == true) {
      }
    });
  }

}
