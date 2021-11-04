import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';

export class tren {
  tag: string = "";
  equipos: equipo_tren[] = [];
}

export class equipo_tren {
  tag: string = "";
  orden: number = 0;
  familia: string = "";
  tipologia: "Inline" | "Back to Back" = "Inline";
}

export class Proyecto {
  id: string = "";
  userId: string = ""; 
  titulo: string = "";
  revision: string = "A";
  cliente: string = "";
  instalacion: string = "";
  antecedentes: string = "";
  objetivo: string = "";
  alcance: string = "";
  premisas: string = "";
  trenes: tren[] = [];
}

export class Usuario {
  correo: string = "";
  empresa: string = "";
  especialidad: string = "";
  fechaCreacion: Date = new Date;
  foto: string = "";
  id: string = "";
  nombre: string = "";
  telefono: string = "";
}

export class equipo {
  tag: string = "";
  tipologia: "Inline" | "Back to Back" = "Inline";
  familia: string = "";
  orden: number = 0;
  general: general = new general;
  puntosDatasheet: puntosDatasheet[] = [];
  fabricante: string = "";
  modelo: string = "";
  documentos: file[] = [];
  nImpulsores: number[] = []
  nSecciones: number = 1
}

export class file {
  nombre: string = "";
  size: number = 0;
  type: string = "";
  url: string = "";
  descripcion: string = "";
}

export class mapas {
  nombre: string = "";
  numero: number = 0;
}
export class general {
  nombre: string = "";
  numero: number = 0;
}

export class puntosDatasheet {
  nombre: string = "";
  numero: number = 0;
}


// ------------------------------------------------------------------------------------------------------------------------ CURVAS

export class curva {
  // Metadata
  generado: boolean = false; //Es un flag que determina si efectivamente la data del mapa esta rellena. 
  fechaGeneracion: Date = new Date; // Fecha de creación o edición del mapa.
  ultimaEdicion: Date = new Date; // Fecha de creación o edición del mapa.
  ultimoEditor: string = '';
  dimQ: string = 'Q/N';
  equivalente: boolean = true // Flag que determina si el impulsor es equivalente
  nombre: string = '';
  comentario: string = '';
  vigencia: boolean = true;
  default: boolean = false;

  // General
  numCompresor: number = 0;
  numSeccion: number = 1;
  numImpulsor: number = 1; // 0 es el default para el impulsor requivalente y 1++ el numero que ocuparian los impulsores individuales
  fab: boolean= true; // Flag para identificar si la data viene del fabricante
  diametro: number = 0; // diametro de cada impulsor
  limSurge: number = 0; //Límite Q/N de surge
  limStw: number = 0; //Límite Q/N de stw

  //Tipo de ajuste
  tipoAjuste: string = 'Manual';
  orden: number = 3

  // Coeficiente de Head
  coefHeadDataSet: dataSet[] = []; //es una matriz que contiene Num de punto, Q/N y u (miu = head)
  cp1: number = 0; //termino independiente a0*x^0
  cp2: number = 0; //a1*X^1
  cp3: number = 0; //a2*X^2
  cp4: number = 0; //a3*X^3
  expocp: number = 0;
  errcp: number = 0;
  headImg:  string = ''; //Es una imagen que se carga de referencia

  // Eficiencia politropica
  eficPoliDataSet: dataSet[]  = [];  //es una matriz que contiene Num de punto, Q/N y n (eta = eficiencia)
  ce1: number = 0; //termino independiente a0*x^0
  ce2: number = 0; //a1*X^1
  ce3: number = 0; //a2*X^2
  ce4: number = 0; //a3*X^3
  expoce: number = 0;
  errce: number = 0;
  eficImg: string = ''; //Es una imagen que se carga de referencia
}

class dataSet{
  x: number| string = 0;
  y: number| string = 0;
}

export class compresorDims {
  flujo: string = 'MMscfd';
  velocidad: 'rpm';
  presion: string = 'psig';
  temperatura: string = '°F';
  volEspecifico: string = 'pie3/lbm';
  densidad: string = 'lbm/pie3';
  potencia: string = 'Hp';
  diametro: string = 'm';
}

export class cromatografia {
  metano: number = 0;
  etano: number = 0;
  propano: number = 0;
  iButano: number = 0;
  nButano: number = 0;
  iPentano: number = 0;
  nPentano: number = 0;
  hexano: number = 0;
  heptano: number = 0;
  octano: number = 0;
  nonano: number = 0;
  decano: number = 0;
  nitrogeno: number = 0;
  dioxCarbono: number = 0;
  sulfHidrogeno: number = 0;
  aire: number = 0;
}


