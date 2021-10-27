import { Component, OnInit, SecurityContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { curva, DataServiceService } from 'src/app/services/data-service.service';
import { DialogPolinomiosCurvasCompresorComponent } from '../dialog-polinomios-curvas-compresor/dialog-polinomios-curvas-compresor.component';



// A traves del front:
// 1: Se selecciona la seccion -> se filtra la data segun el numero de la sección
// 2: 

@Component({
  selector: 'curvas-compresor',
  templateUrl: './curvas-compresor.component.html',
  styleUrls: ['./curvas-compresor.component.css']
})
export class CurvasCompresorComponent implements OnInit {

  impEqSel: string = '';
  impSel: number;
  impulsores: curva[] | string[] = []
  curvas: curva[] = []

  numSecciones: number;
  seccionActual: number;
  trenTag;
  equipoTag;

  usuario = JSON.parse(JSON.stringify("user"))

  constructor(private route: ActivatedRoute, public dialog: MatDialog, public data: DataServiceService, private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.trenTag = params.trenTag;
      this.equipoTag = params.equipoTag;
    })
    // let impulsor = new curva
    // impulsor.fab = true
    // impulsor.numSeccion = 1
    // this.afs.collection("proyectos").doc(this.trenTag).collection("equipos").doc(this.equipoTag).collection("curvas").doc(`impulsor-eq-fabricate-s1`).set(impulsor)
    // impulsor.fab = true
    // impulsor.numSeccion = 2
    // this.afs.collection("proyectos").doc(this.trenTag).collection("equipos").doc(this.equipoTag).collection("curvas").doc(`impulsor-eq-fabricate-s2`).set(impulsor)
    // impulsor.fab = false
    // impulsor.numSeccion = 1
    // this.afs.collection("proyectos").doc(this.trenTag).collection("equipos").doc(this.equipoTag).collection("curvas").doc(`impulsor-eq-psico-s1`).set(impulsor)
    // impulsor.fab = false
    // impulsor.numSeccion = 2
    // this.afs.collection("proyectos").doc(this.trenTag).collection("equipos").doc(this.equipoTag).collection("curvas").doc(`impulsor-eq-psico-s2`).set(impulsor)

    this.cargarImpulsores()
  }

  seleccionarImpulsorEquivalente(data) {
    this.impEqSel = data;
    this.impSel = -1;
  }


  seleccionarImpulsor(i) {
    this.impSel = i;
  }

  openDialogPolinomios() {
    const dialogRef = this.dialog.open(DialogPolinomiosCurvasCompresorComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  cargarImpulsores() {
    this.afs.collection("proyectos").doc(this.trenTag).collection("equipos").doc(this.equipoTag).collection("curvas").valueChanges().subscribe(curvas => {
      this.curvas = curvas as curva[]
      this.curvas.sort((a,b) => +a.numImpulsor-+b.numImpulsor)
      this.impulsores = this.curvas.slice(2)
      console.log(this.curvas)
      console.log(this.impulsores)
    })
  }
  agregarImpulsor(){
    let impulsor = new curva
    impulsor.numImpulsor = this.impulsores.length -1
    impulsor.ultimoEditor = this.usuario.correo
    this.afs.collection("proyectos").doc(this.trenTag).collection("equipos").doc(this.equipoTag).collection("curvas").doc(`impulsor-${impulsor.numImpulsor}-${this.seccionActual}`).set(impulsor)
  }

  eliminarImpulsor(numImpulsor){
    this.afs.collection("proyectos").doc(this.trenTag).collection("equipos").doc(this.equipoTag).collection("curvas").doc(`impulsor-${numImpulsor}-${this.seccionActual}`).delete()
  }
}
