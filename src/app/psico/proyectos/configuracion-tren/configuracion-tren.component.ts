import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { equipo_tren, tren } from 'src/app/services/data-service.service';
import { DialogAgregarEquipoComponent } from '../dialog-agregar-equipo/dialog-agregar-equipo.component';


@Component({
  selector: 'configuracion-tren',
  templateUrl: './configuracion-tren.component.html',
  styleUrls: ['./configuracion-tren.component.css']
})
export class ConfiguracionTrenComponent implements OnInit {

  constructor(
    public dialogAgregar: MatDialog,
    private route: ActivatedRoute,
  ) { }

  tipoSimulacion: "real" | "teorica" | "ambas";
  trenSeleccionado: string = 'TC-5200A';
  proyecto
  tren: tren = {
    tag: "",
    fechaCreacion: new Date(),
    equipos: [],
  }
  equipo = new equipo_tren()
  proyectoId: string = "";
  trenTag: string = ""

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.proyectoId = params.id
      this.route.params.subscribe(params => {
        this.trenTag = params.trenTag;
        console.log(this.proyectoId);
        console.log(this.trenTag);
      })
    })
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
}
