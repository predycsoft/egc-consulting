import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { curva, DataServiceService, equipo, Proyecto } from 'src/app/services/data-service.service';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-simulacion-campo-input',
  templateUrl: './simulacion-campo-input.component.html',
  styleUrls: ['./simulacion-campo-input.component.css']
})
export class SimulacionCampoInputComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private data: DataServiceService,
    private afs: AngularFirestore,
    private http: HttpClient,
  ) { }

  proyecto: Proyecto;
  equipo: equipo;
  nSecciones: number;
  secciones: Array<number>
  curvas: curva[];
  impulsoresEq: curva[];
  impulsores: curva[];
  curva: curva;
  seccionActual: number;
  filteredImpulsores
  filteredImpulsoresEq
  flagEqFab
  flagEqPsico
  date = new Date

  PSUC
  TSUC
  RPMS = [0,0,0,0,0]
  qdim
  tdim
  pdim
  ddim

  //Tabla
  mostrarTabla = false
  dataSets;

   ///////////////// Grafica //////////////////////
  // Data para el plot
  yData: Array<Array<number>> = [];
  // options
  type = ChartType.LineChart
  mostrarGrafica = false
  columns
  options;
  width = 390;
  height = 290;


  // envio de data
  url = "http://127.0.0.1:5000/generarMapa/"
  envio: Array<Array<any>>;

  ngOnInit(): void {
    console.log(this.date.getDay())
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.route.params.subscribe(params => {
          const trenTag = params.trenTag;
          const equipoTag = params.equipoTag;
          this.data.obtenerEquipo(this.proyecto.id, equipoTag).subscribe((equipo) => {
            this.equipo = equipo
            console.log("equipo tag" + this.equipo.tag)
            this.nSecciones = this.equipo.nSecciones
            this.secciones = Array(this.nSecciones).fill(0).map((x, i) => i + 1); // [0,1,2,3,4]
            this.cargarImpulsores();
          })
        })
      })
    })
  }

  cargarImpulsores() {
    this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipo.tag).collection<curva>("curvas").valueChanges().subscribe(curvas => {
      this.curvas = curvas
      this.impulsoresEq = []
      this.impulsores = []
      for (let index = 0; index < this.curvas.length; index++) {
        const curva: curva = curvas[index];
        if (curva.equivalente == true) {
          this.impulsoresEq = this.impulsoresEq.concat(curva)
        } else {
          this.impulsores = this.impulsores.concat(curva)
        }
      }
      this.filterImpulsores()
    })
  }

  filterImpulsores() {
    console.log("entre")
    this.filteredImpulsores = this.impulsores.filter(x => x.numSeccion == this.seccionActual).sort((a, b) => +a.numImpulsor - +b.numImpulsor)
    this.filteredImpulsoresEq = this.impulsoresEq.filter(x => x.numSeccion == this.seccionActual)
    this.flagEqFab = false
    this.flagEqPsico = false
    this.filteredImpulsoresEq.forEach(impulsor => {
      if (impulsor.fab == true) {
        this.flagEqFab = true;
      }
      if (impulsor.fab == false) {
        this.flagEqPsico = true;
      }
    })
  }

  generarMapa() {
    this.envio = []
    this.envio.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno", 
    "TSUC", "PSUC","RPM","CP1","CP2","CP3","CP4","EXPOCP","CE1","CE2","CE3","CE4","EXPOCE","SURGE","STONEW","DIAM","DDIM","TDIM","PDIM","QDIM"])
    for (let index = 0; index < this.RPMS.length; index++) {
      const RPM = this.RPMS[index];
      this.envio.push([0.480000, 0.066000, 0.040100, 0.005000, 0.018000, 0.005000, 0.006500, 0.007400, 0.000000, 0.000000, 0.000000, 0.000000, 0.330000, 0.021000, 0.021000,
      this.TSUC,this.PSUC, RPM, this.curva.cp1,this.curva.cp2,this.curva.cp3,this.curva.cp4,this.curva.expocp,this.curva.ce1,this.curva.ce2,this.curva.ce3,this.curva.ce4,this.curva.expoce,this.curva.limSurge,this.curva.limStw,this.curva.diametro,"[pulg]",this.tdim, this.pdim,"[MMSCFD]"])
    }
    console.log(this.envio)
    this.http.post(this.url, JSON.stringify(this.envio)).subscribe((res) => {
      if (res) {
        console.log(res)
        this.mostrarTabla = true
        this.dataSets = res
        this.verGrafica()
      }
    })
  }

  verGrafica() {
    this.yData = []
    let flagCambioRPM = 0
    let RPMS = []
    for (let i = 1; i < this.dataSets[0].length; i++) {
      const Q = this.dataSets[5][i]
      const Pot = +this.dataSets[4][i]
      if (this.dataSets[0][i] != this.dataSets[0][i-1]) {
        RPMS.push(this.dataSets[0][i])
        flagCambioRPM++
      }
      if (flagCambioRPM == 1) {
        this.yData = [...this.yData,[+Q,+Pot,,,,,]]
      }
      if (flagCambioRPM == 2) {
        this.yData = [...this.yData,[+Q,,+Pot,,,,]]
      }
      if (flagCambioRPM == 3) {
        this.yData = [...this.yData,[+Q,,,+Pot,,,]]
      }
      if (flagCambioRPM == 4) {
        this.yData = [...this.yData,[+Q,,,,+Pot,,]]
      }
      if (flagCambioRPM == 5) {
        this.yData = [...this.yData,[+Q,,,,,+Pot]]
      }
    }
    this.columns = ["Q",RPMS[0],RPMS[1],RPMS[2],RPMS[3],RPMS[4]]
    console.log(this.yData)
    this.options = {
      interpolateNulls: true,
      chartArea: { top: 30, bottom: 66, left: 60, right: 18, backgroundColor: 'transparent' },
      height: this.height,
      width: this.width,
      hAxis: {
        title: 'Q/N',
        titleTextStyle: { italic: false, fontSize: 13, fontName: 'Roboto' },
        viewWindowMode: 'explicit',
        minorGridlines: { interval: 0.005 }
      },
      vAxis: {
        title: 'Coeficiente μ',
        titleTextStyle: { italic: false, fontSize: 13, fontName: 'Roboto', },
        minorGridlines: { interval: 0.005 }
      },
      legend: { position: 'bottom', alignment: 'center' },
    };
    this.mostrarGrafica = true
  }

  customTrackBy(index: number, obj: any): any {
    return index;
}

}
