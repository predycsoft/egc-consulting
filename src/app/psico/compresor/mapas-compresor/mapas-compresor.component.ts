import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'angular-google-charts';
import { cromatografia, curva, curvaEquipo, DataServiceService, equipo, mapa, mezcla, Proyecto, puntoMapa, simulacionTeorica, simulacionTrenTeorica, tren } from 'src/app/services/data-service.service';
import { DialogService } from 'src/app/services/dialog.service';
import { SimulacionService } from 'src/app/services/simulacion.service';
import { CromatografiaComponent } from '../../inputs/cromatografia/cromatografia.component';
import { DialogMapaCompresorComponent } from '../dialog-mapa-compresor/dialog-mapa-compresor.component';

interface dataSet {
  punto: number;
  valX: number;
  valY: number;
}

// En el front:
// 1: Se selecciona la seccion -> se filtra la data segun el numero de la sección
// 2: Se muestran los mapas asociados a esa sección
// 3: Se muestra la data del mapa seleccionado


@Component({
  selector: 'mapas-compresor',
  templateUrl: './mapas-compresor.component.html',
  styleUrls: ['./mapas-compresor.component.css']
})
export class MapasCompresorComponent implements OnInit {

  seccionActual: number = 1;
  verMapa: boolean = false;
  listaMapas: mapa[] = []
  listaMapasFiltrados: mapa[] = []
  mostrarGrafica: boolean = false

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private data: DataServiceService,
    private afs: AngularFirestore,
    public dialogService: DialogService,
    private ss: SimulacionService,
  ) { }

  proyecto: Proyecto
  equipo: equipo
  nSecciones: number = 0
  secciones: number[]
  tren: tren;
  curvas: curva[]
  filteredCurvas: curva[]
  mapa: mapa = new mapa

  //Grafica
  dataGrafica: Array<Array<number>>
  columnas: Array<any>
  opciones
  width = 300
  height =  300
  type = ChartType.LineChart

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.route.params.subscribe(async params => {
          const trenTag = params.trenTag;
          const trenDoc = await this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(trenTag).ref.get()
          this.tren = trenDoc.data() as tren
          const equipoTag = params.equipoTag;
          this.data.obtenerEquipo(this.proyecto.id, equipoTag).subscribe((equipo) => {
            this.equipo = equipo
            console.log("equipo tag" + this.equipo.tag)
            this.nSecciones = this.equipo.nSecciones
            this.secciones = Array(this.nSecciones).fill(0).map((x, i) => i + 1); // [0,1,2,3,4]
            this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipo.tag).collection<mapa>("mapas").valueChanges().subscribe(mapas => {
              this.listaMapas = mapas
              this.listaMapasFiltrados = this.listaMapas.filter(x => x.seccion == this.seccionActual  )
              console.log(this.listaMapas)
              console.log(this.listaMapasFiltrados)
              this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipo.tag).collection<curva>("curvas").valueChanges().subscribe(curvas => {
                this.curvas = curvas
                this.filtrarCurvas()
              })
            })
          })
        })
      })
    })
  }

  configurarMapa() {
    const dialogRef = this.dialog.open(DialogMapaCompresorComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  filterMapas() {
    this.listaMapasFiltrados = this.listaMapas.filter(x => x.seccion == this.seccionActual)
  }

  filtrarCurvas() {
    this.filteredCurvas = this.curvas.filter(x => x.numSeccion == this.seccionActual)
    this.mapa.curva = this.filteredCurvas.find(x => x.default == true)
  }

  visualizar() {
    this.verMapa = true
  }

  agregarMapa(nombre: string, seccion: number) {
    let mapa = {
      id: "",
      nombre: "",
      puntos: [],
      rpmDiseno: 0,
      rpms: [0, 0, 0, 0, 0],
      seccion: 0,
      valido: false
    }
    const docRef = this.afs.collection("proyectos").doc(this.proyecto.id).collection("trenes").doc(this.equipo.tag).collection("mapas").doc()
    mapa = {
      id: docRef.ref.id,
      nombre: nombre,
      puntos: [],
      rpmDiseno: this.equipo.rpmDiseno[seccion - 1],
      rpms: [0, 0, 0, 0, 0],
      seccion: seccion,
      valido: false
    }
  }

  crearNuevoMapa() {
    this.mapa = new mapa
    this.mapa.seccion = this.seccionActual
    this.mapa.equipoTag = this.equipo.tag
    this.mapa.rpmDiseno = this.equipo.rpmDiseno[this.seccionActual - 1]
    this.mapa.rpms[0] = this.mapa.rpmDiseno * 0.7
    this.mapa.rpms[1] = this.mapa.rpmDiseno * 0.8
    this.mapa.rpms[2] = this.mapa.rpmDiseno * 0.9
    this.mapa.rpms[3] = this.mapa.rpmDiseno
    this.mapa.rpms[4] = this.mapa.rpmDiseno * 1.05
    this.visualizar()
  }

  validarMapa() {
    if (this.mapa.nombre != "") {
      if (this.mapa.puntos.length > 0) {
        if (this.mapa.rpmDiseno != 0) {
          if (!this.mapa.rpms.includes(0)) {
            if (this.mapa.seccion > 0) {
              this.mapa.valido = true
              return true
            } else {
              this.dialogService.dialogComentario("La seccion no es válida")
              return false
            }
          } else {
            this.dialogService.dialogComentario("Las rpms a simular no son válidas")
            return false
          }
        } else {
          this.dialogService.dialogComentario("La rpm de diseño no es válida")
          return false
        }
      } else {
        this.dialogService.dialogComentario("No ha simulado el mapa")
        return false
      }
    } else {
      this.dialogService.dialogComentario("Ingrese un nombre para el mapa")
      return false
    }

  }

  guardarMapa() {
    let docRef;
    if(this.mapa.id != ""){
      docRef = this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipo.tag).collection("mapas").doc(this.mapa.id)
      docRef.set(JSON.parse(JSON.stringify(this.mapa)))
    } else {
      docRef = this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipo.tag).collection("mapas").doc()
      this.mapa.id = docRef.ref.id
    }
    docRef.set(JSON.parse(JSON.stringify(this.mapa)))
  }

  async generarMapa() {
    const simulacion: simulacionTeorica = new simulacionTeorica
    simulacion.curva = this.mapa.curva
    simulacion.equipo = 1
    simulacion.seccion = 1
    simulacion.inputs = {
      TSUC: this.mapa.inputs.TSUC,
      PSUC: this.mapa.inputs.PSUC,
      RPM: this.mapa.rpmDiseno,
      FLUJOSUC: this.mapa.inputs.FLUJO,
      RELVEL: 1,
      QEXT: 0,
      CAIPRES: 0,
      Mezcla: this.mapa.inputs.Mezcla,
      TDIM: this.tren.dimensiones.temperatura,
      QDIM: this.tren.dimensiones.flujo,
      PDIM: this.tren.dimensiones.presion,
      DDIM: this.tren.dimensiones.diametro,
    }
    let punto: simulacionTrenTeorica = new simulacionTrenTeorica()
    punto.simulacion = [simulacion]
    punto = await this.ss.generarMapaTeorico(punto, [this.equipo])
    this.mapa.puntos = punto.simulacion[0].mapas
    this.grafica("presion","FLUJODES")
  }

  seleccionarMapa(i){
    this.mapa = this.listaMapasFiltrados[i]
    this.visualizar()
    this.grafica("presion","FLUJODES")
  }

  openCromatografia() {
    const dialogRef = this.dialog.open(CromatografiaComponent, {
      data: {
        proyectoId: this.proyecto.id
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mapa.inputs.Mezcla = result
      }
    })
  }

  grafica(tipoY: "presion" | "potencia" | "head" | "headisen" | "relcomp" | "TDES", tipoX: "FLUJOMMSCFD" | "FLUJODES" | "FLUJOMAS") {
    let mapas = []
    let columnas = []
    const inputTeorico = this.mapa.puntos
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
      columnas.push(`RPM: ${(+key).toFixed(0)}`)
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
          mapas.push([x, y, , , , ,])
        if (j == 1)
          mapas.push([x, , y, , , ,])
        if (j == 2)
          mapas.push([x, , , y, , ,])
        if (j == 3)
          mapas.push([x, , , , y, ,])
        if (j == 4)
          mapas.push([x, , , , , y])
      }
    }

    this.opciones = {
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
      this.opciones.hAxis.title = "Flujo Estándar [MMSCFD]"
    }
    if (tipoX == "FLUJODES") {
      this.opciones.hAxis.title = "Flujo Real [ACFM]"
    }
    if (tipoX == "FLUJOMAS") {
      this.opciones.hAxis.title = "Flujo Másico [lbm/min]"
    }
    if (tipoY == "presion") {
      this.opciones.vAxis.title = "Presion de Descarga [psig]"
    }
    if (tipoY == "potencia") {
      this.opciones.vAxis.title = "Potencia [HP]"
    }
    if (tipoY == "head") {
      this.opciones.vAxis.title = "Head [pulg]"
    }
    if (tipoY == "headisen") {
      this.opciones.vAxis.title = "Head Isentrópico [pulg]"
    }
    if (tipoY == "relcomp") {
      this.opciones.vAxis.title = "Relacion de Compresión"
    }
    if (tipoY == "TDES") {
      this.opciones.vAxis.title = "Temperatura de descarga [°F]"
    }

    this.dataGrafica = mapas
    this.columnas = columnas
    this.mostrarGrafica = true
  }

}
