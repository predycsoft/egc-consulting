import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { cromatografia, curva, curvaEquipo, DataServiceService, equipo, mapa, mapas, mezcla, outputTren, outputTrenAdim, outputTrenTeorico, Proyecto, pruebaCampo, puntoMapa, simSeccion, simulacionPE, simulacionTren, tren } from 'src/app/services/data-service.service';
import { ChartType } from 'angular-google-charts';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CromatografiaComponent } from '../inputs/cromatografia/cromatografia.component';
import { SimulacionService } from 'src/app/services/simulacion.service';

// interface seccion {
//   seccion: number,
//   seccionEquipo: number,
//   seccionGlobal: number
//   equipoTag: string,
// }

@Component({
  selector: 'app-simulacion-campo-input',
  templateUrl: './simulacion-campo-input.component.html',
  styleUrls: ['./simulacion-campo-input.component.css']
})
export class SimulacionCampoInputComponent implements OnInit {
  //numero de punto
  nPunto: number = 0

  proyecto: Proyecto;
  tren: tren;
  equipos: equipo[];
  curvas: curvaEquipo[]
  resumen: pruebaCampo = new pruebaCampo

  tipoComparacion: string = 'porcentual'
  simFlag: boolean = false;

  punto: simulacionTren = new simulacionTren
  simId: string = "";
  dataValidaAdim: boolean = false
  dataValidaTeorica: boolean = false
  seccionActual: number = -1
  array: Array<Array<any>> = []
  arrayComparacion: Array<Array<any>> = []
  arrayTren: Array<Array<any>> = []
  arrayTrenComparacion: Array<Array<any>> = []
  nSecciones: number = 0

  // Mapa:
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
  listaMapas:mapa[] = []


  constructor(
    private route: ActivatedRoute,
    private data: DataServiceService,
    private afs: AngularFirestore,
    private http: HttpClient,
    private dialogRef: MatDialogRef<SimulacionCampoInputComponent>,
    public dialog: MatDialog,
    private ss: SimulacionService,
    @Inject(MAT_DIALOG_DATA) public dataEnviada
  ) { }




  async ngOnInit() {
    // Get Proyecto
    this.listaMapas = this.dataEnviada.listaMapas
    console.log(this.listaMapas)
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
        let conteoSecciones = 0
        for (let i = 0; i < this.equipos.length; i++) {
          for (let j = 0; j < this.equipos[i].nSecciones; j++) {
            conteoSecciones++
          }
        }
        this.nSecciones = conteoSecciones
        const docIndice = await this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
          .collection("trenes").doc(this.dataEnviada.trenTag)
          .collection("indices-campo").doc("indice-campo").ref.get()
        let indice = docIndice.data()
        let listaIndice: pruebaCampo[] = Object.values(indice)
        listaIndice.sort((a, b) => +a.simTimestamp - +b.simTimestamp)
        this.nPunto = listaIndice.findIndex(x => x.simTimestamp == this.dataEnviada.simTimestamp) + 1
        // Get punto de simulacion
        if (this.dataEnviada.simId) {
          // Caso de simulación existente o preexistente en el indice
          if (this.dataEnviada.simId == "nuevo") {
            const punto = indice[this.dataEnviada.simTimestamp]
            this.resumen = punto
            this.punto = {
              simDate: punto.simDate,
              simId: punto.simTimestamp,
              simTipo: punto.simTipo,
              simTimestamp: punto.simTimestamp,
              simulacion: [],
              outputTren: new outputTren,
              mapaTrenReal: [],
              mapaTrenTeorico: []
            }
            this.punto.simulacion = await this.ss.armarNuevaSimPE(this.proyecto.id, this.tren, this.resumen, this.equipos, "indice")
            let utc = +new Date().getTimezoneOffset()*60*1000
            console.log("utc", utc)
            this.punto.simDate = new Date(this.punto.simTimestamp/10000 - utc).toISOString().slice(0,16)
            console.log(this.punto)
          } else {
            const docSim = await this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId)
              .collection("trenes").doc(this.dataEnviada.trenTag)
              .collection<simulacionTren>("simulaciones-campo").doc(this.dataEnviada.simId).ref
              .get()
            this.punto = docSim.data()
            let utc = +new Date().getTimezoneOffset()*60*1000
            console.log("utc", utc)
            this.punto.simDate = new Date(this.punto.simTimestamp/10000 - utc).toISOString().slice(0,16)
            if (this.punto.simulacion[0].simulacionAdim == true) {
              this.simFlag = true
              this.armarArray()
            }
          }
          // Caso de nuevo punto
        } else {
          this.punto.simulacion = await this.ss.armarNuevaSimPE(this.proyecto.id, this.tren, this.resumen, this.equipos, "nuevo")
        }
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

