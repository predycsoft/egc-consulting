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

class outputAdim {
  EFIC: number = 0
  coefWorkInput: number = 0
  CFHEAD: number = 0
  workPoli: number = 0
  HP: number = 0
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

class outputTeorico {
  PSUC: number = 0 
  PDES: number = 0
  TSUC: number = 0 
  TDES: number = 0 
  DG: number = 0 
  HG: number = 0 
  SURGE: number = 0 
  QN: number = 0 
  STONEW: number = 0 
  CFHEAD: number = 0 
  HEAD: number = 0 
  EFIC: number = 0 
  HP: number = 0 
  POLLY: number = 0 
  FLUJO: number = 0 
  RPM: number = 0
}

class simulacionPE {
  equipoTag: string = "";
  equipoFamilia: string = "";
  equipoTipologia: string = "";
  seccion: number = 0;
  curvas: curva[] = [];
  curva: curva;
  inputs: inputs = new inputs()
  outputPE: outputTeorico = new outputTeorico()
  outputAdim: outputAdim = new outputAdim()
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
  simulaciones:Array<Array<simulacionPE>> = []



  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.route.params.subscribe(params => {
          const trenTag = params.trenTag;
          this.data.getTren(this.proyecto.id, trenTag).subscribe(tren => {
            this.tren = tren
            this.data.getEquipos(this.proyecto.id, trenTag).subscribe(async equipos => {
              this.equipos = []
              this.equipos = equipos
              await this.armarSecciones()
              console.log(this.proyecto)
              console.log(this.tren)
              console.log(this.equipos)
              console.log(this.simulaciones)
            })
          })
        })
      })
    })
  }

  async armarSecciones(){
    try {
      let simulaciones: simulacionPE[] = []
      this.simulaciones = []
      for (let i = 0; i < this.equipos.length; i++) {
        let curvas = []
        const curvasDocs = await this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipos[i].tag).collection("curvas").ref.get();
        for (let j = 0; j < curvasDocs.docs.length; j++) {
          const curva = curvasDocs.docs[j].data() as curva;
          if (curva.equivalente == true) {
            curvas.push(curva)
          }
        }
        for (let sec = 1; sec < this.equipos[i].nSecciones+1; sec++) {
          const simulacion = new simulacionPE()
          simulacion.equipoTag = this.equipos[i].tag
          simulacion.equipoFamilia = this.equipos[i].familia
          simulacion.seccion = sec
          simulacion.curvas = curvas.filter(x => x.numSeccion == sec)
          simulacion.curva = simulacion.curvas.find(x => x.default == true)
          simulacion.inputs.DDIM = this.tren.dimensiones.diametro
          simulacion.inputs.PDIM =this.tren.dimensiones.presion
          simulacion.inputs.QDIM = this.tren.dimensiones.flujo
          simulacion.inputs.TDIM = this.tren. dimensiones.temperatura
          simulaciones.push(simulacion)
        }
        curvas = []
      }
      this.simulaciones = [simulaciones]
      simulaciones = []
    } catch(err) {
      console.log(err)
    }
  }

  agregarPunto(){
    const len = this.simulaciones.length
    const simulacion: simulacionPE[] = this.simulaciones[len -1]
    this.simulaciones = [...this.simulaciones,simulacion]

  }

  openCromatografia() {
    const dialogRef = this.dialog.open(CromatografiaComponent, {
      data: {
        proyectoId: this.proyecto.id,
      }
    })
  }
}
