import { Component, OnInit } from '@angular/core';

interface tren {
  tag: string,
  cantEquipos: number,
  equipos: equipo[],
}

interface equipo {
  tag: string,
  orden: number,
  tipo: "compresor" | "turbina" | "por definir",
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
  tren: tren  = {
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
    this.anexarEquipo("por definir")
  }

  anexarEquipo(tipo: "compresor" | "turbina"| "por definir") {
    this.tren.equipos = this.tren.equipos.concat({
      tag: "",
      orden: this.tren.equipos.length,
      tipo: tipo,
    })
    console.log(this.tren.equipos)
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
