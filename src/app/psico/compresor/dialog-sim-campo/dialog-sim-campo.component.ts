import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { curva, DataServiceService, equipo, Proyecto, tren } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-dialog-sim-campo',
  templateUrl: './dialog-sim-campo.component.html',
  styleUrls: ['./dialog-sim-campo.component.css']
})
export class DialogSimCampoComponent implements OnInit {

  constructor(private route: ActivatedRoute, private data: DataServiceService) { }
  proyecto: Proyecto;
  tren: tren;
  equipos: equipo[];
  curvas: {
    equipotag: string,
    curvas: curva[]
  }[]



  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.route.params.subscribe(params => {
          const trenTag = params.trenTag;
          this.data.getTren(this.proyecto.id, trenTag).subscribe(tren => {
            this.tren = tren
            this.data.getEquipos(this.proyecto.id,trenTag).subscribe(equipos => {
              this.equipos = equipos
              this.curvas = []
              this.equipos.forEach(equipo => {
                const curvas = this.data.getCurvas(this.proyecto.id, trenTag)
                const obj = {
                  equipoTag: equipo.tag,
                  curvas: curvas
                }
              })
            })
          })
        })
      })
    })
  }

}