// ------------------------------------------------------------------------------------------------------------------------ XXXXXXXXXXXX



@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  cromatografiaNombre: string[] = ['Metano (CH4)','Etano (C2H6)','Propano (C3H8)',	'iso-Butano (C4H10)', 'n-Butano (C4H10)','iso-Pentano (C5H12)','n-Pentano (C5H12)','Hexanos  (C6H14)','Heptanos (C7H16)','Octanos (C8H18)','Nonanos (C9H20)','Decanos (C10H22)','Diox. Carbono (CO2)','Nitrogeno (N2)','Sulf. Hidrógeno (H2S)']
  cromatografiaPM: string[] = ['16.043','30.07','44.097','58.124','58.124','72.151','72.151','86.178','100.205','114.232','128.259','142.286','44.01','28.013','34.076']
  inputPruebaEficiencia: string[] = ['P. succ.','T. succ','P desc.','T desc.','RPM','Flujo','Mezcla Gas']

  
    // 
  // 
  // 
  // 
  // 	
  // 	
  // 
  // 	
  // 	
  // 	
  // 	
  // 	
  // 
  // 
  // 


  
  // ########  ########   #######  ##    ## ########  ######  ########  #######   ######  
  // ##     ## ##     ## ##     ##  ##  ##  ##       ##    ##    ##    ##     ## ##    ## 
  // ##     ## ##     ## ##     ##   ####   ##       ##          ##    ##     ## ##       
  // ########  ########  ##     ##    ##    ######   ##          ##    ##     ##  ######  
  // ##        ##   ##   ##     ##    ##    ##       ##          ##    ##     ##       ## 
  // ##        ##    ##  ##     ##    ##    ##       ##    ##    ##    ##     ## ##    ## 
  // ##        ##     ##  #######     ##    ########  ######     ##     #######   ######  

  /**
   * Crear nuevo proyecto
   */


  async createProyecto(data: Proyecto) {
    const docRef = this.afs.collection("proyectos").doc()
    data.id = docRef.ref.id
    return docRef.set({
      ...data
    })
  }

  /**
   * Obtener todos los proyectos del usuario especifico
   */
  obtenerProyectosUsuario() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs
            .collection<Proyecto>('proyectos', ref =>
              ref.where('userId', '==', user.uid)
            )
            .valueChanges({ idField: 'id' });
        } else {
          return [];
        }
      }),
    );
  }


  /**
   *Ordenar proyectos
   */
  ordenarProyectos(proyectos: Proyecto[]) {
    const afs = firebase.firestore();
    const batch = afs.batch();
    const refs = proyectos.map(b => afs.collection('proyectos').doc(b.id));
    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit();
  }

  /**
   * Obtener Proyecto
   */
  obtenerProyecto(proyectoId: string) {
    return this.afs.collection<Proyecto>("proyectos").doc(proyectoId).valueChanges()
  }

  updateProyecto(proyectoId: string, proyecto: Proyecto) {
    return this.afs.collection("proyectos").doc(proyectoId).update({
      ...proyecto
    })
  }

  /**
   * Borrar Proyecto
   */
  eliminarProyecto(proyectoId: string) {
    return this.afs
      .collection('proyectos')
      .doc(proyectoId)
      .delete();
  }

  // Trenes ////////////////////////////////////////////////////////////////////
  getTren(proyectoId: string, tagTren: string) {
    return this.afs.collection("proyectos")
    .doc(proyectoId)
    .collection<tren>("trenes")
    .doc(tagTren)
    .valueChanges()
  }

  getTrenes(proyectoId: string){
    return this.afs.collection("proyectos")
      .doc(proyectoId)
      .collection("trenes")
      .valueChanges()
  }

  updateTren(proyectoId: string, tren: tren) {
    return this.afs
      .collection('proyectos')
      .doc(proyectoId)
      .collection("trenes").doc(tren.tag)
      .set({...tren}, {merge:true});
  }

  anexarTren(proyectoId: string, tren: tren) {
    return this.afs.collection("proyectos").doc(proyectoId)
      .collection("trenes")
      .doc(tren.tag)
      .set({...tren})
  }

  eliminarTren(proyectoId: string, tren: tren) {
    return this.afs
      .collection('proyectos')
      .doc(proyectoId)
      .collection("trenes")
      .doc(tren.tag)
      .delete()
  }


  //////////////////////////////////////////////////////////////////////////////////
  getEquipos(proyectoId:string, trenTag: string){
    return this.afs.collection("proyectos").doc(proyectoId).collection<equipo>("equipos").valueChanges()
  }
  obtenerEquipo(proyectoId:string, tag: string){
    return this.afs.collection<Proyecto>("proyectos").doc(proyectoId).collection<equipo>("equipos").doc(tag).valueChanges()
  }

  async createEquipo(proyectoId:string, equipo: equipo) {
    if(equipo.tipologia == "Inline"){
      equipo.nSecciones = 1
      equipo.nImpulsores = [0,0]
      await this.afs.collection("proyectos").doc(proyectoId).collection("equipos").doc(equipo.tag).set({
        ...equipo
      })
    }
    if(equipo.tipologia == "Back to Back"){
      equipo.nSecciones = 2
      equipo.nImpulsores = [0,0]
      await this.afs.collection("proyectos").doc(proyectoId).collection("equipos").doc(equipo.tag).set({
        ...equipo
      })
    }
  }

  async eliminarEquipo(proyectoId: string, equipoTag: string) {
    return this.afs
      .collection('proyectos')
      .doc(proyectoId)
      .collection("equipos")
      .doc(equipoTag)
      .delete().catch(error => console.log(error))
  }

  async getCurvas(proyectoId: string, equipoTag: string) {
    let curvas: curva[] = []
    const docs= await this.afs
    .collection('proyectos')
      .doc(proyectoId)
      .collection("equipos")
      .doc(equipoTag)
      .collection<curva>("curvas")
      .ref
      .get()
    const len = docs.size
    let i = 0
    for (let index = 0; index < len; index++) {
      const curva = docs.docs[i].data();
      curvas.push(curva)
    }
    return curvas

  }

  /**
   * Actualizar
   */
  // updateENT(proyectoId: string, ent: ENT[]) {
  //   return this.afs
  //     .collection('proyectos')
  //     .doc(proyectoId)
  //     .set({ent: ent}, {merge:true});
  // }

  // /// 
  // anadirENT(proyectoId: string, ent: ENT) {
  //   return this.afs
  //     .collection('proyectos')
  //     .doc(proyectoId)
  //     .update({
  //       ent: firebase.firestore.FieldValue.arrayUnion(Object.assign({},ent))
  //     });
  // }

  /**
   * Remover 
   */
  // eliminarENT(proyectoId: string, ent: ENT) {
  //   return this.afs
  //     .collection('proyectos')
  //     .doc(proyectoId)
  //     .update({
  //       ent: firebase.firestore.FieldValue.arrayRemove(ent)
  //     });
  // }


  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  /////////////////EVENTOS////////////////////////////////////////////////////////

  // /**
  //  * Actualizar
  //  */
  //  updateEventos(proyectoId: string, eventos: evento[]) {
  //   return this.afs
  //     .collection('proyectos')
  //     .doc(proyectoId)
  //     .update({eventos});
  // }

  // /// 
  // anadirEvento(proyectoId: string, evento: evento) {
  //   return this.afs
  //     .collection('proyectos')
  //     .doc(proyectoId)
  //     .update({
  //       eventos: firebase.firestore.FieldValue.arrayUnion(Object.assign({},evento))
  //     });
  // }

  // /**
  //  * Remover 
  //  */
  // eliminarEvento(proyectoId: string, evento: evento) {
  //   return this.afs
  //     .collection('proyectos')
  //     .doc(proyectoId)
  //     .update({
  //       eventos: firebase.firestore.FieldValue.arrayRemove(evento)
  //     });
  // }


  // ##     ##  ######  ##     ##    ###    ########  ####  #######   ######  
  // ##     ## ##    ## ##     ##   ## ##   ##     ##  ##  ##     ## ##    ## 
  // ##     ## ##       ##     ##  ##   ##  ##     ##  ##  ##     ## ##       
  // ##     ##  ######  ##     ## ##     ## ########   ##  ##     ##  ######  
  // ##     ##       ## ##     ## ######### ##   ##    ##  ##     ##       ## 
  // ##     ## ##    ## ##     ## ##     ## ##    ##   ##  ##     ## ##    ## 
  //  #######   ######   #######  ##     ## ##     ## ####  #######   ######

  obtenerUsuario() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs
            .collection<Usuario>('usuarios')
            .doc(user.uid)
            .valueChanges({ idField: 'id' });
        } else {
          return null;
        }
      }),
    );
  }

  updateUsuario(userId: string, usuario: Usuario) {
    return this.afs.collection("usuarios").doc(userId).update({
      ...usuario
    })
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
    for (let index in headerList) {
     row += headerList[index] + ';';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
     let line = '';
     for (let index in headerList) {
      let head = headerList[index];
      line +=   array[i][head]+ ';';
     }
     str += line + '\r\n';
    }
    return str;
   }

   downloadFile(data, filename='data', headers) {
    let csvData = this.ConvertToCSV(data, headers);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { }
}
