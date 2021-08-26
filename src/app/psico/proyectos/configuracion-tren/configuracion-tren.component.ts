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
        this.data.obtenerProyecto(this.proyectoId).subscribe((proyecto) => {
          this.proyecto = proyecto
          this.tren = proyecto.trenes.find(x => x.tag == this.trenTag)
        })
      })
    })
  }

  anexarEquipo() {
    const dialogRef = this.dialogAgregar.open(DialogAgregarEquipoComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.tren.equipos = this.tren.equipos.concat(result)
      const index = this.proyecto.trenes.findIndex(x => x.tag == this.trenTag)
      this.proyecto.trenes[index] = this.tren
      this.data.updateTren(this.proyectoId, JSON.parse(JSON.stringify(this.proyecto.trenes)))
    })
  }

  eliminarEquipo(tag) {
    const idxEquipo = this.tren.equipos.findIndex(x => x.tag == tag)
    this.tren.equipos.splice(idxEquipo,1)
    const index = this.proyecto.trenes.findIndex(x => x.tag == this.trenTag)
    this.proyecto.trenes[index] = this.tren
    this.data.updateTren(this.proyectoId, JSON.parse(JSON.stringify(this.proyecto.trenes)))
  }


  modificarEquipo(index: number) {
    this.equipo = this.tren.equipos[index]
    // abrir ventana
    // al cerrar ventana guardar this.tren.equipos[index] = this.equipo y volver a reininciar
  }
}
