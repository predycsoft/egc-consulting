import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { cromatografia, curva, DataServiceService, equipo, Proyecto, tren } from 'src/app/services/data-service.service';
import { CromatografiaComponent } from '../../inputs/cromatografia/cromatografia.component';

interface curvaEquipo {
  equipoTag: string,
  seccion: number,
  curvas: curva[]
}

class inputs {
  TSUC: number = 0;
  PSUC: number = 0;
  PDES: number = 0;
  TDES: number = 0;
  RPM: number = 0;
  FLUJO: number = 0;
  Mezcla: cromatografia = new cromatografia;
  TDIM: string = "";
  QDIM: string = "";
  PDIM: string = "";
  DDIM: string = "";
}

class outputTeorica {
  eficPoli: number = 0
  coefWorkInput: number = 0
  coefHead: number = 0
  workPoli: number = 0
  gashp: number = 0
  flujoMasico: number = 0
  relacion_de_compresion: number = 0
  relacion_de_volumen: number = 0
  tIsent: number = 0
  pIsent: number = 0
  densSuc: number = 0
  densDes: number = 0
  densIsen: number = 0
  volSuc: number = 0
  volDes: number = 0
  volIsent: number = 0
  hSuc: number = 0
  hDes: number = 0
  hIsnet: number = 0
  sSuc: number = 0
  sDes: number = 0
  sIsent: number = 0
  compSuc: number = 0
  compDes: number = 0
  compIsent: number = 0
  ymw: number = 0
  qn: number = 0
}

class outputPE {

}

class simulacionPE {
  equipoTag: string = "";
  seccion: number = 0;
  curvas: curva[] = [];
  inputs: inputs = new inputs
}

@Component({
  selector: 'app-dialog-sim-campo',
  templateUrl: './dialog-sim-campo.component.html',
  styleUrls: ['./dialog-sim-campo.component.css']
})
export class DialogSimCampoComponent implements OnInit {

  constructor(private route: ActivatedRoute, public data: DataServiceService, private afs: AngularFirestore, private dialog: MatDialog) { }
  proyecto: Proyecto;
  tren: tren;
  equipos: equipo[];
  curvas: curvaEquipo[]
  simulaciones



  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.route.params.subscribe(params => {
          const trenTag = params.trenTag;
          this.data.getTren(this.proyecto.id, trenTag).subscribe(tren => {
            this.tren = tren
            this.data.getEquipos(this.proyecto.id, trenTag).subscribe(async equipos => {
              this.equipos = equipos
              let curvasCompletas = []
              for (let i = 0; i < this.equipos.length; i++) {
                let curvas: curva[] = []
                const curvasDocs = await this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipos[i].tag).collection("curvas").ref.get();
                for (let j = 0; j < curvasDocs.docs.length; j++) {
                  const curva = curvasDocs.docs[j].data() as curva;
                  if (curva.equivalente == true) {
                    curvas.push(curva)
                  }
                }
                if (this.equipos[i].nSecciones == 2) {
                  const obj1 = {
                    equipoTag: this.equipos[i].tag,
                    seccion: 1,
                    curvas: curvas.filter(x => x.numSeccion == 1)
                  }
                  const obj2 = {
                    equipoTag: this.equipos[i].tag,
                    seccion: 2,
                    curvas: curvas.filter(x => x.numSeccion == 2)
                  }
                  curvasCompletas = curvasCompletas.concat(obj1)
                  curvasCompletas = curvasCompletas.concat(obj2)
                } else {
                  const obj = {
                    equipoTag: this.equipos[i].tag,
                    seccion: 1,
                    curvas: curvas
                  }
                  curvasCompletas = curvasCompletas.concat(obj)
                }
                curvas = []
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


  openCromatografia() {
    const dialogRef = this.dialog.open(CromatografiaComponent, {
      data: {
        proyectoId: this.proyecto.id,
      }
    })
  }
}
