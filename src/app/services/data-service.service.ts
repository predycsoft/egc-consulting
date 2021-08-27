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
  tipologia: string = "";
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
  general: general = new general();
  puntosDatasheet: puntosDatasheet[] = [];
  fabricante: string = "";
  modelo: string = "";
  curvas: curvas = new curvas();
  mapas: mapas = new mapas();
  documentos: file[] = [];
}

export class file {
  nombre: string = "";
  size: number = 0;
  type: string = "";
  url: string = "";
  descripcion: string = "";
}

export class curvas {
  nombre: string = "";
  numero: number = 0;
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


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

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

  updateTren(proyectoId: string, trenes: tren[]) {
    return this.afs
      .collection('proyectos')
      .doc(proyectoId)
      .set({trenes: trenes}, {merge:true});
  }

  anexarTren(proyectoId: string, tren: tren) {
    return this.afs.collection("proyectos").doc(proyectoId)
      .update({
        trenes: firebase.firestore.FieldValue.arrayUnion(Object.assign({}, tren))
      })
  }

  eliminarTren(proyectoId: string, tren: tren) {
    return this.afs
      .collection('proyectos')
      .doc(proyectoId)
      .update({
        trenes: firebase.firestore.FieldValue.arrayRemove(tren)
      });
  }


  //////////////////////////////////////////////////////////////////////////////////

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

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { }
}
