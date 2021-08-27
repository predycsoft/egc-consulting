import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService, equipo_tren, Proyecto, tren } from 'src/app/services/data-service.service';
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
    private data: DataServiceService,
  ) { }
  proyecto: Proyecto;
  tipoSimulacion: "real" | "teorica" | "ambas";
  trenSeleccionado: string = 'TC-5200A';
  tren: tren = new tren()
  equipoSelected = new equipo_tren()
  proyectoId: string = "";
  trenTag: string = "";

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.proyectoId = params.id
      this.route.params.subscribe(params => {
        this.trenTag = params.trenTag;
        console.log(this.proyectoId);
        console.log(this.trenTag);
        this.data.obtenerProyecto(this.proyectoId).subscribe((proyecto) => {
          this.proyecto = proyecto
          this.tren = proyecto.trenes.find(x => x.tag == this.trenTag)
        })
      })
    })
  }

  anexarEquipo() {
    const dialogRef = this.dialogAgregar.open(DialogAgregarEquipoComponent);
    dialogRef.afterClosed().subscribe((result: equipo_tren) => {
      if (result) {
        result.orden = this.tren.equipos.length;
        this.tren.equipos = this.tren.equipos.concat(result)
        const index = this.proyecto.trenes.findIndex(x => x.tag == this.trenTag)
        this.proyecto.trenes[index] = this.tren
        this.data.updateTren(this.proyectoId, JSON.parse(JSON.stringify(this.proyecto.trenes)))
      }
    })
  }

  modificarEquipo(equipo: equipo_tren) {
    const dialogRef = this.dialogAgregar.open(DialogAgregarEquipoComponent, {
      data: equipo
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.proyecto.trenes.findIndex(x => x.tag == this.trenTag)
        const equipoIndex = this.proyecto.trenes[index].equipos.findIndex(x => x.tag == equipo.tag)
        this.proyecto.trenes[index].equipos[equipoIndex] = result
        this.data.updateTren(this.proyectoId, JSON.parse(JSON.stringify(this.proyecto.trenes)))
      }
    })
  }

  eliminarEquipo(tag) {
    const idxEquipo = this.tren.equipos.findIndex(x => x.tag == tag)
    this.tren.equipos.splice(idxEquipo, 1)
    this.tren.equipos.forEach((equipo, index) => {
      if (equipo.orden > idxEquipo) {
        this.tren.equipos[index].orden += -1;
      }
    })
    const index = this.proyecto.trenes.findIndex(x => x.tag == this.trenTag)
    this.proyecto.trenes[index] = this.tren
    this.data.updateTren(this.proyectoId, JSON.parse(JSON.stringify(this.proyecto.trenes))).catch((error) => console.log(error))
  }

  moverDerecha(tag) {
    const index = this.tren.equipos.findIndex(x => x.tag == tag);
    if (index < this.tren.equipos.length - 1) {
      const tren1: equipo_tren = this.tren.equipos[index]
      this.tren.equipos[index] = this.tren.equipos[index + 1]
      this.tren.equipos[index].orden = index;
      this.tren.equipos[index + 1] = tren1
      this.tren.equipos[index + 1].orden = index + 1
      const indexTren = this.proyecto.trenes.findIndex(x => x.tag == this.trenTag)
      this.proyecto.trenes[indexTren] = this.tren
      this.data.updateTren(this.proyectoId, JSON.parse(JSON.stringify(this.proyecto.trenes))).catch((error) => console.log(error))
    } else {
      alert("es el último equipo en el tren")
    }
  }
}
