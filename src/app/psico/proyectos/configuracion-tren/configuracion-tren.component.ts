import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService, equipo, equipo_tren, Proyecto, tren } from 'src/app/services/data-service.service';
import { DialogAgregarEquipoComponent } from '../dialog-agregar-equipo/dialog-agregar-equipo.component';
import { IconServiceService } from 'src/app/services/icon-service.service';
import { ViewChild } from '@angular/core'
import { MatMenuTrigger } from '@angular/material/menu';
import { DialogService } from 'src/app/services/dialog.service';


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
    public icon: IconServiceService,
    public dialogService: DialogService,
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


  // context menu function

  @ViewChild('trigger')
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  // 
  anexarEquipo() {
    const dialogRef = this.dialogAgregar.open(DialogAgregarEquipoComponent);
    dialogRef.afterClosed().subscribe(async (result: equipo_tren) => {
      if (result) {
        result.orden = this.tren.equipos.length;
        this.tren.equipos = this.tren.equipos.concat(result)
        const index = this.proyecto.trenes.findIndex(x => x.tag == this.trenTag)
        this.proyecto.trenes[index] = this.tren
        await this.data.updateTren(this.proyectoId, JSON.parse(JSON.stringify(this.proyecto.trenes))).catch(error => console.log(error))
        const newEquipo: equipo = new equipo()
        newEquipo.tag = result.tag
        newEquipo.orden = result.orden
        newEquipo.familia = result.familia
        newEquipo.tipologia = result.tipologia
        console.log(newEquipo)
        await this.data.createEquipo(this.proyectoId, JSON.parse(JSON.stringify(newEquipo))).catch(error => console.log(error))
      }
    })
  }

  modificarEquipo(equipo: equipo_tren) {
    const dialogRef = this.dialogAgregar.open(DialogAgregarEquipoComponent, {
      data: equipo
    });
    const tagViejo = equipo.tag
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const index = this.proyecto.trenes.findIndex(x => x.tag == this.trenTag)
        const equipoIndex = this.proyecto.trenes[index].equipos.findIndex(x => x.tag == equipo.tag)
        this.proyecto.trenes[index].equipos[equipoIndex] = result
        this.data.updateTren(this.proyectoId, JSON.parse(JSON.stringify(this.proyecto.trenes)))
        this.data.obtenerEquipo(this.proyectoId, tagViejo).subscribe(async equipo => {
          const equipoNuevo: equipo = equipo;
          equipoNuevo.tag = result.tag
          console.log("equipo viejo tag" + tagViejo)
          console.log("equipo nuevo tag" + equipoNuevo.tag)
          await this.data.eliminarEquipo(this.proyectoId, tagViejo)
          await this.data.createEquipo(this.proyectoId, JSON.parse(JSON.stringify(equipoNuevo)))
        }).unsubscribe()
      }
    })
  }

  async eliminarEquipo(tag) {
    this.dialogService.dialogConfirmar().afterClosed().subscribe(res => {
      if (res == true) {
        this.confirmarEliminarEquipo(tag)
      }
    });

  }

  async confirmarEliminarEquipo(tag) {
    const idxEquipo = this.tren.equipos.findIndex(x => x.tag == tag)
    this.tren.equipos.splice(idxEquipo, 1)
    this.tren.equipos.forEach((equipo, index) => {
      if (equipo.orden > idxEquipo) {
        this.tren.equipos[index].orden += -1;
      }
    })
    const index = this.proyecto.trenes.findIndex(x => x.tag == this.trenTag)
    this.proyecto.trenes[index] = this.tren
    await this.data.updateTren(this.proyectoId, JSON.parse(JSON.stringify(this.proyecto.trenes))).catch((error) => console.log(error))
    await this.data.eliminarEquipo(this.proyectoId, tag);
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

  moverIzquierda(tag) {
    const index = this.tren.equipos.findIndex(x => x.tag == tag);
    if (index > 0) {
      const tren1: equipo_tren = this.tren.equipos[index]
      this.tren.equipos[index] = this.tren.equipos[index - 1]
      this.tren.equipos[index].orden = index;
      this.tren.equipos[index - 1] = tren1
      this.tren.equipos[index - 1].orden = index - 1
      const indexTren = this.proyecto.trenes.findIndex(x => x.tag == this.trenTag)
      this.proyecto.trenes[indexTren] = this.tren
      this.data.updateTren(this.proyectoId, JSON.parse(JSON.stringify(this.proyecto.trenes))).catch((error) => console.log(error))
    } else {
      alert("es el primero en el tren")
    }
  }
}
