import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'angular-google-charts';
import { cromatografia, curva, curvaEquipo, DataServiceService, equipo, outputTrenTeorico, Proyecto, puntoMapa, simulacionTeorica, simulacionTrenTeorica, tren } from 'src/app/services/data-service.service';
import { DimensionesService } from 'src/app/services/dimensiones.service';
import { SimulacionService } from 'src/app/services/simulacion.service';
import { CromatografiaComponent } from '../inputs/cromatografia/cromatografia.component';

@Component({
  selector: 'app-simulacion-teorica',
  templateUrl: './simulacion-teorica.component.html',
  styleUrls: ['./simulacion-teorica.component.css']
})
export class SimulacionTeoricaComponent implements OnInit {

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    public data: DataServiceService,
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private ss: SimulacionService,
    private dim: DimensionesService,
    private dialogRef: MatDialogRef<SimulacionTeoricaComponent>,
    @Inject(MAT_DIALOG_DATA) public dataEnviada,
  ) { }

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
  seccionActual: number = -1
  nSecciones: number = 0
  
  tipoComparacion: string = 'porcentual'
  simFlag: boolean = false;

  array: Array<Array<any>> = []
  // Variables para gráficas de mapas
  mostrarGrafica: boolean = false
  opciones: any[] = []
  mapas: Array<Array<Array<number>>> = [];
  columnas: Array<Array<any>> = [];
  type = ChartType.LineChart
  width = 390;
  height = 290;

  // Variables para gráficas de mapas
  mostrarGraficaReal: boolean = false
  opcionesReal: any[] = []
  mapasReal: Array<Array<Array<number>>> = [];
  columnasReal: Array<Array<any>> = [];

  // Variables conjuntas
  tipoGrafica: "presion" | "potencia" | "head" | "headisen" | "relcomp" | "TDES" = "presion"
  tipoEjeX: "FLUJOMMSCFD" | "FLUJODES" | "FLUJOMAS" = "FLUJODES"
  mostrarGraficaConjunta: boolean = false
  opcionesConjunta: any[] = []
  mapasConjunto: Array<Array<Array<number>>> = [];
  columnasConjuntas: Array<Array<any>> = [];

  // Grafica para tren:
  mapasConjuntoTren: Array<Array<number>> = []
  columnasConjuntasTren: Array<any> = []
  opcionesConjuntaTren
  mostrarGraficaConjuntaTren: boolean = false

  async ngOnInit() {

    this.data.obtenerProyecto(this.dataEnviada.proyectoId).subscribe(data => {
      this.proyecto = data;

      this.pruebaId = this.dataEnviada.simId
      this.data.getTren(this.proyecto.id, this.dataEnviada.trenTag).subscribe(tren => {
        this.tren = tren
        let tag = []
        for (let index = 0; index < this.tren.equipos.length; index++) {
          const element = this.tren.equipos[index];
          tag.push(element.tag)
        }
        this.data.getEquipos(this.proyecto.id, this.dataEnviada.trenTag).subscribe(async equipos => {
          this.equipos = []
          this.equipos = equipos.filter(x => tag.includes(x.tag))
          let nSecciones = 0
          for (let index = 0; index < this.equipos.length; index++) {
            nSecciones += this.equipos[index].nSecciones
          }
          this.nSecciones = nSecciones
          await this.cargarSimulacion()
        })
      })

    })
  }

  aumentarSeccion() {
    this.seccionActual++
    this.armarArray()
  }

  disminuirSeccion() {
    this.seccionActual--
    this.armarArray()
  }

  async simular() {
    console.log(this.punto)
    this.punto = await this.ss.simularTeorica(this.punto)
    console.log(this.punto)
    this.punto = await this.ss.generarMapaTeorico(this.punto, this.equipos)
    await this.guardarSimulacion()
    this.grafica("potencia","FLUJODES")
    this.simFlag = true
  }

  async guardarSimulacion() {
    await this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(this.tren.tag)
      .collection("simulaciones-teoricas").doc(this.pruebaId).update({
        ...JSON.parse(JSON.stringify(this.punto))
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
      this.punto = await this.ss.armarNuevaSimTeorica(this.punto, this.equipos, this.proyecto.id, this.tren)
    } else {
      this.actualizarCurvas()
      this.actualizarRPMS()
      this.simFlag = true
      let mapas = 0
      for (let index = 0; index < this.punto.simulacion.length; index++) {
        const element = this.punto.simulacion[index];
        if (element.mapas.length > 0) {
          mapas++
        }
      }
      if (mapas == this.punto.simulacion.length) {
        this.grafica("potencia","FLUJODES")
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

  armarArray() {
    let arrayTeorico: Array<Array<any>> = []
    let arrayTrenTeorico: Array<Array<any>> = []
    if (this.seccionActual != -1) {
      let teorica = this.punto.simulacion[this.seccionActual].outputTeorico
      arrayTeorico = [...arrayTeorico, ["Flujo Volumétrico [MMSSCFD]", (+teorica.FLUJOMMSCFD).toFixed(2), (+teorica.FLUJOMMSCFD).toFixed(2), (+teorica.FLUJOMMSCFD).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Flujo Volumétrico [ACFM]", (+teorica.FLUJOSUC).toFixed(2), (+teorica.FLUJODES).toFixed(2), (+teorica.FLUJOISEN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Flujo Masico [lbm/min]", (+teorica.FLUJOMAS).toFixed(2), (+teorica.FLUJOMAS).toFixed(2), (+teorica.FLUJOMAS).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Velocidad de Giro [RPM]", (+teorica.RPM).toFixed(0), (+teorica.RPM).toFixed(0), (+teorica.RPM).toFixed(0)]]
      arrayTeorico = [...arrayTeorico, ["Presion [psig]", (+teorica.PSUC).toFixed(2), (+teorica.PDES).toFixed(2), (+teorica.PISEN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Temperatura [°F]", (+teorica.TSUC).toFixed(2), (+teorica.TDES).toFixed(2), (+teorica.TISEN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Volumen específico [pie³/lbm]", (+teorica.VOLSUC).toFixed(2), (+teorica.VOLDES).toFixed(2), (+teorica.VOLISEN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Densidad [lbm/pie³]", (+teorica.DENSUC).toFixed(2), (+teorica.DENDES).toFixed(2), (+teorica.DENISEN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Factor de compresión", (+teorica.ZSUC).toFixed(2), (+teorica.ZDES).toFixed(2), (+teorica.ZISEN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Entalpía [??]", (+teorica.HSUC).toFixed(2), (+teorica.HDES).toFixed(2), (+teorica.HISEN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Entropía [??]", (+teorica.SSUC).toFixed(2), (+teorica.SDES).toFixed(2), (+teorica.SISEN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Rel. de compresión", (+teorica.RELCOMP).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Rel. de Volúmenes", (+teorica.RELVOL).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Cabezal Politrópico", (+teorica.HEADPOLI).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Cabezal Isentrópico ", (+teorica.HEADISEN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Potencia al Gas", (+teorica.HPGAS).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Potencia al Freno", (+teorica.HPFRENO).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Coef. de Cabezal Politrópico", (+teorica.CFHEADPOLI).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Coef. de Cabezal Isentrópica", (+teorica.CFHEADISEN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Eficiencia Politrópica", (+teorica.EFICPOLI).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Eficiencia Isentrópica", (+teorica.EFICISEN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Coef. de Cabezal Politropico", (+teorica.CFHEADPOLI).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Coef. de Cabezal Isentrópica", (+teorica.CFHEADISEN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Coef. de Work Input Politrópico", (+teorica.WORKPOLI).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Coef. de Work Input Isentrópica", (+teorica.WORKISEN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Coef. de Flujo Q/N", (+teorica.QN).toFixed(2)]]
      arrayTeorico = [...arrayTeorico, ["Coef. de Flujo Φ", (+teorica.PHI).toFixed(2)]]
      this.array = arrayTeorico
    } else {
      let trenTeorico = this.punto.outputTren
      // srray e variables de output teorica
      arrayTrenTeorico = [...arrayTrenTeorico, ["Flujo Volumétrico [ACFM]", (+trenTeorico.FLUJOSUC).toFixed(2)]]
      arrayTrenTeorico = [...arrayTrenTeorico, ["Flujo Volumétrico [MMSCFD]", (+trenTeorico.FLUJOMMSCFD).toFixed(2)]]
      arrayTrenTeorico = [...arrayTrenTeorico, ["Flujo Másico [lbm/min]", (+trenTeorico.FLUJOMAS).toFixed(2)]]
      arrayTrenTeorico = [...arrayTrenTeorico, ["Velocidad de Giro [RPM]", (+trenTeorico.RPM).toFixed(0)]]
      arrayTrenTeorico = [...arrayTrenTeorico, ["Presion Succion [psig]", (+trenTeorico.PSUC).toFixed(2)]]
      arrayTrenTeorico = [...arrayTrenTeorico, ["Presion Descarga [psig]", (+trenTeorico.PDES).toFixed(2)]]
      arrayTrenTeorico = [...arrayTrenTeorico, ["Rel. de compresión", (+trenTeorico.RELCOMP).toFixed(2)]]
      arrayTrenTeorico = [...arrayTrenTeorico, ["Cabezal Politrópico", (+trenTeorico.HEADPOLI).toFixed(2)]]
      arrayTrenTeorico = [...arrayTrenTeorico, ["Cabezal Isentrópico", (+trenTeorico.HEADISEN).toFixed(2)]]
      arrayTrenTeorico = [...arrayTrenTeorico, ["Potencia al Gas", (+trenTeorico.HPGAS).toFixed(2)]]
      arrayTrenTeorico = [...arrayTrenTeorico, ["Relación de compresión", (+trenTeorico.RELCOMP).toFixed(2)]]
      arrayTrenTeorico = [...arrayTrenTeorico, ["Coef. de Flujo Q/N", (+trenTeorico.QN).toFixed(2)]]
      this.array = arrayTrenTeorico
    }

  }

  graficaTren(tipoY: "presion" | "potencia" | "head" | "headisen" | "relcomp" | "TDES", tipoX: "FLUJOMMSCFD" | "FLUJODES" | "FLUJOMAS") {
    let mapas = []
    let columnas = []
    let opciones;
    console.log("entre")
    columnas.push()
    const inputTeorico = this.punto.mapaTren
    const modifiedTeorico = inputTeorico.reduce((res, curr) => {
      if (res[curr.RPM])
        res[curr.RPM].push(curr)
      else
        Object.assign(res, { [curr.RPM]: [curr] })
      return res
    }, {});
    console.log(modifiedTeorico)
    columnas = ["Q"]
    for (let key in modifiedTeorico) {
      columnas.push(`RPM Teorico: ${(+key).toFixed(0)}`)
      for (let j = 0; j < modifiedTeorico[key].length; j++) {
        const values: outputTrenTeorico = modifiedTeorico[key][j];
        let x = 0
        let y = 0
        if (tipoX == "FLUJOMMSCFD") { x = +values.FLUJOMMSCFD }
        if (tipoX == "FLUJODES") { x = +values.FLUJOSUC }
        if (tipoX == "FLUJOMAS") { x = +values.FLUJOMAS }
        if (tipoY == "presion") { y = +values.PDES }
        if (tipoY == "potencia") { y = +values.HPGAS }
        if (tipoY == "head") { y = +values.HEADPOLI }
        if (tipoY == "headisen") { y = +values.HEADISEN }
        if (tipoY == "relcomp") { y = +values.PDES / +values.PSUC }
        if (j == 0)
          mapas.push([x, y, , , , , , , , , ,])
        if (j == 1)
          mapas.push([x, , y, , , , , , , , ,])
        if (j == 2)
          mapas.push([x, , , y, , , , , , , ,])
        if (j == 3)
          mapas.push([x, , , , y, , , , , , ,])
        if (j == 4)
          mapas.push([x, , , , , y, , , , , ,])
      }
    }

    opciones = {
      interpolateNulls: true,
      chartArea: { top: 30, bottom: 66, left: 60, right: 18, backgroundColor: 'transparent' },
      height: this.height,
      width: this.width,
      series: {
        0: {
          enableInteractivity: false,
          color: "#D3D3D3"
        },
        1: {
          enableInteractivity: false,
          color: "#D3D3D3"
        },
        2: {
          enableInteractivity: false,
          color: "#D3D3D3"
        },
        3: {
          enableInteractivity: false,
          color: "#D3D3D3"
        },
        4: {
          enableInteractivity: false,
          color: "#D3D3D3"
        },
        5: {
          enableInteractivity: false,
          color: "#005fb8"
        },
        6: {
          enableInteractivity: false,
          color: "#005fb8"
        },
        7: {
          enableInteractivity: false,
          color: "#005fb8"
        },
        8: {
          enableInteractivity: false,
          color: "#005fb8"
        },
        9: {
          enableInteractivity: false,
          color: "#005fb8"
        }
      },
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
    if (tipoX == "FLUJOMMSCFD") {
      opciones.hAxis.title = "Flujo Estándar [MMSCFD]"
    }
    if (tipoX == "FLUJODES") {
      opciones.hAxis.title = "Flujo Real [ACFM]"
    }
    if (tipoX == "FLUJOMAS") {
      opciones.hAxis.title = "Flujo Másico [lbm/min]"
    }
    if (tipoY == "presion") {
      opciones.vAxis.title = "Presion de Descarga [psig]"
    }
    if (tipoY == "potencia") {
      opciones.vAxis.title = "Potencia [HP]"
    }
    if (tipoY == "head") {
      opciones.vAxis.title = "Head [pulg]"
    }
    if (tipoY == "headisen") {
      opciones.vAxis.title = "Head Isentrópico [pulg]"
    }
    if (tipoY == "relcomp") {
      opciones.vAxis.title = "Relacion de Compresión"
    }
    if (tipoY == "TDES") {
      opciones.vAxis.title = "Temperatura de descarga [°F]"
    }

    this.mapasConjuntoTren = mapas
    this.columnasConjuntasTren = columnas
    this.opcionesConjuntaTren = opciones
    this.mostrarGraficaConjuntaTren = true
  }

  grafica(tipoY: "presion" | "potencia" | "head" | "headisen" | "relcomp" | "TDES", tipoX: "FLUJOMMSCFD" | "FLUJODES" | "FLUJOMAS") {
    let mapas = []
    let columnas = []
    let opciones = []
    for (let index = 0; index < this.punto.simulacion.length; index++) {
      console.log("entre")
      mapas.push([])
      columnas.push([])
      columnas[index].push()
      const inputTeorico = this.punto.simulacion[index].mapas
      const modifiedTeorico = inputTeorico.reduce((res, curr) => {
        if (res[curr.RPM])
          res[curr.RPM].push(curr)
        else
          Object.assign(res, { [curr.RPM]: [curr] })
        return res
      }, {});
      console.log(modifiedTeorico)
      columnas[index] = ["Q"]
      for (let key in modifiedTeorico) {
        columnas[index].push(`RPM Teorico: ${(+key).toFixed(0)}`)
        for (let j = 0; j < modifiedTeorico[key].length; j++) {
          const values: puntoMapa = modifiedTeorico[key][j];
          let x = 0
          let y = 0
          x = +values.FLUJODES
          if (tipoX == "FLUJOMMSCFD") { x = +values.FLUJOMMSCFD }
          if (tipoX == "FLUJODES") { x = +values.FLUJODES }
          if (tipoX == "FLUJOMAS") { x = +values.FLUJOMAS }
          if (tipoY == "presion") { y = +values.PDES }
          if (tipoY == "potencia") { y = +values.HPGAS }
          if (tipoY == "head") { y = +values.HEADPOLI }
          if (tipoY == "headisen") { y = +values.HEADISEN }
          if (tipoY == "relcomp") { y = +values.PDES / +values.PSUC }
          if (tipoY == "TDES") { y = +values.TDES }
          if (j == 0)
            mapas[index].push([x, y, , , , ,])
          if (j == 1)
            mapas[index].push([x, , y, , , ,])
          if (j == 2)
            mapas[index].push([x, , , y, , ,])
          if (j == 3)
            mapas[index].push([x, , , , y, ,])
          if (j == 4)
            mapas[index].push([x, , , , , y])
        }
      }

      opciones[index] = {
        interpolateNulls: true,
        chartArea: { top: 30, bottom: 66, left: 60, right: 18, backgroundColor: 'transparent' },
        height: this.height,
        width: this.width,
        series: {
          0: {
            enableInteractivity: false,
            color: "#D3D3D3"
          },
          1: {
            enableInteractivity: false,
            color: "#D3D3D3"
          },
          2: {
            enableInteractivity: false,
            color: "#D3D3D3"
          },
          3: {
            enableInteractivity: false,
            color: "#D3D3D3"
          },
          4: {
            enableInteractivity: false,
            color: "#D3D3D3"
          },
          5: {
            enableInteractivity: false,
            color: "#005fb8"
          },
          6: {
            enableInteractivity: false,
            color: "#005fb8"
          },
          7: {
            enableInteractivity: false,
            color: "#005fb8"
          },
          8: {
            enableInteractivity: false,
            color: "#005fb8"
          },
          9: {
            enableInteractivity: false,
            color: "#005fb8"
          }
        },
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
      if (tipoX == "FLUJOMMSCFD") {
        opciones[index].hAxis.title = "Flujo Estándar [MMSCFD]"
      }
      if (tipoX == "FLUJODES") {
        opciones[index].hAxis.title = "Flujo Real [ACFM]"
      }
      if (tipoX == "FLUJOMAS") {
        opciones[index].hAxis.title = "Flujo Másico [lbm/min]"
      }
      if (tipoY == "presion") {
        opciones[index].vAxis.title = "Presion de Descarga [psig]"
      }
      if (tipoY == "potencia") {
        opciones[index].vAxis.title = "Potencia [HP]"
      }
      if (tipoY == "head") {
        opciones[index].vAxis.title = "Head [pulg]"
      }
      if (tipoY == "headisen") {
        opciones[index].vAxis.title = "Head Isentrópico [pulg]"
      }
      if (tipoY == "relcomp") {
        opciones[index].vAxis.title = "Relacion de Compresión"
      }
      if (tipoY == "TDES") {
        opciones[index].vAxis.title = "Temperatura de descarga [°F]"
      }
    }
    this.mapasConjunto = mapas
    this.columnasConjuntas = columnas
    this.opcionesConjunta = opciones
    this.mostrarGraficaConjunta = true
    this.graficaTren(tipoY, tipoX)
  }

  async borrarPunto(){
    await this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(this.tren.tag).collection("simulaciones-teoricas").doc(this.punto.simId).delete()
    this.dialogRef.close()
  }
}
