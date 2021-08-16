import { Component, OnInit } from '@angular/core';

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
