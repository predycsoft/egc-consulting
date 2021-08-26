import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAgregarEquipoComponent } from '../dialog-agregar-equipo/dialog-agregar-equipo.component';

interface proyecto {
  empresa: string,
  instalacion: string,
  nombre: string,
  trenes: tren[],
}

interface tren {
  tag: string,
  equipos: equipo[],
}

interface equipo {
  tag: string,
  orden: number,
  familia: "compresor" | "turbina" | "por definir",
  tipologia: string,
}

class prueba {
  content: string = "";
  modelo: string = "";
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
  trenSeleccionado: string = 'TC-5200A';

  nuevo = true
  proyecto
  tren: tren = {
    tag: "",
    equipos: [],
  }

  equipo = {
    tag: "",
    orden: 0,
    familia: "compresor",
    tipologia: "inline"
  }

  prueba = new prueba();

  ngOnInit(): void {
    console.log(this.prueba)
    if (this.nuevo) {
      this.inicializarTren();
    } else {
      this.cargarTren();
    }
  }

  inicializarTren() {
    this.tipoSimulacion = "ambas";
    this.anexarEquipo()
  }


  dialogAgregarEquipo() {
    const dialogRef = this.dialogAgregar.open(DialogAgregarEquipoComponent);
     dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  anexarEquipo() {
    const dialogRef = this.dialogAgregar.open(DialogAgregarEquipoComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.tren.equipos = this.tren.equipos.concat({
        tag: result.tagEquipo,
        orden: this.tren.equipos.length,
        familia: result.tipoEquipo,
        tipologia: result.tipologia
      })
      console.log(this.tren.equipos)
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
