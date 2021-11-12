import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { curva, curvaEquipo, DataServiceService, equipo, Proyecto, simulacionPE, tren } from 'src/app/services/data-service.service';
import { ChartType } from 'angular-google-charts';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CromatografiaComponent } from '../inputs/cromatografia/cromatografia.component';

class simInfo {
  simId: string = "";
  simDate: Date = new Date;
  simTipo: string = "";
}

// CLASES PARA INDICE
class pruebaCampo {
  simDate: Date = new Date;
  simTipo: string = '';
  simCurvas: string = '';
  simSecciones: simSeccion[] = []
  simId: string = '';
}

class simSeccion {
  equipoTag: string = '';
  numSeccion: number = 0;
  numCompresor: number = 0;
  FLUJO: number = 0;
  PSUC: number = 0;
  PDES: number = 0;
  TSUC: number = 0;
  TDES: number = 0;
  HP: number = 0;
  QN: number = 0;
  CFHEAD: number = 0;
  EFIC: number = 0;
}

@Component({
  selector: 'app-simulacion-campo-input',
  templateUrl: './simulacion-campo-input.component.html',
  styleUrls: ['./simulacion-campo-input.component.css']
})
export class SimulacionCampoInputComponent implements OnInit {
  proyecto: Proyecto;
  tren: tren;
  equipos: equipo[];
  curvas: curvaEquipo[]
  resumen: pruebaCampo = new pruebaCampo

  simulacion: Array<simulacionPE> = [];
  simId: string = "";
  simInfo: simInfo = new simInfo;

  constructor(
    private route: ActivatedRoute,
    private data: DataServiceService,
    private afs: AngularFirestore,
    private http: HttpClient,
    private dialogRef: MatDialogRef<SimulacionCampoInputComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataEnviada
  ) { }




  async ngOnInit() {
    // Get Proyecto
    const docProyecto = await this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId).ref.get()
    this.proyecto = docProyecto.data() as Proyecto
    // Get Tren
    const docTren = await this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
      .collection("trenes").doc(this.dataEnviada.trenTag).ref.get()
    this.tren = docTren.data() as tren
    let tags = []
    for (let index = 0; index < this.tren.equipos.length; index++) {
      const element = this.tren.equipos[index];
      tags.push(element.tag)
    }
    // Get Equipos
    this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
      .collection<equipo>("equipos").valueChanges().subscribe(async equipos => {
        this.equipos = []
        this.equipos = equipos.filter(x => tags.includes(x.tag))
        // Get punto de simulacion
        if (this.dataEnviada.simId) {
          const docSim = await this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
            .collection("trenes").doc(this.dataEnviada.trenTag)
            .collection("simulaciones-campo").doc(this.dataEnviada.simId).ref
            .get()
          this.simulacion = docSim.data()["simulacion"]
          this.simInfo.simDate = docSim.data()["simDate"]
          this.simInfo.simId = docSim.data()["simId"]
          this.simInfo.simTipo = docSim.data()["simTipo"]
        } else {
          this.armarNuevaSim()
        }
      })
  }

  async armarNuevaSim() {
    try {
      let simulaciones: simulacionPE[] = []
      this.simulacion = []
      for (let i = 0; i < this.equipos.length; i++) {
        let curvas = []
        const curvasDocs = await this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipos[i].tag).collection("curvas").ref.get();
        for (let j = 0; j < curvasDocs.docs.length; j++) {
          const curva = curvasDocs.docs[j].data() as curva;
          if (curva.equivalente == true) {
            curvas.push(curva)
          }
        }
        for (let sec = 1; sec < this.equipos[i].nSecciones + 1; sec++) {
          const simulacion = new simulacionPE()
          simulacion.equipoTag = this.equipos[i].tag
          simulacion.equipoFamilia = this.equipos[i].familia
          simulacion.seccion = sec
          simulacion.curvas = curvas.filter(x => x.numSeccion == sec)
          simulacion.curva = simulacion.curvas.find(x => x.default == true)
          simulacion.inputs.DDIM = this.tren.dimensiones.diametro
          simulacion.inputs.PDIM = this.tren.dimensiones.presion
          simulacion.inputs.QDIM = this.tren.dimensiones.flujo
          simulacion.inputs.TDIM = this.tren.dimensiones.temperatura
          simulaciones.push(simulacion)
        }
        curvas = []
      }
      this.simulacion = simulaciones
      simulaciones = []
    } catch (err) {
      console.log(err)
    }
  }

  openCromatografia(i) {
    const dialogRef = this.dialog.open(CromatografiaComponent, {
      data: {
        proyectoId: this.proyecto.id,
      }
    })
    dialogRef.afterClosed().subscribe((result => {
      if (result) {
        this.simulacion[i].inputs.Mezcla = result
      }
    }))
  }

  simularAdim() {
    this.simInfo.simTipo = "R"
  }

  simularPE() {
    this.simInfo.simTipo = "R+T"
  }

  guardarPunto() {
    // Guardado en el documento
    if (this.simInfo.simId != "") {
      this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
        .collection("trenes").doc(this.dataEnviada.trenTag)
        .collection("simulaciones-campo").doc(this.simInfo.simId)
        .set({
          simulacion: JSON.parse(JSON.stringify(this.simulacion)),
          simDate: this.simInfo.simDate,
          simId: this.simInfo.simId,
          simTipo: this.simInfo.simTipo
        })
    } else {
      const docRef = this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
        .collection("trenes").doc(this.dataEnviada.trenTag)
        .collection("simulaciones-campo").doc(this.simInfo.simId)
      this.simInfo.simId = docRef.ref.id
      docRef.set({
        simulacion: JSON.parse(JSON.stringify(this.simulacion)),
        simDate: this.simInfo.simDate,
        simId: this.simInfo.simId,
        simTipo: this.simInfo.simTipo
      })
    }
    // Guardado en el indice:
    this.resumen.simId = this.simInfo.simId;
    this.resumen.simDate = this.simInfo.simDate;
    this.resumen.simCurvas = "";
    this.resumen.simTipo = this.simInfo.simTipo
    let simSecciones = []
    let numCompresor = 1
    for (let index = 0; index < this.simulacion.length; index++) {
      const element = this.simulacion[index];
      if (index > 0 && this.simulacion[index].equipoTag != this.simulacion[index - 1].equipoTag) {
        numCompresor++
      }
      const sim: simSeccion = {
        equipoTag: element.equipoTag,
        numCompresor: numCompresor,
        numSeccion: element.seccion,
        FLUJO: element.inputs.FLUJO,
        PSUC: element.inputs.PSUC,
        PDES: element.inputs.PDES,
        TSUC: element.inputs.TSUC,
        TDES: element.inputs.TDES,
        HP: element.outputAdim.HP,
        QN: element.outputAdim.qn,
        CFHEAD: element.outputAdim.CFHEAD,
        EFIC: element.outputAdim.EFIC,
      }
      simSecciones.push(sim)
    }
    this.resumen.simSecciones = simSecciones
    this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
      .collection("trenes").doc(this.dataEnviada.trenTag)
      .collection("indices-campo").doc("indice-campo").set({
        [this.simInfo.simId]: JSON.parse(JSON.stringify(this.resumen))
      })
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

}
