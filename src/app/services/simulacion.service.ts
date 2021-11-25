import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { cromatografia, curva, equipo, mezcla, outputTrenAdim, outputTrenTeorico, pruebaCampo, puntoMapa, simSeccion, simulacionPE, simulacionTeorica, simulacionTren, simulacionTrenTeorica, tren } from './data-service.service';
import * as firebase from 'firebase/app';
import { take } from 'rxjs/operators';
import { DimensionesService } from './dimensiones.service';

@Injectable({
  providedIn: 'root'
})
export class SimulacionService {

  constructor(private http: HttpClient, private afs: AngularFirestore, private dim: DimensionesService) { }

  /////////////////////////////////////////////////// ADIMENSIONAL ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async simularAdim(proyectoId: string, trenTag: string, simulacionTren: simulacionTren) {
    console.log("entre a simular Adim")
    let simulacion = simulacionTren.simulacion
    // Chequeo de variables para adim
    let seccionesValidas = 0
    for (let index = 0; index < simulacion.length; index++) {
      simulacion[index] = this.checkValidoAdim(simulacion[index]);
      if (simulacion[index].dataValidaAdim == true) {
        seccionesValidas++
      }
    }
    if (seccionesValidas == simulacion.length) {
      // Rutina una vez que se ha validado
      // Armado de la data de envio
      let envio = []
      envio.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
        "Diametro", "TSUC", "PSUC", "TDES", "PDES", "FLUJO", "RPM", "DDIM", "TDIM", "PDIM", "QDIM"])
      for (let j = 0; j < simulacion.length; j++) {
        const sim = simulacion[j]
        let TSUC = this.dim.transformarTemperatura(+sim.inputs.TSUC, sim.inputs.TDIM, "[°F]")
        let TDES = this.dim.transformarTemperatura(+sim.inputs.TDES, sim.inputs.TDIM, "[°F]")
        let PSUC = this.dim.transformarPresion(+sim.inputs.PSUC, sim.inputs.PDIM, "[psig]")
        let PDES = this.dim.transformarPresion(+sim.inputs.PDES, sim.inputs.PDIM, "[psig]")
        console.log(PSUC, PDES)
        envio.push([+sim.inputs.Mezcla.cromatografiaNormalizada.metano, +sim.inputs.Mezcla.cromatografiaNormalizada.etano, +sim.inputs.Mezcla.cromatografiaNormalizada.propano, sim.inputs.Mezcla.cromatografiaNormalizada.iButano, sim.inputs.Mezcla.cromatografiaNormalizada.nButano, sim.inputs.Mezcla.cromatografiaNormalizada.iPentano, sim.inputs.Mezcla.cromatografiaNormalizada.nPentano, sim.inputs.Mezcla.cromatografiaNormalizada.hexano, sim.inputs.Mezcla.cromatografiaNormalizada.heptano, sim.inputs.Mezcla.cromatografiaNormalizada.octano, sim.inputs.Mezcla.cromatografiaNormalizada.nonano, sim.inputs.Mezcla.cromatografiaNormalizada.decano, sim.inputs.Mezcla.cromatografiaNormalizada.nitrogeno, sim.inputs.Mezcla.cromatografiaNormalizada.dioxCarbono, sim.inputs.Mezcla.cromatografiaNormalizada.sulfHidrogeno,
        sim.curva.diametro, TSUC, PSUC, TDES, PDES, sim.inputs.FLUJOSUC, sim.inputs.RPM, sim.inputs.DDIM, "[°F]", "[psig]", sim.inputs.QDIM])
      }
      // Llamado a la rutina de adimensional en el servidor de python
      return new Promise<simulacionTren>(resolve => {
        this.http.post("http://127.0.0.1:5000/adimensional/", JSON.stringify(envio)).pipe(take(1)).subscribe(async (res) => {
          let OUTPUT: Array<Array<any>> = []
          if (res) {
            OUTPUT = res as []
            console.log("Respuesta de adimensional")
            console.log(res)
            let len = simulacion.length
            let trenHEADPOLI = 0
            let trenHEADISEN = 0
            let trenHPGAS = 0
            // Actualizacion de las variables de Output
            for (let index = 0; index < simulacion.length; index++) {
              simulacion[index].outputAdim.EFICPOLI = +OUTPUT[0][index + 1]
              simulacion[index].outputAdim.CFWORKPOLI = +OUTPUT[1][index + 1]
              simulacion[index].outputAdim.CFHEADPOLI = +OUTPUT[2][index + 1]
              simulacion[index].outputAdim.WORKPOLI = +OUTPUT[3][index + 1]
              simulacion[index].outputAdim.HPGAS = +OUTPUT[4][index + 1]
              simulacion[index].outputAdim.FLUJOMMSCFD = +OUTPUT[5][index + 1]
              simulacion[index].outputAdim.FLUJOSUC = +OUTPUT[6][index + 1]
              simulacion[index].outputAdim.FLUJODES = +OUTPUT[7][index + 1]
              simulacion[index].outputAdim.FLUJOISEN = +OUTPUT[8][index + 1]
              simulacion[index].outputAdim.FLUJOMAS = +OUTPUT[9][index + 1]
              simulacion[index].outputAdim.RPM = +OUTPUT[10][index + 1]
              simulacion[index].outputAdim.TSUC = +OUTPUT[11][index + 1]
              simulacion[index].outputAdim.TDES = +OUTPUT[12][index + 1]
              simulacion[index].outputAdim.TISEN = +OUTPUT[13][index + 1]
              simulacion[index].outputAdim.PSUC = +OUTPUT[14][index + 1]
              simulacion[index].outputAdim.PDES = +OUTPUT[15][index + 1]
              simulacion[index].outputAdim.PISEN = +OUTPUT[16][index + 1]
              simulacion[index].outputAdim.VOLSUC = +OUTPUT[17][index + 1]
              simulacion[index].outputAdim.VOLDES = +OUTPUT[18][index + 1]
              simulacion[index].outputAdim.VOLISEN = +OUTPUT[19][index + 1]
              simulacion[index].outputAdim.DENSUC = +OUTPUT[20][index + 1]
              simulacion[index].outputAdim.DENDES = +OUTPUT[21][index + 1]
              simulacion[index].outputAdim.DENISEN = +OUTPUT[22][index + 1]
              simulacion[index].outputAdim.ZSUC = +OUTPUT[23][index + 1]
              simulacion[index].outputAdim.ZDES = +OUTPUT[24][index + 1]
              simulacion[index].outputAdim.ZISEN = +OUTPUT[25][index + 1]
              simulacion[index].outputAdim.HSUC = +OUTPUT[26][index + 1]
              simulacion[index].outputAdim.HDES = +OUTPUT[27][index + 1]
              simulacion[index].outputAdim.HISEN = +OUTPUT[28][index + 1]
              simulacion[index].outputAdim.SSUC = +OUTPUT[29][index + 1]
              simulacion[index].outputAdim.SDES = +OUTPUT[30][index + 1]
              simulacion[index].outputAdim.SISEN = +OUTPUT[31][index + 1]
              simulacion[index].outputAdim.RELCOMP = +OUTPUT[32][index + 1]
              simulacion[index].outputAdim.RELVOL = +OUTPUT[33][index + 1]
              simulacion[index].outputAdim.HEADPOLI = +OUTPUT[34][index + 1]
              simulacion[index].outputAdim.HEADISEN = +OUTPUT[35][index + 1]
              simulacion[index].outputAdim.HPFRENO = +OUTPUT[36][index + 1]
              simulacion[index].outputAdim.CFHEADPOLI = +OUTPUT[37][index + 1]
              simulacion[index].outputAdim.CFHEADISEN = +OUTPUT[38][index + 1]
              simulacion[index].outputAdim.EFICISEN = +OUTPUT[39][index + 1]
              simulacion[index].outputAdim.CFWORKISEN = +OUTPUT[40][index + 1]
              simulacion[index].outputAdim.WORKISEN = +OUTPUT[41][index + 1]
              simulacion[index].outputAdim.QN = +OUTPUT[42][index + 1]
              simulacion[index].outputAdim.PHI = +OUTPUT[43][index + 1]
              simulacion[index].outputAdim.YWM = +OUTPUT[44][index + 1]
              simulacion[index].simulacionAdim = true
              trenHEADPOLI += simulacion[index].outputAdim.HEADPOLI
              trenHEADISEN += simulacion[index].outputAdim.HEADISEN
              trenHPGAS += simulacion[index].outputAdim.HPGAS
            }
            simulacionTren.outputTren.outputAdim = {
              PDES: +simulacion[len-1].outputAdim.PDES,
              HEADPOLI: +trenHEADPOLI,
              HEADISEN: +trenHEADISEN,
              RELCOMP: +simulacion[len-1].outputAdim.PDES / +simulacion[0].outputAdim.PSUC,
              HPGAS: +trenHPGAS,
              PSUC: +simulacion[0].outputAdim.PSUC,
              FLUJOSUC: +simulacion[0].outputAdim.FLUJOSUC,
              FLUJOMMSCFD: +simulacion[0].outputAdim.FLUJOMMSCFD,
              FLUJOMAS: +simulacion[0].outputAdim.FLUJOMAS,
              RPM: +simulacion[0].outputAdim.RPM,
              QN: +simulacion[0].outputAdim.QN,
            }

            simulacionTren.simulacion = simulacion
            simulacionTren.simTipo = "R"
            console.log(simulacionTren)
            await this.guardarPunto(proyectoId, trenTag, simulacionTren)
            resolve(simulacionTren)
          } else {
            alert("No se recibió respuesta del servidor")
            resolve(simulacionTren)
          }
        })
      })
    } else {
      alert("No se pudo simular porque la data no es valida")
      return simulacionTren
    }
  }

  checkValidoAdim(simulacion: simulacionPE) {
    let sum = 0
    const cromatografia = Object.values(simulacion.inputs.Mezcla.cromatografiaNormalizada)
    for (let index = 0; index < cromatografia.length; index++) {
      sum += cromatografia[index];
    }
    if (+sum.toFixed(1) != 1) {
      alert("cromatografia vacía o no normalizada")
      simulacion.dataValidaAdim = false
      return simulacion
    } else {
      if (
        simulacion.curva.diametro == 0 ||
        simulacion.inputs.TSUC == 0 ||
        simulacion.inputs.PSUC == 0 ||
        simulacion.inputs.TDES == 0 ||
        simulacion.inputs.PDES == 0 ||
        simulacion.inputs.FLUJOSUC == 0 ||
        simulacion.inputs.RPM == 0 ||
        simulacion.inputs.DDIM == "" ||
        simulacion.inputs.TDIM == "" ||
        simulacion.inputs.PDIM == "" ||
        simulacion.inputs.QDIM == ""
      ) {
        alert("faltan datos de simulación")
        simulacion.dataValidaAdim = false
        return simulacion
      } else {
        simulacion.dataValidaAdim = true
        return simulacion
      }
    }
  }

  /////////////////////////////////////////////////////////// SIMULACION TEORICA /////////////////////////////////////////////////////////////////

  async simularPE(proyectoId: string, trenTag: string, simulacionTren: simulacionTren) {
    let simulacion = simulacionTren.simulacion
    console.log("entre a simulacion teorica")

    // Chequeo de variables para adim
    let seccionesValidas = 0
    for (let index = 0; index < simulacion.length; index++) {
      simulacion[index] = this.checkValidoPE(simulacion[index]);
      if (simulacion[index].dataValidaTeorica == true) {
        seccionesValidas++
      }
    }
    if (seccionesValidas == simulacion.length) {
      let envioPrueba = []
      envioPrueba.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
        "TSUC", "PSUC", "FLUJO", "diametro", "RPM", "CP1", "CP2", "CP3", "CP4", "EXPOCP", "CE1", "CE2", "CE3", "CE4", "EXPOCE", "SURGE", "STONEW", "DDIM", "TDIM", "PDIM", "QDIM", "PDESCAMPO"])
      for (let j = 0; j < simulacion.length; j++) {
        const sim = simulacion[j]
        let TSUC = this.dim.transformarTemperatura(+sim.inputs.TSUC, sim.inputs.TDIM, "[°F]")
        let PSUC = this.dim.transformarPresion(+sim.inputs.PSUC, sim.inputs.PDIM, "[psig]")
        let PDES = this.dim.transformarPresion(+sim.inputs.PDES, sim.inputs.PDIM, "[psig]")
        console.log(PSUC, PDES)
        envioPrueba.push([+sim.inputs.Mezcla.cromatografiaNormalizada.metano, +sim.inputs.Mezcla.cromatografiaNormalizada.etano, +sim.inputs.Mezcla.cromatografiaNormalizada.propano, sim.inputs.Mezcla.cromatografiaNormalizada.iButano, sim.inputs.Mezcla.cromatografiaNormalizada.nButano, sim.inputs.Mezcla.cromatografiaNormalizada.iPentano, sim.inputs.Mezcla.cromatografiaNormalizada.nPentano, sim.inputs.Mezcla.cromatografiaNormalizada.hexano, sim.inputs.Mezcla.cromatografiaNormalizada.heptano, sim.inputs.Mezcla.cromatografiaNormalizada.octano, sim.inputs.Mezcla.cromatografiaNormalizada.nonano, sim.inputs.Mezcla.cromatografiaNormalizada.decano, sim.inputs.Mezcla.cromatografiaNormalizada.nitrogeno, sim.inputs.Mezcla.cromatografiaNormalizada.dioxCarbono, sim.inputs.Mezcla.cromatografiaNormalizada.sulfHidrogeno,
        +TSUC, +PSUC, +sim.inputs.FLUJOSUC, +sim.curva.diametro, +sim.inputs.RPM, +sim.curva.cc0, +sim.curva.cc1, +sim.curva.cc2, +sim.curva.cc3, +sim.curva.expocc, +sim.curva.ce0, +sim.curva.ce1, +sim.curva.ce2, +sim.curva.ce3, +sim.curva.expoce, +sim.curva.limSurge, +sim.curva.limStw, sim.inputs.DDIM, "[°F]", "[psig]", sim.inputs.QDIM, +PDES])
      }
      console.log("hice el llamado a prueba de eficiencia")
      return new Promise<simulacionTren>(resolve => {
        console.log(envioPrueba)
        this.http.post("http://127.0.0.1:5000/pruebaEficiencia2/", JSON.stringify(envioPrueba)).pipe(take(1)).subscribe(async (respuesta) => {
          let OUTPUT: Array<Array<any>> = []
          if (respuesta) {
            OUTPUT = respuesta as []
            console.log("Respuesta Teorica")
            let len = simulacion.length
            let trenHEADPOLI = 0
            let trenHEADISEN = 0
            let trenHPGAS = 0
            for (let index = 0; index < len; index++) {
              simulacion[index].outputTeorico.EFICPOLI = +OUTPUT[0][index + 1]
              simulacion[index].outputTeorico.CFWORKPOLI = +OUTPUT[1][index + 1]
              simulacion[index].outputTeorico.CFHEADPOLI = +OUTPUT[2][index + 1]
              simulacion[index].outputTeorico.WORKPOLI = +OUTPUT[3][index + 1]
              simulacion[index].outputTeorico.HPGAS = +OUTPUT[4][index + 1]
              simulacion[index].outputTeorico.FLUJOMMSCFD = +OUTPUT[5][index + 1]
              simulacion[index].outputTeorico.FLUJOSUC = +OUTPUT[6][index + 1]
              simulacion[index].outputTeorico.FLUJODES = +OUTPUT[7][index + 1]
              simulacion[index].outputTeorico.FLUJOISEN = +OUTPUT[8][index + 1]
              simulacion[index].outputTeorico.FLUJOMAS = +OUTPUT[9][index + 1]
              simulacion[index].outputTeorico.RPM = +OUTPUT[10][index + 1]
              simulacion[index].outputTeorico.TSUC = +OUTPUT[11][index + 1]
              simulacion[index].outputTeorico.TDES = +OUTPUT[12][index + 1]
              simulacion[index].outputTeorico.TISEN = +OUTPUT[13][index + 1]
              simulacion[index].outputTeorico.PSUC = +OUTPUT[14][index + 1]
              simulacion[index].outputTeorico.PDES = +OUTPUT[15][index + 1]
              simulacion[index].outputTeorico.PISEN = +OUTPUT[16][index + 1]
              simulacion[index].outputTeorico.VOLSUC = +OUTPUT[17][index + 1]
              simulacion[index].outputTeorico.VOLDES = +OUTPUT[18][index + 1]
              simulacion[index].outputTeorico.VOLISEN = +OUTPUT[19][index + 1]
              simulacion[index].outputTeorico.DENSUC = +OUTPUT[20][index + 1]
              simulacion[index].outputTeorico.DENDES = +OUTPUT[21][index + 1]
              simulacion[index].outputTeorico.DENISEN = +OUTPUT[22][index + 1]
              simulacion[index].outputTeorico.ZSUC = +OUTPUT[23][index + 1]
              simulacion[index].outputTeorico.ZDES = +OUTPUT[24][index + 1]
              simulacion[index].outputTeorico.ZISEN = +OUTPUT[25][index + 1]
              simulacion[index].outputTeorico.HSUC = +OUTPUT[26][index + 1]
              simulacion[index].outputTeorico.HDES = +OUTPUT[27][index + 1]
              simulacion[index].outputTeorico.HISEN = +OUTPUT[28][index + 1]
              simulacion[index].outputTeorico.SSUC = +OUTPUT[29][index + 1]
              simulacion[index].outputTeorico.SDES = +OUTPUT[30][index + 1]
              simulacion[index].outputTeorico.SISEN = +OUTPUT[31][index + 1]
              simulacion[index].outputTeorico.RELCOMP = +OUTPUT[32][index + 1]
              simulacion[index].outputTeorico.RELVOL = +OUTPUT[33][index + 1]
              simulacion[index].outputTeorico.HEADPOLI = +OUTPUT[34][index + 1]
              simulacion[index].outputTeorico.HEADISEN = +OUTPUT[35][index + 1]
              simulacion[index].outputTeorico.HPFRENO = +OUTPUT[36][index + 1]
              simulacion[index].outputTeorico.CFHEADPOLI = +OUTPUT[37][index + 1]
              simulacion[index].outputTeorico.CFHEADISEN = +OUTPUT[38][index + 1]
              simulacion[index].outputTeorico.EFICISEN = +OUTPUT[39][index + 1]
              simulacion[index].outputTeorico.CFWORKISEN = +OUTPUT[40][index + 1]
              simulacion[index].outputTeorico.WORKISEN = +OUTPUT[41][index + 1]
              simulacion[index].outputTeorico.QN = +OUTPUT[42][index + 1]
              simulacion[index].outputTeorico.PHI = +OUTPUT[43][index + 1]
              simulacion[index].outputTeorico.YWM = +OUTPUT[44][index + 1]
              simulacion[index].outputTeorico.EXPPOLI = +OUTPUT[45][index + 1]
              simulacion[index].outputTeorico.SURGE = +OUTPUT[46][index + 1]
              simulacion[index].outputTeorico.STONEW = +OUTPUT[47][index + 1]
              simulacion[index].simulacionAdim = true
              trenHEADPOLI += simulacion[index].outputTeorico.HEADPOLI
              trenHEADISEN += simulacion[index].outputTeorico.HEADISEN
              trenHPGAS += simulacion[index].outputTeorico.HPGAS
            }
            simulacionTren.outputTren.outputTeorico = {
              PDES: +simulacion[len-1].outputTeorico.PDES,
              HEADPOLI: +trenHEADPOLI,
              HEADISEN: +trenHEADISEN,
              RELCOMP: +simulacion[len-1].outputTeorico.PDES / +simulacion[0].outputTeorico.PSUC,
              HPGAS: +trenHPGAS,
              PSUC: +simulacion[0].outputTeorico.PSUC,
              FLUJOSUC: +simulacion[0].outputTeorico.FLUJOSUC,
              FLUJOMMSCFD: +simulacion[0].outputTeorico.FLUJOMMSCFD,
              FLUJOMAS: +simulacion[0].outputTeorico.FLUJOMAS,
              RPM: +simulacion[0].outputTeorico.RPM,
              QN: +simulacion[0].outputTeorico.QN,
            }
            console.log(respuesta)
            simulacionTren.simulacion = simulacion
            simulacionTren.simTipo = "R+T"
            await this.guardarPunto(proyectoId, trenTag, simulacionTren)
            resolve(simulacionTren)

          } else {
            console.log("no hubo respuesta")
            resolve(simulacionTren)
          }
        })
      })
    } else {
      alert("No se pudo simular porque la data no es valida")
      return simulacionTren
    }
  }

  checkValidoPE(simulacion: simulacionPE) {
    if (simulacion.simulacionAdim == false) {
      alert("No se ha realizado la prueba adimensional")
      simulacion.dataValidaTeorica = false
      return simulacion
    } else {
      let sum = 0
      const cromatografia = Object.values(simulacion.inputs.Mezcla.cromatografiaNormalizada)
      for (let index = 0; index < cromatografia.length; index++) {
        sum += +cromatografia[index];
      }
      if (+sum.toFixed(1) != 1) {
        alert("cromatografia vacía o no normalizada")
        simulacion.dataValidaTeorica = false
        return simulacion
      } else {
        if (
          simulacion.curva.diametro == 0 ||
          simulacion.inputs.TSUC == 0 ||
          simulacion.inputs.PSUC == 0 ||
          simulacion.inputs.PDES == 0 ||
          simulacion.inputs.FLUJOSUC == 0 ||
          simulacion.inputs.RPM == 0 ||
          simulacion.inputs.DDIM == "" ||
          simulacion.inputs.TDIM == "" ||
          simulacion.inputs.PDIM == "" ||
          simulacion.inputs.QDIM == "" ||
          simulacion.curva.expocc == 0 ||
          simulacion.curva.expoce == 0 ||
          simulacion.curva.limStw == 0 ||
          simulacion.curva.limSurge == 0
        ) {
          alert("faltan datos de simulación")
          simulacion.dataValidaTeorica = false
          return simulacion
        } else {
          simulacion.dataValidaTeorica = true
          return simulacion
        }
      }
    }
  }

  simularTeorica(punto: simulacionTrenTeorica) {
    let simulaciones = punto.simulacion
    let seccionesValidas = 0
    for (let index = 0; index < simulaciones.length; index++) {
      simulaciones[index] = this.checkValidoTeorica(simulaciones[index], index);
      if (simulaciones[index].dataValidaTeorica == true) {
        seccionesValidas++
      }
    }
    if (seccionesValidas == simulaciones.length) {
      let envio = []
      envio.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
        "TSUC", "PSUC", "FLUJO", "diametro", "RPM", "CP1", "CP2", "CP3", "CP4", "EXPOCP", "CE1", "CE2", "CE3", "CE4", "EXPOCE", "SURGE", "STONEW", "DDIM", "TDIM", "PDIM", "QDIM", "CAIPRES"])
      for (let index = 0; index < simulaciones.length; index++) {
        const sim = simulaciones[index];
        console.log(sim)
        let TSUC = this.dim.transformarTemperatura(+sim.inputs.TSUC, sim.inputs.TDIM, "[°F]")
        let PSUC = this.dim.transformarPresion(+sim.inputs.PSUC, sim.inputs.PDIM, "[psig]")
        envio.push([+sim.inputs.Mezcla.cromatografiaNormalizada.metano, +sim.inputs.Mezcla.cromatografiaNormalizada.etano, +sim.inputs.Mezcla.cromatografiaNormalizada.propano, sim.inputs.Mezcla.cromatografiaNormalizada.iButano, sim.inputs.Mezcla.cromatografiaNormalizada.nButano, sim.inputs.Mezcla.cromatografiaNormalizada.iPentano, sim.inputs.Mezcla.cromatografiaNormalizada.nPentano, sim.inputs.Mezcla.cromatografiaNormalizada.hexano, sim.inputs.Mezcla.cromatografiaNormalizada.heptano, sim.inputs.Mezcla.cromatografiaNormalizada.octano, sim.inputs.Mezcla.cromatografiaNormalizada.nonano, sim.inputs.Mezcla.cromatografiaNormalizada.decano, sim.inputs.Mezcla.cromatografiaNormalizada.nitrogeno, sim.inputs.Mezcla.cromatografiaNormalizada.dioxCarbono, sim.inputs.Mezcla.cromatografiaNormalizada.sulfHidrogeno,
          TSUC, PSUC, sim.inputs.FLUJOSUC, sim.curva.diametro, sim.inputs.RPM, sim.curva.cc0, sim.curva.cc1, sim.curva.cc2, sim.curva.cc3, sim.curva.expocc, sim.curva.ce0, sim.curva.ce1, sim.curva.ce2, sim.curva.ce3, sim.curva.expoce, sim.curva.limSurge, sim.curva.limStw, "[pulg]", "[°F]", "[psig]", "[MMSCFD]", sim.inputs.CAIPRES])
      }
      return new Promise<simulacionTrenTeorica>(resolve => {
        console.log(envio)
        this.http.post("http://127.0.0.1:5000/simulacionTeorica/", JSON.stringify(envio)).pipe(take(1)).subscribe((respuesta) => {
          if (respuesta) {
            let OUTPUT = []
            OUTPUT = respuesta as Array<Array<any>>
            console.log("Respuesta Teorica")
            console.log(respuesta)
            for (let j = 0; j < simulaciones.length; j++) {
              for (let i = 0; i < OUTPUT.length; i++) {
                simulaciones[j].outputTeorico.TSUC = OUTPUT[4][j + 1]
                simulaciones[j].outputTeorico.PSUC = OUTPUT[2][j + 1]
                simulaciones[j].outputTeorico.RPM = OUTPUT[17][j + 1]
                simulaciones[j].outputTeorico.FLUJODES = OUTPUT[16][j + 1]
                simulaciones[j].outputTeorico.PDES = OUTPUT[3][j + 1]
                simulaciones[j].outputTeorico.TDES = OUTPUT[5][j + 1]
                simulaciones[j].outputTeorico.HPGAS = OUTPUT[14][j + 1]
                simulaciones[j].outputTeorico.HDES = OUTPUT[7][j + 1]
                simulaciones[j].outputTeorico.DENDES = OUTPUT[6][j + 1]
                simulaciones[j].outputTeorico.SURGE = OUTPUT[8][j + 1]
                simulaciones[j].outputTeorico.QN = OUTPUT[9][j + 1]
                simulaciones[j].outputTeorico.STONEW = OUTPUT[10][j + 1]
                simulaciones[j].outputTeorico.CFHEADPOLI = OUTPUT[11][j + 1]
                simulaciones[j].outputTeorico.EFICPOLI = OUTPUT[13][j + 1]
                simulaciones[j].outputTeorico.EXPPOLI = OUTPUT[15][j + 1]
              }
            }
            punto.simulacion = simulaciones
            resolve(punto)
          } else {
            console.log("no hubo respuesta")
            resolve(punto)
          }
        })
      })
    } else {
      alert("no tiene data válida")
      return punto
    }
  }

  checkValidoTeorica(simulacion: simulacionTeorica, sec: number) {
    let sum = 0
    const cromatografia = simulacion.inputs.Mezcla.cromatografiaNormalizada.fraccMolar
    if (+cromatografia.toFixed(1) != 1) {
      alert("cromatografia vacía o no normalizada")
      simulacion.dataValidaTeorica = false
      return simulacion
    } else {
      if (sec == 0) {
        if (
          simulacion.curva.diametro == 0 ||
          simulacion.inputs.TSUC == 0 ||
          simulacion.inputs.PSUC == 0 ||
          simulacion.inputs.FLUJOSUC == 0 ||
          simulacion.inputs.RPM == 0 ||
          simulacion.inputs.DDIM == "" ||
          simulacion.inputs.TDIM == "" ||
          simulacion.inputs.PDIM == "" ||
          simulacion.inputs.QDIM == "" ||
          simulacion.curva.expocc == 0 ||
          simulacion.curva.expoce == 0 ||
          simulacion.curva.limStw == 0 ||
          simulacion.curva.limSurge == 0
        ) {
          alert("faltan datos de simulación")
          simulacion.dataValidaTeorica = false
          return simulacion
        } else {
          simulacion.dataValidaTeorica = true
          return simulacion
        }
      } else {
        if (
          simulacion.curva.diametro == 0 ||
          simulacion.inputs.TSUC == 0 ||
          simulacion.inputs.FLUJOSUC == 0 ||
          simulacion.inputs.RPM == 0 ||
          simulacion.inputs.DDIM == "" ||
          simulacion.inputs.TDIM == "" ||
          simulacion.inputs.PDIM == "" ||
          simulacion.inputs.QDIM == "" ||
          simulacion.curva.expocc == 0 ||
          simulacion.curva.expoce == 0 ||
          simulacion.curva.limStw == 0 ||
          simulacion.curva.limSurge == 0
        ) {
          alert("faltan datos de simulación")
          simulacion.dataValidaTeorica = false
          return simulacion
        } else {
          simulacion.dataValidaTeorica = true
          return simulacion
        }
      }
    }
  }

  /////////////////////////////////////////////////////////// GUARDADO ///////////////////////////////////////////////////////////////////////////

  async guardarPunto(proyectoId: string, trenTag: string, punto: simulacionTren) {
    // Guardado en el documento
    let resumen: pruebaCampo = new pruebaCampo
    console.log(punto)
    if (punto.simId != "") {
      punto.simId = punto.simTimestamp.toString()
      this.afs.collection("proyectos").doc(proyectoId)
        .collection("trenes").doc(trenTag)
        .collection("simulaciones-campo").doc(`${punto.simId}`)
        .set({
          simulacion: JSON.parse(JSON.stringify(punto.simulacion)),
          simDate: punto.simDate,
          simId: punto.simId,
          simTipo: punto.simTipo,
          simTimestamp: punto.simTimestamp,
          outputTren: JSON.parse(JSON.stringify(punto.outputTren)),
          mapaTrenReal: punto.mapaTrenReal,
          mapaTrenTeorico : punto.mapaTrenTeorico
        })
    } else {
      punto.simTimestamp = +punto.simDate * 1000
      const docRef = this.afs.collection("proyectos").doc(proyectoId)
        .collection("trenes").doc(trenTag)
        .collection("simulaciones-campo").doc(`${punto.simTimestamp}`)
      docRef.set({
        simulacion: JSON.parse(JSON.stringify(punto.simulacion)),
        simDate: punto.simDate,
        simId: punto.simId,
        simTipo: punto.simTipo,
        simTimestamp: punto.simTimestamp,
        outputTren: JSON.parse(JSON.stringify(punto.outputTren)),
        mapaTrenReal: punto.mapaTrenReal,
        mapaTrenTeorico : punto.mapaTrenTeorico
      })
    }
    // Guardado en el indice:
    resumen.simId = `${punto.simId}`;
    resumen.simDate = punto.simDate;
    resumen.simCurvas = "";
    resumen.simTipo = punto.simTipo;
    resumen.simTimestamp = punto.simTimestamp;
    resumen.simTren = punto.outputTren.outputAdim
    let simSecciones = []
    let numCompresor = 1
    for (let index = 0; index < punto.simulacion.length; index++) {
      const element = punto.simulacion[index];
      if (index > 0 && punto.simulacion[index].equipoTag != punto.simulacion[index - 1].equipoTag) {
        numCompresor++
      }
      const sim: simSeccion = {
        equipoTag: element.equipoTag,
        numCompresor: numCompresor,
        numSeccion: element.seccion,
        seccion: element.seccion,
        FLUJOSUC: element.inputs.FLUJOSUC,
        FLUJODES: element.inputs.FLUJODES,
        PSUC: element.inputs.PSUC,
        RPM: element.inputs.RPM,
        PDES: element.inputs.PDES,
        TSUC: element.inputs.TSUC,
        TDES: element.inputs.TDES,
        HPGAS: element.outputAdim.HPGAS,
        HEADPOLI: element.outputAdim.HEADPOLI,
        HEADISEN: element.outputAdim.HEADISEN,
        QN: element.outputAdim.QN,
        CFHEAD: element.outputAdim.CFHEADPOLI,
        EFIC: element.outputAdim.EFICPOLI,
        mezcla: element.inputs.Mezcla,
      }
      simSecciones.push(sim)
    }
    resumen.simSecciones = simSecciones
    this.afs.collection("proyectos").doc(proyectoId)
      .collection("trenes").doc(trenTag)
      .collection("indices-campo").doc("indice-campo").set({
        [punto.simId]: JSON.parse(JSON.stringify(resumen))
      }, { merge: true })
  }

  async borrarPunto(proyectoId: string, trenTag: string, timestamp: string, simulacion: pruebaCampo) {
    if (simulacion.simId != "") {
      await this.afs.collection("proyectos").doc(proyectoId)
        .collection("trenes").doc(trenTag)
        .collection("simulaciones-campo").doc(`${simulacion.simId}`).delete()
    }
    await this.afs.collection("proyectos").doc(proyectoId)
      .collection("trenes").doc(trenTag)
      .collection("indices-campo").doc("indice-campo").update({
        [timestamp]: firebase.default.firestore.FieldValue.delete()
      })
  }

  /////////////////////////////////////////////////////////////////// ARMADOS DE DATA ////////////////////////////////////////////////////////////////////////////////////////////

  async armarNuevaSimPE(proyectoId: string, tren: tren, resumen: pruebaCampo, equipos: equipo[], tipo: "nuevo" | "indice") {
    let simulaciones: simulacionPE[] = []
    if (tipo == "nuevo") {
      try {
        for (let i = 0; i < equipos.length; i++) {
          let curvas = []
          const curvasDocs = await this.afs.collection("proyectos").doc(proyectoId).collection("equipos").doc(equipos[i].tag).collection("curvas").ref.get();
          for (let j = 0; j < curvasDocs.docs.length; j++) {
            const curva = curvasDocs.docs[j].data() as curva;
            if (curva.equivalente == true) {
              curvas.push(curva)
            }
          }
          for (let sec = 1; sec < equipos[i].nSecciones + 1; sec++) {
            const simulacion = new simulacionPE()
            simulacion.mapas = []
            simulacion.mapaPunto = []
            simulacion.equipoTag = equipos[i].tag
            simulacion.equipoFamilia = equipos[i].familia
            simulacion.seccion = sec
            simulacion.equipo = i + 1
            simulacion.curvas = curvas.filter(x => x.numSeccion == sec)
            simulacion.curva = simulacion.curvas.find(x => x.default == true)
            simulacion.inputs.DDIM = tren.dimensiones.diametro
            simulacion.inputs.PDIM = tren.dimensiones.presion
            simulacion.inputs.QDIM = tren.dimensiones.flujo
            simulacion.inputs.TDIM = tren.dimensiones.temperatura
            simulaciones.push(simulacion)
          }
          curvas = []
        }

      } catch (err) {
        console.log(err)
      }
    }
    if (tipo == "indice") {
      try {
        let iSec = 0
        for (let i = 0; i < equipos.length; i++) {
          let curvas = []
          const curvasDocs = await this.afs.collection("proyectos").doc(proyectoId).collection("equipos").doc(equipos[i].tag).collection("curvas").ref.get();
          for (let j = 0; j < curvasDocs.docs.length; j++) {
            const curva = curvasDocs.docs[j].data() as curva;
            if (curva.equivalente == true) {
              curvas.push(curva)
            }
          }
          for (let sec = 1; sec < equipos[i].nSecciones + 1; sec++) {
            const simulacion = new simulacionPE()
            simulacion.equipoTag = equipos[i].tag
            simulacion.equipoFamilia = equipos[i].familia
            simulacion.equipo = i + 1
            simulacion.seccion = sec
            simulacion.curvas = curvas.filter(x => x.numSeccion == sec)
            simulacion.curva = simulacion.curvas.find(x => x.default == true)
            let cromatografiaOriginal: cromatografia = {
              metano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.metano,
              etano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.etano,
              propano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.propano,
              iButano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.iButano,
              nButano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.nButano,
              iPentano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.iPentano,
              nPentano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.nPentano,
              hexano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.hexano,
              heptano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.heptano,
              octano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.octano,
              nonano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.nonano,
              decano: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.decano,
              nitrogeno: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.nitrogeno,
              dioxCarbono: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.dioxCarbono,
              sulfHidrogeno: resumen.simSecciones[iSec].mezcla.cromatografiaOriginal.sulfHidrogeno,
              fraccMolar: 0,
            }
            let cromatografiaNormalizada: cromatografia = this.normalizarCromatografia(cromatografiaOriginal)
            let mezcla: mezcla = {
              id: "",
              nombre: `c:${i + 1}-s:${sec}-${resumen.simTimestamp}`,
              cromatografiaOriginal: cromatografiaOriginal,
              cromatografiaNormalizada: cromatografiaNormalizada
            }
            simulacion.inputs = {
              TSUC: resumen.simSecciones[iSec].TSUC,
              TDES: resumen.simSecciones[iSec].TDES,
              PSUC: resumen.simSecciones[iSec].PSUC,
              PDES: resumen.simSecciones[iSec].PDES,
              RPM: resumen.simSecciones[iSec].RPM,
              FLUJOSUC: resumen.simSecciones[iSec].FLUJOSUC,
              FLUJODES: resumen.simSecciones[iSec].FLUJODES,
              TDIM: tren.dimensiones.temperatura,
              PDIM: tren.dimensiones.presion,
              QDIM: tren.dimensiones.flujo,
              DDIM: tren.dimensiones.diametro,
              Mezcla: mezcla
            }
            simulaciones.push(simulacion)
            iSec++
          }
          curvas = []
        }
      } catch (err) {
        console.log(err)
      }
    }
    return simulaciones
  }

  async armarNuevaSimTeorica(punto: simulacionTrenTeorica, equipos: equipo[], proyectoId: string, tren: tren) {
    try {
      let simulaciones: simulacionTeorica[] = []
      punto.simulacion = []
      for (let i = 0; i < equipos.length; i++) {
        let curvas: curva[] = []
        const curvasDocs = await this.afs.collection("proyectos").doc(proyectoId).collection("equipos").doc(equipos[i].tag).collection("curvas").ref.get();
        for (let j = 0; j < curvasDocs.docs.length; j++) {
          const curva = curvasDocs.docs[j].data() as curva;
          if (curva.equivalente == true) {
            curvas.push(curva)
          }
        }
        for (let sec = 1; sec < equipos[i].nSecciones + 1; sec++) {
          const simulacion = new simulacionTeorica()
          simulacion.equipoTag = equipos[i].tag
          simulacion.equipoFamilia = equipos[i].familia
          simulacion.seccion = sec
          simulacion.curvas = curvas.filter(x => x.numSeccion == sec)
          simulacion.curva = simulacion.curvas.find(x => x.default == true)
          simulacion.inputs.DDIM = tren.dimensiones.diametro
          simulacion.inputs.PDIM = tren.dimensiones.presion
          simulacion.inputs.QDIM = tren.dimensiones.flujo
          simulacion.inputs.TDIM = tren.dimensiones.temperatura
          simulaciones.push(simulacion)
        }
        curvas = []
      }
      punto.simulacion = simulaciones
      simulaciones = []
    } catch (err) {
      console.log(err)
    }
    return punto
  }


  normalizarCromatografia(original: cromatografia) {
    let sum =
      +original.metano
      + original.etano
      + original.propano
      + original.iButano
      + original.nButano
      + original.iPentano
      + original.nPentano
      + original.hexano
      + original.heptano
      + original.octano
      + original.nonano
      + original.decano
      + original.nitrogeno
      + original.dioxCarbono
      + original.sulfHidrogeno

    let normalizada: cromatografia = {
      metano: original.metano / sum,
      etano: original.etano / sum,
      propano: original.propano / sum,
      iButano: original.iButano / sum,
      nButano: original.nButano / sum,
      iPentano: original.iPentano / sum,
      nPentano: original.nPentano / sum,
      hexano: original.hexano / sum,
      heptano: original.heptano / sum,
      octano: original.octano / sum,
      nonano: original.nonano / sum,
      decano: original.decano / sum,
      nitrogeno: original.nitrogeno / sum,
      dioxCarbono: original.dioxCarbono / sum,
      sulfHidrogeno: original.sulfHidrogeno / sum,
      fraccMolar: 0
    }

    return normalizada
  }

  ///////////////////// MAPAS //////////////////////////////

  generarMapasPE(punto: simulacionTren, equipos: equipo[], proyectoId: string, trenTag: string) {
    console.log("simulando mapa")
    let envio = []
    envio.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
      "TSUC", "PSUC", "FLUJO", "diametro", "RPM", "CC0", "CC1", "CC2", "CC3", "EXPOCP", "CE0", "CE1", "CE2", "CE3", "EXPOCE", "SURGE", "STONEW", "DDIM", "TDIM", "PDIM", "QDIM"])
    for (let index = 0; index < punto.simulacion.length; index++) {
      const sim = punto.simulacion[index];
      let TSUC = +sim.outputTeorico.TSUC
      let PSUC = +sim.outputTeorico.PSUC
      let rpmDiseno = equipos[sim.equipo - 1].rpmDiseno[sim.seccion - 1]
      if (rpmDiseno == 0) {
        alert("no se ha configurado una RPM de diseno")
      }
      envio.push([+sim.inputs.Mezcla.cromatografiaNormalizada.metano, +sim.inputs.Mezcla.cromatografiaNormalizada.etano, +sim.inputs.Mezcla.cromatografiaNormalizada.propano, sim.inputs.Mezcla.cromatografiaNormalizada.iButano, sim.inputs.Mezcla.cromatografiaNormalizada.nButano, sim.inputs.Mezcla.cromatografiaNormalizada.iPentano, sim.inputs.Mezcla.cromatografiaNormalizada.nPentano, sim.inputs.Mezcla.cromatografiaNormalizada.hexano, sim.inputs.Mezcla.cromatografiaNormalizada.heptano, sim.inputs.Mezcla.cromatografiaNormalizada.octano, sim.inputs.Mezcla.cromatografiaNormalizada.nonano, sim.inputs.Mezcla.cromatografiaNormalizada.decano, sim.inputs.Mezcla.cromatografiaNormalizada.nitrogeno, sim.inputs.Mezcla.cromatografiaNormalizada.dioxCarbono, sim.inputs.Mezcla.cromatografiaNormalizada.sulfHidrogeno,
        TSUC, PSUC, sim.outputAdim.FLUJOMMSCFD, sim.curva.diametro, rpmDiseno, sim.curva.cc0, sim.curva.cc1, sim.curva.cc2, sim.curva.cc3, sim.curva.expocc, sim.curva.ce0, sim.curva.ce1, sim.curva.ce2, sim.curva.ce3, sim.curva.expoce, sim.curva.limSurge, sim.curva.limStw, "[pulg]", "[°F]", "[psig]", "[MMSCFD]"])
    }
    return new Promise<simulacionTren>(resolve => {
      this.http.post("http://127.0.0.1:5000/generarMapaTeorico/", JSON.stringify(envio)).pipe(take(1)).subscribe(async (respuesta) => {
        console.log(respuesta)
        let OUTPUT: Array<Array<any>> = []
        if (respuesta) {
          OUTPUT = respuesta as Array<Array<any>>
          let sec = -1 // Inicializacion de la seccion
          let puntos = []
          for (let index = 0; index < OUTPUT[0].length; index++) {
            if (OUTPUT[0][index] == "RPM") {
              if (sec >= 0) {
                punto.simulacion[sec].mapas = puntos
                puntos = []
              }
              sec++
            } else {
              const obj: puntoMapa = {
                RPM: +OUTPUT[0][index],
                QN: +OUTPUT[1][index],
                TDES: +OUTPUT[2][index],
                PDES: +OUTPUT[3][index],
                HPGAS: +OUTPUT[4][index],
                FLUJODES: +OUTPUT[5][index],
                EFICPOLI: +OUTPUT[6][index],
                CFHEADPOLI: +OUTPUT[7][index],
                CFWORKPOLI: +OUTPUT[8][index],
                HEADPOLI: +OUTPUT[9][index],
                PSUC: +OUTPUT[10][index],
                HEADISEN: +OUTPUT[11][index],
                FLUJOMMSCFD: +OUTPUT[12][index],
                FLUJOMAS: +OUTPUT[13][index]
              }
              puntos.push(obj)
            }
            if (index == OUTPUT[0].length - 1) {
              console.log("guardando mapa")
              punto.simulacion[sec].mapas = puntos
              // Construcción del mapa para el tren
              let mapaTrenTeorico = []
              for (let pto = 0; pto < punto.simulacion[sec].mapas.length; pto++) {
                let HEADISEN = 0
                let HEADPOLI = 0
                let HPGAS = 0

                for (let auxSec = 0; auxSec < punto.simulacion.length; auxSec++) {
                  HEADISEN += punto.simulacion[auxSec].mapas[pto].HEADISEN
                  HEADPOLI += punto.simulacion[auxSec].mapas[pto].HEADPOLI
                  HPGAS += punto.simulacion[auxSec].mapas[pto].HPGAS
                }
                const obj: outputTrenAdim = {
                  HEADISEN: HEADISEN,
                  HEADPOLI: HEADPOLI,
                  PSUC: punto.simulacion[0].mapas[pto].PSUC,
                  PDES: punto.simulacion[sec].mapas[pto].HPGAS,
                  HPGAS: HPGAS,
                  FLUJOSUC: punto.simulacion[0].mapas[pto].FLUJODES,
                  FLUJOMMSCFD: punto.simulacion[0].mapas[pto].FLUJOMMSCFD,
                  FLUJOMAS:punto.simulacion[0].mapas[pto].FLUJOMAS,
                  RPM: punto.simulacion[0].mapas[pto].RPM,
                  RELCOMP: punto.simulacion[sec].mapas[pto].PDES/punto.simulacion[sec].mapas[pto].PSUC,
                  QN:punto.simulacion[0].mapas[pto].QN,
                }
                mapaTrenTeorico.push(obj)
              }
              // Fin de construcción de mapa para el tren
              punto.mapaTrenTeorico = mapaTrenTeorico
              await this.guardarPunto(proyectoId, trenTag, punto)
              resolve(punto)
            }
          }
        } else {
          resolve(punto)
        }
      })
    })
  }

  generarMapasReal(punto: simulacionTren, equipos: equipo[], proyectoId: string, trenTag: string) {
    console.log("simulando mapa")
    let envio = []
    envio.push(["Metano", "Etano", "Propano", "I-Butano", "N-Butano", "I-Pentano", " N-Pentano", "Hexano", "Heptano", "Octano", "Nonano", "Decano", "Nitrógeno", "Diox. Carbono", "Sulf. Hidrógeno",
      "TSUC", "PSUC", "FLUJO", "diametro", "RPM", "CC0", "CC1", "CC2", "CC3", "EXPOCP", "CE0", "CE1", "CE2", "CE3", "EXPOCE", "SURGE", "STONEW", "DDIM", "TDIM", "PDIM", "QDIM"])
    for (let index = 0; index < punto.simulacion.length; index++) {
      const sim = punto.simulacion[index];
      let TSUC = +sim.outputTeorico.TSUC
      let PSUC = +sim.outputTeorico.PSUC
      let rpmDiseno = equipos[sim.equipo - 1].rpmDiseno[sim.seccion - 1]
      let No = +sim.outputTeorico.EFICPOLI - +sim.outputAdim.EFICPOLI
      let Uo = +sim.outputTeorico.CFHEADPOLI - +sim.outputAdim.CFHEADPOLI
      let ce0 = sim.curva.ce0 - No
      let cc0 = sim.curva.cc0 - Uo
      if (rpmDiseno == 0) {
        alert("no se ha configurado una RPM de diseno")
      }
      envio.push([+sim.inputs.Mezcla.cromatografiaNormalizada.metano, +sim.inputs.Mezcla.cromatografiaNormalizada.etano, +sim.inputs.Mezcla.cromatografiaNormalizada.propano, sim.inputs.Mezcla.cromatografiaNormalizada.iButano, sim.inputs.Mezcla.cromatografiaNormalizada.nButano, sim.inputs.Mezcla.cromatografiaNormalizada.iPentano, sim.inputs.Mezcla.cromatografiaNormalizada.nPentano, sim.inputs.Mezcla.cromatografiaNormalizada.hexano, sim.inputs.Mezcla.cromatografiaNormalizada.heptano, sim.inputs.Mezcla.cromatografiaNormalizada.octano, sim.inputs.Mezcla.cromatografiaNormalizada.nonano, sim.inputs.Mezcla.cromatografiaNormalizada.decano, sim.inputs.Mezcla.cromatografiaNormalizada.nitrogeno, sim.inputs.Mezcla.cromatografiaNormalizada.dioxCarbono, sim.inputs.Mezcla.cromatografiaNormalizada.sulfHidrogeno,
        TSUC, PSUC, sim.outputAdim.FLUJOMMSCFD, sim.curva.diametro, rpmDiseno, cc0, sim.curva.cc1, sim.curva.cc2, sim.curva.cc3, sim.curva.expocc, ce0, sim.curva.ce1, sim.curva.ce2, sim.curva.ce3, sim.curva.expoce, sim.curva.limSurge, sim.curva.limStw, "[pulg]", "[°F]", "[psig]", "[MMSCFD]"])
    }
    return new Promise<simulacionTren>(resolve => {
      this.http.post("http://127.0.0.1:5000/generarMapaTeorico/", JSON.stringify(envio)).pipe(take(1)).subscribe(async (respuesta) => {
        console.log(respuesta)
        let OUTPUT: Array<Array<any>> = []
        if (respuesta) {
          OUTPUT = respuesta as Array<Array<any>>
          let sec = -1 // Inicializacion de la seccion
          let puntos: puntoMapa[] = []
          let mapaPuntoReal = []
          for (let index = 0; index < OUTPUT[0].length; index++) {
            if (OUTPUT[0][index] == "RPM") {
              if (sec >= 0) {
                punto.simulacion[sec].mapaPunto = puntos
                puntos = []
              }
              sec++
            } else {
              const obj: puntoMapa = {
                RPM: +OUTPUT[0][index],
                QN: +OUTPUT[1][index],
                TDES: +OUTPUT[2][index],
                PDES: +OUTPUT[3][index],
                HPGAS: +OUTPUT[4][index],
                FLUJODES: +OUTPUT[5][index],
                EFICPOLI: +OUTPUT[6][index],
                CFHEADPOLI: +OUTPUT[7][index],
                CFWORKPOLI: +OUTPUT[8][index],
                HEADPOLI: +OUTPUT[9][index],
                PSUC: +OUTPUT[10][index],
                HEADISEN: +OUTPUT[11][index],
                FLUJOMMSCFD: +OUTPUT[12][index],
                FLUJOMAS: +OUTPUT[13][index],
              }
              puntos.push(obj)
            }
            if (index == OUTPUT[0].length - 1) {
              console.log("guardando mapa")
              punto.simulacion[sec].mapaPunto = puntos
              // Construcción del mapa para el tren
              let mapaTrenReal = []
              for (let pto = 0; pto < punto.simulacion[sec].mapaPunto.length; pto++) {
                let HEADISEN = 0
                let HEADPOLI = 0
                let HPGAS = 0

                for (let auxSec = 0; auxSec < punto.simulacion.length; auxSec++) {
                  HEADISEN += +punto.simulacion[auxSec].mapaPunto[pto].HEADISEN
                  HEADPOLI += +punto.simulacion[auxSec].mapaPunto[pto].HEADPOLI
                  HPGAS += +punto.simulacion[auxSec].mapaPunto[pto].HPGAS
                }
                const obj: outputTrenAdim = {
                  HEADISEN: HEADISEN,
                  HEADPOLI: HEADPOLI,
                  PSUC: punto.simulacion[0].mapaPunto[pto].PSUC,
                  PDES: punto.simulacion[sec].mapaPunto[pto].HPGAS,
                  HPGAS: HPGAS,
                  FLUJOSUC: punto.simulacion[0].mapaPunto[pto].FLUJODES,
                  FLUJOMMSCFD: punto.simulacion[0].mapaPunto[pto].FLUJOMMSCFD,
                  FLUJOMAS:punto.simulacion[0].mapaPunto[pto].FLUJOMAS,
                  RPM: punto.simulacion[0].mapaPunto[pto].RPM,
                  RELCOMP: punto.simulacion[sec].mapaPunto[pto].PDES/punto.simulacion[sec].mapaPunto[pto].PSUC,
                  QN:punto.simulacion[0].mapaPunto[pto].QN,
                }
                mapaTrenReal.push(obj)
              }
              // Fin de construcción de mapa para el tren
              punto.mapaTrenReal = mapaTrenReal
              await this.guardarPunto(proyectoId, trenTag, punto)
              resolve(punto)
            }
          }
        } else {
          resolve(punto)
        }
      })
    })
  }


}
