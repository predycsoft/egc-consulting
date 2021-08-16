import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAgregarEquipoComponent } from '../dialog-agregar-equipo/dialog-agregar-equipo.component';

interface tren {
  tag: string,
  cantEquipos: number,
  equipos: equipo[],
}

interface equipo {
  tag: string,
  orden: number,
  tipo: "compresor" | "turbina",
}

@Component({
  selector: 'configuracion-tren',
  templateUrl: './configuracion-tren.component.html',
  styleUrls: ['./configuracion-tren.component.css']
})
export class ConfiguracionTrenComponent implements OnInit {

  constructor(
    public dialogAgregar: MatDialog,
  ) { }

  tipoSimulacion: "real" | "teorica" | "ambas";

  nuevo = true
  tren:tren  = {
    tag: "",
    cantEquipos: 0,
    equipos: [],
  }

  equipo = {
    tag: "",
    orden: 0,
    tipo: "compresor",
  }

  ngOnInit(): void {
    if (this.nuevo) {
      this.inicializarTren();
    } else {
      this.cargarTren();
    }
  }

  inicializarTren() {
    this.tipoSimulacion = "ambas";
    for (let index = 0; index < 4; index++) {
      this.anexarEquipo("compresor")      
    }
  }


  dialogAgregarEquipo() {
    const dialogRef = this.dialogAgregar.open(DialogAgregarEquipoComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
}

  anexarEquipo(tipo: "compresor" | "turbina") {
    if (this.tren.equipos.length == 0) {
      tipo = "turbina"
    }
    this.tren.equipos.concat({
      tag: "",
      orden: this.tren.equipos.length,
      tipo: tipo,
    })
  }

  modificarEquipo(index: number) {
    this.equipo = this.tren.equipos[index]
    // abrir ventana
    // al cerrar ventana guardar this.tren.equipos[index] = this.equipo y volver a reininciar
  }

  cargarTren() {
    const tren = "tren";
    return tren;
  }

  cargarEquipo(index: number) {
    return true
  }
}
