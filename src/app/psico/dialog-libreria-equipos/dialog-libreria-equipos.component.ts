import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-dialog-libreria-equipos',
  templateUrl: './dialog-libreria-equipos.component.html',
  styleUrls: ['./dialog-libreria-equipos.component.css']
})
export class DialogLibreriaEquiposComponent implements OnInit {

  selected: number = -1;
  
  constructor(private dialogService: DialogService) { }

  ngOnInit(): void {
  }

  equipoSeleccionado(i){
    this.selected = i;
  }

  eliminarEquipo() {
    this.dialogService.dialogConfirmar().afterClosed().subscribe(res => {
      if (res == true) {
        
      }
    });
  }

}

