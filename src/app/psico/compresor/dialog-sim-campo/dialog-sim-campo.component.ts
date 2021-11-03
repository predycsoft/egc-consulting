import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { curva, DataServiceService, equipo, Proyecto, tren } from 'src/app/services/data-service.service';

interface curvaEquipo {
  equipoTag: string,
  curvas: curva[]
}

@Component({
  selector: 'app-dialog-sim-campo',
  templateUrl: './dialog-sim-campo.component.html',
  styleUrls: ['./dialog-sim-campo.component.css']
})
export class DialogSimCampoComponent implements OnInit {

  constructor(private route: ActivatedRoute, public data: DataServiceService, private afs: AngularFirestore) { }
  proyecto: Proyecto;
  tren: tren;
  equipos: equipo[];
  curvas: curvaEquipo[]



  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.route.params.subscribe(params => {
          const trenTag = params.trenTag;
          this.data.getTren(this.proyecto.id, trenTag).subscribe(tren => {
            this.tren = tren
            this.data.getEquipos(this.proyecto.id,trenTag).subscribe(async equipos => {
              this.equipos = equipos
              let curvasCompletas = []
              for (let i = 0; i < this.equipos.length; i++) {
                let curvas = []
                const curvasDocs = await this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipos[i].tag).collection("curvas").ref.get();
                for (let j = 0; j < curvasDocs.docs.length; j++) {
                  const curva = curvasDocs.docs[j].data();
                  if (curva.equivalente == true){
                    curvas.push(curva)
                  }
                }
                const obj = {
                  equipoTag: this.equipos[i].tag,
                  curvas: curvas
                }
                curvas = []
                curvasCompletas = curvasCompletas.concat(obj)
              }
              this.curvas = curvasCompletas
              console.log(this.proyecto)
              console.log(this.tren)
              console.log(this.equipos)
              console.log(this.curvas)
            })
          })
        })
      })
    })
  }

}
