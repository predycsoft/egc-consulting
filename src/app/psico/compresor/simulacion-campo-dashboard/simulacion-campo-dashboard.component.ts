import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'angular-google-charts';
import { equipo, pruebaCampo, simulacionTren, tren } from 'src/app/services/data-service.service';

class param {
  nombre: string = '';
  var: string = '';
  max: number = null;
  min: number = null;
}

@Component({
  selector: 'simulacion-campo-dashboard',
  templateUrl: './simulacion-campo-dashboard.component.html',
  styleUrls: ['./simulacion-campo-dashboard.component.css']
})
export class SimulacionCampoDashboardComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
  ) { }

  proyectoId: string = ""
  tren: tren
  equipos: equipo[] = []
  simulaciones: pruebaCampo[] = []
  array: Array<Array<Array<any>>> = []

  // Mapa por secciones:
  // Variables para gráficas de mapas
  tipoY: "PDES" | "HEADPOLI" | "HEADISEN" | "RELCOMP" | "HPGAS" | "TDES" = "PDES"
  mostrarGrafica: boolean = false
  opciones: any[] = []
  data: Array<Array<Array<number>>> = [];
  columnas: Array<Array<any>> = [];
  type = ChartType.LineChart
  // Variables de histograma
  dataHistograma: Array<Array<Array<number>>> = [];
  typeHistogram = ChartType.Histogram
  opcionesHistograma: any[] = []
  columnasHistograma: Array<Array<any>> = [];
  width = 390;
  height = 290;
  n_secciones

  // Mapa del tren:
  // Variables para gráficas de mapas
  mostrarGraficaTren: boolean = false
  opcionesTren: any[] = []
  dataTren: Array<Array<number>> = [];
  columnasTren: Array<any> = [];
  // Variables de histograma
  dataHistogramaTren: Array<Array<number>> = [];
  opcionesHistogramaTren: any
  columnasHistogramaTren: Array<any> = [];

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.proyectoId = params.id
      this.route.params.subscribe(async params => {
        const docTren = await this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(params.trenTag).ref.get()
        this.tren = docTren.data() as tren
        let tags = []
        for (let index = 0; index < this.tren.equipos.length; index++) {
          const element = this.tren.equipos[index];
          tags.push(element.tag)
        }
        // Get Equipos
        this.afs.collection("proyectos").doc(this.proyectoId)
          .collection<equipo>("equipos").valueChanges().subscribe(async equipos => {
            this.equipos = []
            this.equipos = equipos.filter(x => tags.includes(x.tag))
          })
        this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.tren.tag).collection("indices-campo").doc("indice-campo").valueChanges().subscribe(simulaciones => {
          let array: Array<pruebaCampo> = Object.values(simulaciones)
          this.simulaciones = array.filter(x => x.simTipo == "R+T")
          console.log(this.simulaciones)
          this.graficarSecciones("PDES")
        })
      })
    })
  }

  graficarSecciones(tipo: "PDES" | "HEADPOLI" | "HEADISEN" | "RELCOMP" | "HPGAS" | "TDES") {
    let data: Array<Array<Array<any>>> = [];
    let dataHistograma: Array<Array<Array<any>>> = [];
    let columnas: Array<Array<string>> = []
    let opciones = []
    let columnasHistograma: Array<Array<string>> = []
    let opcionesHistograma = []
    this.n_secciones = this.simulaciones[0].simSecciones.length
    for (let seccion = 0; seccion < this.n_secciones; seccion++) {
      data.push([])
      columnas.push([])
      opciones.push([])
      dataHistograma.push([])
      columnasHistograma.push([])
      opcionesHistograma.push([])
      columnas[seccion] = ["Timestamp", "Presion"]
      columnasHistograma[seccion] = ["N° de punto", "Presion"]
      this.simulaciones.sort((a, b) => +a.simTimestamp - +b.simTimestamp)
      for (let index = 0; index < this.simulaciones.length; index++) {
        const simulacion = this.simulaciones[index];
        let x = new Date(simulacion.simTimestamp / 10000);
        let y = 0
        if (tipo == "PDES") { y = +simulacion.simSecciones[seccion].PDES }
        if (tipo == "HEADPOLI") { y = +simulacion.simSecciones[seccion].HEADPOLI }
        if (tipo == "HEADISEN") { y = +simulacion.simSecciones[seccion].HEADISEN }
        if (tipo == "RELCOMP") { y = +simulacion.simSecciones[seccion].PDES / +simulacion.simSecciones[seccion].PSUC }
        if (tipo == "HPGAS") { y = +simulacion.simSecciones[seccion].HPGAS }
        if (tipo == "TDES") { y = +simulacion.simSecciones[seccion].TDES }
        data[seccion].push([x, y])
        dataHistograma[seccion].push([index.toString(), y])
      }
      // PERSONALIZACIÓN DE GRAFICA EN TIEMPO
      opciones[seccion] = {
        interpolateNulls: true,
        chartArea: { top: 30, bottom: 66, left: 60, right: 18, backgroundColor: 'transparent' },
        height: this.height,
        width: this.width,
        hAxis: {
          title: 'Fecha y hora',
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
      // PERSONALIZACIÓN DE HISTOGRAMA
      opcionesHistograma[seccion] = {
      }
      if (tipo == "PDES") { opciones[seccion].vAxis.title = `Presión de descarga ${this.tren.dimensiones.presion}` }
      if (tipo == "HEADPOLI") { opciones[seccion].vAxis.title = `Head Politrópico` }
      if (tipo == "HEADISEN") { opciones[seccion].vAxis.title = `Head Isentrópico` }
      if (tipo == "RELCOMP") { opciones[seccion].vAxis.title = `Relación de compresión` }
      if (tipo == "HPGAS") { opciones[seccion].vAxis.title = `Potencia del gas Hp` }
      if (tipo == "TDES") { opciones[seccion].vAxis.title = `Temperatura de descarga ${this.tren.dimensiones.temperatura}` }
    }
    this.data = data
    this.dataHistograma = dataHistograma
    this.columnas = columnas
    this.opciones = opciones
    this.columnasHistograma = columnas
    this.opcionesHistograma = opcionesHistograma
    this.mostrarGrafica = true
    console.log(data)
    if(tipo != "TDES"){
      this.graficarTren(tipo)
    } else {
      this.mostrarGraficaTren = false
    }
  }

  graficarTren(tipo: "PDES" | "HEADPOLI" | "HEADISEN" | "RELCOMP" | "HPGAS") {
    let data: Array<Array<any>> = []
    let columnas = ["Timestamp", "Presion"]
    let opciones;
    let dataHistograma: Array<Array<any>> = []
    let columnasHistograma = ["N° de punto", "Presion"]
    let opcionesHistograma;
    this.simulaciones.sort((a, b) => +a.simTimestamp - +b.simTimestamp)
    for (let index = 0; index < this.simulaciones.length; index++) {
      const simulacion = this.simulaciones[index];
      let x = new Date(simulacion.simTimestamp / 10000);
      let y = 0
      if (tipo == "PDES") { y = +simulacion.simTren.PDES }
      if (tipo == "HEADPOLI") { y = +simulacion.simTren.HEADPOLI }
      if (tipo == "HEADISEN") { y = +simulacion.simTren.HEADISEN }
      if (tipo == "RELCOMP") { y = +simulacion.simTren.PDES / +simulacion.simTren.PSUC }
      if (tipo == "HPGAS") { y = +simulacion.simTren.HPGAS }
      data.push([x, y])
      dataHistograma.push([index.toString(), y])
    }
    // PERSONALIZACIÓN DE GRAFICA EN TIEMPO
    opciones = {
      interpolateNulls: true,
      chartArea: { top: 30, bottom: 66, left: 60, right: 18, backgroundColor: 'transparent' },
      height: this.height,
      width: this.width,
      hAxis: {
        title: 'Fecha y hora',
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
    // PERSONALIZACIÓN DE HISTOGRAMA
    opcionesHistograma = {
    }
    if (tipo == "PDES") { opciones.vAxis.title = `Presión de descarga ${this.tren.dimensiones.presion}` }
    if (tipo == "HEADPOLI") { opciones.vAxis.title = `Head Politrópico` }
    if (tipo == "HEADISEN") { opciones.vAxis.title = `Head Isentrópico` }
    if (tipo == "RELCOMP") { opciones.vAxis.title = `Relación de compresión` }
    if (tipo == "HPGAS") { opciones.vAxis.title = `Potencia del gas Hp` }

    this.dataTren = data
    this.dataHistogramaTren = dataHistograma
    this.columnasTren = columnas
    this.opcionesTren = opciones
    this.columnasHistogramaTren = columnasHistograma
    this.opcionesHistogramaTren = opcionesHistograma
    this.mostrarGraficaTren = true
    console.log(this.dataTren)
    console.log(this.columnasTren)
  }

  // title = 'Age vs Weight';
  // type = ChartType.ScatterChart
  // data = [
  //    [8,12],
  //    [4, 5.5],
  //    [11,14],
  //    [4,5],
  //    [3,3.5],
  //    [6.5,7]
  // ];
  // columnNames = ['Age', 'Weight'];
  // options = {   
  // };
  // width = 550;
  // height = 400;

  // actualMin;
  // actualMax;
  // selectedParam;
  // iParam;
  // params: param[] = []
  // // params = new param()

  // agregarDataBlock(){
  //   const nuevo = new param()
  //   this.params = this.params.concat(nuevo)
  // }

  // clickParam(param, i){
  //   this.selectedParam = param  
  //   this.iParam = i
  //   this.actualMin = this.params[this.iParam].min 
  //   this.actualMax = this.params[this.iParam].max 
  // }

  // aplicarFiltro($event: any) {
  //   $event.stopPropagation();
  //   //Another instructions
  //   this.params[this.iParam].min = this.actualMin;
  //   this.params[this.iParam].max = this.actualMax;
  // }

  // borrarFiltro($event: any) {
  //   $event.stopPropagation();
  //   //Another instructions
  //   this.params[this.iParam].min = null;
  //   this.params[this.iParam].max = null;
  //   this.actualMin = null;
  //   this.actualMax = null;
  // }
}
