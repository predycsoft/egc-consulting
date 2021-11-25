import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'angular-google-charts';
import { cromatografia, curva, curvaEquipo, DataServiceService, equipo, Proyecto, puntoMapa, simulacionTeorica, simulacionTrenTeorica, tren } from 'src/app/services/data-service.service';
import { DimensionesService } from 'src/app/services/dimensiones.service';
import { SimulacionService } from 'src/app/services/simulacion.service';
import { CromatografiaComponent } from '../inputs/cromatografia/cromatografia.component';

@Component({
  selector: 'app-simulacion-teorica',
  templateUrl: './simulacion-teorica.component.html',
  styleUrls: ['./simulacion-teorica.component.css']
})
export class SimulacionTeoricaComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, public data: DataServiceService, private afs: AngularFirestore, public dialog: MatDialog, private ss: SimulacionService, private dim: DimensionesService) { }

  proyecto: Proyecto;
  tren: tren = new tren();
  equipos: equipo[];
  curvas: curvaEquipo[]
  punto: simulacionTrenTeorica;


  F: number = 0
  C: number = 0
  K: number = 0
  cambiando = "";
  mezclas: cromatografia[] = []
  envio = []
  pruebaId;


  // Variables para gráficas de mapas
  mostrarGrafica: boolean = false
  opciones: any[] = []
  mapas: Array<Array<Array<number>>> = [];
  columnas: Array<Array<any>> = [];
  type = ChartType.LineChart
  width = 390;
  height = 290;

  async ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.route.params.subscribe(params => {
          const trenTag = params.trenTag;
          this.pruebaId = params.idPrueba
          this.data.getTren(this.proyecto.id, trenTag).subscribe(tren => {
            this.tren = tren
            let tag = []
            for (let index = 0; index < this.tren.equipos.length; index++) {
              const element = this.tren.equipos[index];
              tag.push(element.tag)
            }
            this.data.getEquipos(this.proyecto.id, trenTag).subscribe(async equipos => {
              this.equipos = []
              this.equipos = equipos.filter(x => tag.includes(x.tag))
              await this.cargarSimulacion()
            })
          })
        })
      })
    })
  }

  armarGrafica(tipo) {
    let mapas = []
    let columnas = []
    let opciones = []
    for (let index = 0; index < this.punto.simulacion.length; index++) {
      console.log("entre")
      mapas.push([])
      columnas.push([])
      columnas[index].push()
      const input = this.punto.simulacion[index].mapas
      const modified = input.reduce((res, curr) => {
        if (res[curr.RPM])
          res[curr.RPM].push(curr)
        else
          Object.assign(res, { [curr.RPM]: [curr] })
        return res
      }, {});
      console.log(modified)
      columnas[index] = ["Q"]
      for (let key in modified) {
        columnas[index].push(`RPM: ${(+key).toFixed(0)}`)
        if (tipo == "presion"){
          for (let j = 0; j < modified[key].length; j++) {
            const values: puntoMapa = modified[key][j];
            if (j == 0)
              mapas[index].push([+values.FLUJODES, +values.PDES,,,,,])
            if (j == 1)
              mapas[index].push([+values.FLUJODES, , +values.PDES,,,,])
            if (j == 2)
              mapas[index].push([+values.FLUJODES, , , +values.PDES,,,])
            if (j == 3)
              mapas[index].push([+values.FLUJODES, , , , +values.PDES,,])
            if (j == 4)
              mapas[index].push([+values.FLUJODES, , , , , +values.PDES,])
          }
        }
        if (tipo == "potencia"){
          for (let j = 0; j < modified[key].length; j++) {
            const values: puntoMapa = modified[key][j];
            if (j == 0)
              mapas[index].push([+values.FLUJODES, +values.HPGAS,,,,,])
            if (j == 1)
              mapas[index].push([+values.FLUJODES, , +values.HPGAS,,,,])
            if (j == 2)
              mapas[index].push([+values.FLUJODES, , , +values.HPGAS,,,])
            if (j == 3)
              mapas[index].push([+values.FLUJODES, , , , +values.HPGAS,,])
            if (j == 4)
              mapas[index].push([+values.FLUJODES, , , , , +values.HPGAS,])
          }
        }
        if(tipo == "eficiencia"){
          for (let j = 0; j < modified[key].length; j++) {
            const values: puntoMapa = modified[key][j];
            if (j == 0)
              mapas[index].push([+values.FLUJODES, +values.EFICPOLI,,,,,])
            if (j == 1)
              mapas[index].push([+values.FLUJODES, , +values.EFICPOLI,,,,])
            if (j == 2)
              mapas[index].push([+values.FLUJODES, , , +values.EFICPOLI,,,])
            if (j == 3)
              mapas[index].push([+values.FLUJODES, , , , +values.EFICPOLI,,])
            if (j == 4)
              mapas[index].push([+values.FLUJODES, , , , , +values.EFICPOLI,])
          }
        }
      }
      opciones[index] = {
        interpolateNulls: true,
        chartArea: { top: 30, bottom: 66, left: 60, right: 18, backgroundColor: 'transparent' },
        height: this.height,
        width: this.width,
        hAxis: {
          title: 'FLUJO [ACFM]',
          titleTextStyle: { italic: false, fontSize: 13, fontName: 'Roboto' },
          viewWindowMode: 'explicit',
          // viewWindow: { max: maxx, min: minx },
          minorGridlines: { interval: 0.005 }
        },
        vAxis: {
          title: 'Presion de Descarga [psig]',
          titleTextStyle: { italic: false, fontSize: 13, fontName: 'Roboto', },
          minorGridlines: { interval: 0.005 }
        },
        legend: { position: 'bottom', alignment: 'center' },
      };
      if(tipo == "presion"){
        opciones[index].vAxis.title = "Presion de Descarga [psig]"
      }
      if(tipo == "eficiencia"){
        opciones[index].vAxis.title = "Eficiencia"
      }
      if(tipo == "potencia"){
        opciones[index].vAxis.title = "Potencia (HP)"
      }
    }
    this.mapas = mapas
    this.columnas = columnas
    this.opciones = opciones
    this.mostrarGrafica = true
  }

  async simular() {
    console.log(this.punto)
    this.punto = await this.ss.simularTeorica(this.punto)
    this.armarGrafica("potencia")
  }

  generarMapas() {
    console.log("simulando mapa")
    let envio = []
    envio.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
      "TSUC", "PSUC", "FLUJO", "diametro", "RPM", "CC0", "CC1", "CC2", "CC3", "EXPOCP", "CE0", "CE1", "CE2", "CE3", "EXPOCE", "SURGE", "STONEW", "DDIM", "TDIM", "PDIM", "QDIM"])
    for (let index = 0; index < this.punto.simulacion.length; index++) {
      const sim = this.punto.simulacion[index];
      let TSUC = +sim.outputTeorico.TSUC
      let PSUC = +sim.outputTeorico.PSUC
      let rpmDiseno = this.equipos[sim.equipo-1].rpmDiseno[sim.seccion-1]
      if (rpmDiseno == 0){
        alert("no se ha configurado una RPM de diseno")
      }
      envio.push([+sim.inputs.Mezcla.cromatografiaNormalizada.metano, +sim.inputs.Mezcla.cromatografiaNormalizada.etano, +sim.inputs.Mezcla.cromatografiaNormalizada.propano, sim.inputs.Mezcla.cromatografiaNormalizada.iButano, sim.inputs.Mezcla.cromatografiaNormalizada.nButano, sim.inputs.Mezcla.cromatografiaNormalizada.iPentano, sim.inputs.Mezcla.cromatografiaNormalizada.nPentano, sim.inputs.Mezcla.cromatografiaNormalizada.hexano, sim.inputs.Mezcla.cromatografiaNormalizada.heptano, sim.inputs.Mezcla.cromatografiaNormalizada.octano, sim.inputs.Mezcla.cromatografiaNormalizada.nonano, sim.inputs.Mezcla.cromatografiaNormalizada.decano, sim.inputs.Mezcla.cromatografiaNormalizada.nitrogeno, sim.inputs.Mezcla.cromatografiaNormalizada.dioxCarbono, sim.inputs.Mezcla.cromatografiaNormalizada.sulfHidrogeno,
      TSUC, PSUC, 0, sim.curva.diametro, rpmDiseno, sim.curva.cc0, sim.curva.cc1, sim.curva.cc2, sim.curva.cc3, sim.curva.expocc, sim.curva.ce0, sim.curva.ce1, sim.curva.ce2, sim.curva.ce3, sim.curva.expoce, sim.curva.limSurge, sim.curva.limStw, "[pulg]", "[°F]", "[psig]", "[MMSCFD]"])
    }
    this.http.post("http://127.0.0.1:5000/generarMapaTeorico/", JSON.stringify(envio)).subscribe((respuesta) => {
      console.log(respuesta)
      let OUTPUT: Array<Array<any>> = []
      if (respuesta) {
        OUTPUT = respuesta as Array<Array<any>>
        let sec = -1 // Inicializacion de la seccion
        let puntos = []
        for (let index = 0; index < OUTPUT[0].length; index++) {
          if (OUTPUT[0][index] == "RPM") {
            if (sec >= 0) {
              this.punto.simulacion[sec].mapas = puntos
              puntos = []
            }
            sec++
          } else {
            const obj: puntoMapa = {
              RPM: OUTPUT[0][index],
              QN: OUTPUT[1][index],
              TDES: OUTPUT[2][index],
              PDES: OUTPUT[3][index],
              HPGAS: OUTPUT[4][index],
              FLUJODES: OUTPUT[5][index],
              EFICPOLI: OUTPUT[6][index],
              CFHEADPOLI: OUTPUT[7][index],
              CFWORKPOLI: OUTPUT[8][index],
              HEADPOLI: OUTPUT[9][index],
              PSUC: OUTPUT[10][index],
              HEADISEN: OUTPUT[11][index],
              FLUJOMMSCFD: OUTPUT[12][index],
              FLUJOMAS: OUTPUT[13][index]
            }
            puntos.push(obj)
          }
          if (index == OUTPUT[0].length - 1) {
            this.punto.simulacion[sec].mapas = puntos
          }
        }
      }
    })

  }

  async guardarSimulacion() {
    await this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(this.tren.tag)
      .collection("simulaciones-teoricas").doc(this.pruebaId).update({
        nombre: this.punto.nombre,
        id: this.punto.nombre,
        simTimestamp: this.punto.simTimestamp,
        simulacion: JSON.parse(JSON.stringify(this.punto.simulacion))
      })
  }

  openCromatografia(i) {
    const dialogRef = this.dialog.open(CromatografiaComponent, {
      data: {
        proyectoId: this.proyecto.id,
      }
    })
    dialogRef.afterClosed().subscribe((result => {
      if (result) {
        this.punto.simulacion[i].inputs.Mezcla = result
      }
    }))
  }

  async cargarSimulacion() {
    const sims = await this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(this.tren.tag).collection("simulaciones-teoricas").doc(this.pruebaId).ref.get()
    this.punto = sims.data() as simulacionTrenTeorica
    if (this.punto.simulacion.length == 0) {
      this.punto = await this.ss.armarNuevaSimTeorica(this.punto,this.equipos,this.proyecto.id,this.tren)
    } else {
      this.actualizarCurvas()
      this.actualizarRPMS()
      let mapas = 0
      for (let index = 0; index < this.punto.simulacion.length; index++) {
        const element = this.punto.simulacion[index];
        if (element.mapas.length > 0){
          mapas++
        }
      }
      if(mapas == this.punto.simulacion.length){
        this.armarGrafica("potencia")
      }
    }
  }

  async actualizarCurvas() {
    for (let i = 0; i < this.equipos.length; i++) {
      let curvas: curva[] = []
      const curvasDocs = await this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipos[i].tag).collection("curvas").ref.get();
      for (let j = 0; j < curvasDocs.docs.length; j++) {
        const curva = curvasDocs.docs[j].data() as curva;
        if (curva.equivalente == true) {
          curvas.push(curva)
        }
      }
      for (let sec = 1; sec < this.equipos[i].nSecciones + 1; sec++) {
        this.punto.simulacion[sec].curvas = curvas.filter(x => x.numSeccion == sec)
      }
      curvas = []
    }
  }

  cambioCurva(i: number, curva: curva) {
    console.log("entre")
    this.punto.simulacion[i].curva = curva
  }

  actualizarRPMS() {
    for (let index = 0; index < this.punto.simulacion.length; index++) {
      if (index > 0) {
        this.punto.simulacion[index].inputs.RPM = this.punto.simulacion[0].inputs.RPM * this.punto.simulacion[index].inputs.RELVEL
      }
    }
  }
}