  async simular() {
    console.log(this.punto)
    await this.simularAdim()
    await this.simularPE()
    this.armarArray()
    this.simFlag = true
  }

  async simularAdim() {
    this.punto = await this.ss.simularAdim(this.proyecto.id, this.tren.tag, this.punto)
    return this.punto
  }

  async simularPE() {
    this.punto = await this.ss.simularPE(this.proyecto.id, this.tren.tag, this.punto)
    this.punto = await this.ss.generarMapasPE(this.punto, this.equipos, this.proyecto.id, this.tren.tag)
    this.punto = await this.ss.generarMapasReal(this.punto, this.equipos, this.proyecto.id, this.tren.tag)
    return this.punto
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  graficaConjunta(tipoY: "presion" | "potencia" | "head" | "headisen" | "relcomp" | "TDES", tipoX: "FLUJOMMSCFD" | "FLUJODES" | "FLUJOMAS") {
    let mapas = []
    let columnas = []
    let opciones = []
    for (let index = 0; index < this.punto.simulacion.length; index++) {
      console.log("entre")
      mapas.push([])
      columnas.push([])
      columnas[index].push()
      console.log(this.punto.simulacion[index].seccion)
      const inputTeorico = this.listaMapas.find(x=> ((x.seccion == this.punto.simulacion[index].seccion) && (x.default == true) && (x.equipoTag == this.punto.simulacion[index].equipoTag)))
      console.log(inputTeorico)
      const modifiedTeorico = inputTeorico.puntos.reduce((res, curr) => {
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
            mapas[index].push([x, y, , , , , , , , , ,])
          if (j == 1)
            mapas[index].push([x, , y, , , , , , , , ,])
          if (j == 2)
            mapas[index].push([x, , , y, , , , , , , ,])
          if (j == 3)
            mapas[index].push([x, , , , y, , , , , , ,])
          if (j == 4)
            mapas[index].push([x, , , , , y, , , , , ,])
        }
      }

      //Añadido de parte real
      const inputReal = this.punto.simulacion[index].mapaPunto
      const modifiedReal = inputReal.reduce((res, curr) => {
        if (res[curr.RPM])
          res[curr.RPM].push(curr)
        else
          Object.assign(res, { [curr.RPM]: [curr] })
        return res
      }, {});
      for (let key in modifiedReal) {
        columnas[index].push(`RPM Real: ${(+key).toFixed(0)}`)

        for (let j = 0; j < modifiedReal[key].length; j++) {
          const values: puntoMapa = modifiedReal[key][j];
          let x = 0
          let y = 0
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
            mapas[index].push([x, , , , , , y, , , , ,])
          if (j == 1)
            mapas[index].push([x, , , , , , , y, , , ,])
          if (j == 2)
            mapas[index].push([x, , , , , , , , y, , ,])
          if (j == 3)
            mapas[index].push([x, , , , , , , , , y, ,])
          if (j == 4)
            mapas[index].push([x, , , , , , , , , , y,])
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
    this.graficaTrenConjunta(tipoY, tipoX)
  }

  graficaTrenConjunta(tipoY: "presion" | "potencia" | "head" | "headisen" | "relcomp" | "TDES", tipoX: "FLUJOMMSCFD" | "FLUJODES" | "FLUJOMAS") {
    let mapas = []
    let columnas = []
    let opciones;
    console.log("entre")
    columnas.push()
    const inputTeorico = this.punto.mapaTrenTeorico
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

    //Añadido de parte real
    const inputReal = this.punto.mapaTrenReal
    const modifiedReal = inputReal.reduce((res, curr) => {
      if (res[curr.RPM])
        res[curr.RPM].push(curr)
      else
        Object.assign(res, { [curr.RPM]: [curr] })
      return res
    }, {});
    for (let key in modifiedReal) {
      columnas.push(`RPM Real: ${(+key).toFixed(0)}`)

      for (let j = 0; j < modifiedReal[key].length; j++) {
        const values: outputTrenAdim = modifiedReal[key][j];
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
          mapas.push([x, , , , , , y, , , , ,])
        if (j == 1)
          mapas.push([x, , , , , , , y, , , ,])
        if (j == 2)
          mapas.push([x, , , , , , , , y, , ,])
        if (j == 3)
          mapas.push([x, , , , , , , , , y, ,])
        if (j == 4)
          mapas.push([x, , , , , , , , , , y,])
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


  armarArray() {
    let array: Array<Array<any>> = []
    let arrayTeorico: Array<Array<any>> = []
    let arrayComparacion: Array<Array<any>> = []
    let arrayTrenAdim: Array<Array<any>> = []
    let arrayTrenTeorico: Array<Array<any>> = []
    let arrayTrenComparacion: Array<Array<any>> = []
    if (this.seccionActual != -1) {
      let adim = this.punto.simulacion[this.seccionActual].outputAdim
      let teorica = this.punto.simulacion[this.seccionActual].outputTeorico

      // Array de variables de output adim
      array = [...array, ["Flujo Volumétrico [MMSSCFD]", (+adim.FLUJOMMSCFD).toFixed(2), (+adim.FLUJOMMSCFD).toFixed(2), (+adim.FLUJOMMSCFD).toFixed(2)]]
      array = [...array, ["Flujo Volumétrico [ACFM]", (+adim.FLUJOSUC).toFixed(2), (+adim.FLUJODES).toFixed(2), (+adim.FLUJOISEN).toFixed(2)]]
      array = [...array, ["Flujo Masico [lbm/min]", (+adim.FLUJOMAS).toFixed(2), (+adim.FLUJOMAS).toFixed(2), (+adim.FLUJOMAS).toFixed(2)]]
      array = [...array, ["Velocidad de Giro [RPM]", (+adim.RPM).toFixed(0), (+adim.RPM).toFixed(0), (+adim.RPM).toFixed(0)]]
      array = [...array, ["Presion [psig]", (+adim.PSUC).toFixed(2), (+adim.PDES).toFixed(2), (+adim.PISEN).toFixed(2)]]
      array = [...array, ["Temperatura [°F]", (+adim.TSUC).toFixed(2), (+adim.TDES).toFixed(2), (+adim.TISEN).toFixed(2)]]
      array = [...array, ["Volumen específico [pie³/lbm]", (+adim.VOLSUC).toFixed(2), (+adim.VOLDES).toFixed(2), (+adim.VOLISEN).toFixed(2)]]
      array = [...array, ["Densidad [lbm/pie³]", (+adim.DENSUC).toFixed(2), (+adim.DENDES).toFixed(2), (+adim.DENISEN).toFixed(2)]]
      array = [...array, ["Factor de compresión", (+adim.ZSUC).toFixed(2), (+adim.ZDES).toFixed(2), (+adim.ZISEN).toFixed(2)]]
      array = [...array, ["Entalpía [??]", (+adim.HSUC).toFixed(2), (+adim.HDES).toFixed(2), (+adim.HISEN).toFixed(2)]]
      array = [...array, ["Entropía [??]", (+adim.SSUC).toFixed(2), (+adim.SDES).toFixed(2), (+adim.SISEN).toFixed(2)]]
      array = [...array, ["Rel. de compresión", (+adim.RELCOMP).toFixed(2)]]
      array = [...array, ["Rel. de Volúmenes", (+adim.RELVOL).toFixed(2)]]
      array = [...array, ["Cabezal Politrópico", (+adim.HEADPOLI).toFixed(2)]]
      array = [...array, ["Cabezal Isentrópico ", (+adim.HEADISEN).toFixed(2)]]
      array = [...array, ["Potencia al Gas", (+adim.HPGAS).toFixed(2)]]
      array = [...array, ["Potencia al Freno", (+adim.HPFRENO).toFixed(2)]]
      array = [...array, ["Coef. de Cabezal Politrópico", (+adim.CFHEADPOLI).toFixed(2)]]
      array = [...array, ["Coef. de Cabezal Isentrópica", (+adim.CFHEADISEN).toFixed(2)]]
      array = [...array, ["Eficiencia Politrópica", (+adim.EFICPOLI).toFixed(2)]]
      array = [...array, ["Eficiencia Isentrópica", (+adim.EFICISEN).toFixed(2)]]
      array = [...array, ["Coef. de Cabezal Politropico", (+adim.CFHEADPOLI).toFixed(2)]]
      array = [...array, ["Coef. de Cabezal Isentrópica", (+adim.CFHEADISEN).toFixed(2)]]
      array = [...array, ["Coef. de Work Input Politrópico", (+adim.WORKPOLI).toFixed(2)]]
      array = [...array, ["Coef. de Work Input Isentrópica", (+adim.WORKISEN).toFixed(2)]]
      array = [...array, ["Coef. de Flujo Q/N", (+adim.QN).toFixed(2)]]
      array = [...array, ["Coef. de Flujo Φ", (+adim.PHI).toFixed(2)]]
      // srray e variables de output teorica
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

      // calculo
      for (let i = 0; i < array.length; i++) {
        if (array[i].length == 4) {
          arrayComparacion = [...arrayComparacion, [(+arrayTeorico[i][1] - +array[i][1]) * 100 / +arrayTeorico[i][1], (+arrayTeorico[i][2] - +array[i][2]) * 100 / +arrayTeorico[i][2], (+arrayTeorico[i][3] - +array[i][3]) * 100 / +arrayTeorico[i][3], +array[i][1] - +arrayTeorico[i][1], +array[i][2] - +arrayTeorico[i][2], +array[i][3] - +arrayTeorico[i][3], +arrayTeorico[i][1], +arrayTeorico[i][2], +arrayTeorico[i][3]]]
        }
        if (+array[i].length == 2) {
          arrayComparacion = [...arrayComparacion, [(+arrayTeorico[i][1] - +array[i][1]) * 100 / +arrayTeorico[i][1], +array[i][1] - +arrayTeorico[i][1], +arrayTeorico[i][1]]]
        }
      }
    } else {
      let trenAdim = this.punto.outputTren.outputAdim
      let trenTeorico = this.punto.outputTren.outputTeorico


      // Array de variables de output adim

      arrayTrenAdim = [...arrayTrenAdim, ["Flujo Volumétrico [ACFM]", (+trenAdim.FLUJOSUC).toFixed(2)]]
      arrayTrenAdim = [...arrayTrenAdim, ["Flujo Volumétrico [MMSCFD]", (+trenAdim.FLUJOMMSCFD).toFixed(2)]]
      arrayTrenAdim = [...arrayTrenAdim, ["Flujo Másico [lbm/min]", (+trenAdim.FLUJOMAS).toFixed(2)]]
      arrayTrenAdim = [...arrayTrenAdim, ["Velocidad de Giro [RPM]", (+trenAdim.RPM).toFixed(0)]]
      arrayTrenAdim = [...arrayTrenAdim, ["Presion Succion [psig]", (+trenAdim.PSUC).toFixed(2)]]
      arrayTrenAdim = [...arrayTrenAdim, ["Presion Descarga [psig]", (+trenAdim.PDES).toFixed(2)]]
      arrayTrenAdim = [...arrayTrenAdim, ["Rel. de compresión", (+trenAdim.RELCOMP).toFixed(2)]]
      arrayTrenAdim = [...arrayTrenAdim, ["Cabezal Politrópico", (+trenAdim.HEADPOLI).toFixed(2)]]
      arrayTrenAdim = [...arrayTrenAdim, ["Cabezal Isentrópico", (+trenAdim.HEADISEN).toFixed(2)]]
      arrayTrenAdim = [...arrayTrenAdim, ["Potencia al Gas", (+trenAdim.HPGAS).toFixed(2)]]
      arrayTrenAdim = [...arrayTrenAdim, ["Relación de compresión", (+trenAdim.RELCOMP).toFixed(2)]]
      arrayTrenAdim = [...arrayTrenAdim, ["Coef. de Flujo Q/N", (+trenAdim.QN).toFixed(2)]]
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

      // calculo
      for (let i = 0; i < arrayTrenAdim.length; i++) {
        if (arrayTrenAdim[i].length == 4) {
          arrayTrenComparacion = [...arrayTrenComparacion, [+arrayTrenAdim[i][1] / +arrayTrenTeorico[i][1], +arrayTrenAdim[i][2] / +arrayTrenTeorico[i][2], +arrayTrenAdim[i][3] / +arrayTrenTeorico[i][3], +arrayTrenAdim[i][1] - +arrayTrenTeorico[i][1], +arrayTrenAdim[i][2] - +arrayTrenTeorico[i][2], +arrayTrenAdim[i][3] - +arrayTrenTeorico[i][3], +arrayTrenTeorico[i][1], +arrayTrenTeorico[i][2], +arrayTrenTeorico[i][3]]]
        }
        if (+arrayTrenAdim[i].length == 2) {
          arrayTrenComparacion = [...arrayTrenComparacion, [+arrayTrenAdim[i][1] / +arrayTrenTeorico[i][1], +arrayTrenAdim[i][1] - +arrayTrenTeorico[i][1], +arrayTrenTeorico[i][1]]]
        }
      }
    }
    if (this.seccionActual == -1) {
      this.array = arrayTrenAdim
      this.arrayComparacion = arrayTrenComparacion
    } else {
      this.array = array
      this.arrayComparacion = arrayComparacion
    }
    this.graficaConjunta("presion", "FLUJODES")
    console.log(this.array)
    console.log(this.arrayComparacion)
  }

  aumentarSeccion() {
    this.seccionActual++
    this.armarArray()
  }

  disminuirSeccion() {
    this.seccionActual--
    this.armarArray()
  }

  borrarPunto() {
    this.ss.borrarPunto(this.proyecto.id, this.tren.tag, this.punto.simTimestamp.toString(), this.resumen)
    this.dialogRef.close()
  }
}