import { Component, OnInit, SecurityContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { curva, DataServiceService, equipo, Proyecto } from 'src/app/services/data-service.service';
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

  proyecto: Proyecto;
  equipo: equipo
  impEqSel: string = '';
  impSel: number;
  impulsores: curva[] = []
  filteredImpulsores: curva[] = []
  impusoresEq: curva[] = []
  filteredImpulsoresEq: curva[] = []
  curvas: curva[] = []
  seccionActual: number = 1;
  secciones: number[] = [];
  trenTag;
  nSecciones;
  flagEqFab = false
  flagEqPsico = false

  nombre = ""
  agregando = false


  usuario = JSON.parse(localStorage.getItem("user"))

  constructor(private route: ActivatedRoute, public dialog: MatDialog, public data: DataServiceService, private afs: AngularFirestore) { }

  ngOnInit(): void {
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
            this.secciones = Array(this.nSecciones).fill(0).map((x,i)=>i+1); // [0,1,2,3,4]
            this.cargarImpulsores();
          })
        })
      })
    })
  }

  seleccionarImpulsorEquivalente(data) {
    this.impEqSel = data;
    this.impSel = -1;
  }


  seleccionarImpulsor(i) {
    this.impSel = i;
  }

  openDialogPolinomios(i:number,nombre: string) {
    if(i == 0){
        let impulsor = this.impusoresEq.find(x => x.nombre == nombre)
        console.log(impulsor)
        const dialogRef = this.dialog.open(DialogPolinomiosCurvasCompresorComponent, {
          data: {
            equipoTag: this.equipo.tag,
            proyectoId: this.proyecto.id,
            impulsor: impulsor,
            equivalente: true,
            fab: false,
            seccion: this.seccionActual,
          }
        });
      } else {
      const dialogRef = this.dialog.open(DialogPolinomiosCurvasCompresorComponent, {
        data: {
          equipoTag: this.equipo.tag,
            proyectoId: this.proyecto.id,
            impulsor: this.filteredImpulsores.find(x => x.numImpulsor == i ),
            equivalente: false,
            fab: true,
            seccion: this.seccionActual,
        }
      });
    }
  }

  cargarImpulsores() {
    this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipo.tag).collection<curva>("curvas").valueChanges().subscribe(curvas => {
      this.curvas = curvas
      this.impusoresEq = []
      this.impulsores = []
      for (let index = 0; index < this.curvas.length; index++) {
        const curva: curva = curvas[index];
        if(curva.equivalente == true){
            this.impusoresEq = this.impusoresEq.concat(curva)
        } else {
          this.impulsores = this.impulsores.concat(curva)
        }
      }
      this.filterImpulsores()
    })
  }
  async agregarImpulsor(){
    let impulsor = new curva()
    impulsor.numImpulsor = this.filteredImpulsores.length + 1
    console.log(this.usuario)
    impulsor.ultimoEditor = this.usuario.correo
    impulsor.fab = true
    impulsor.equivalente = false
    impulsor.numSeccion = this.seccionActual
    await this.afs.collection("proyectos")
    .doc(this.proyecto.id)
    .collection("equipos")
    .doc(this.equipo.tag)
    .collection("curvas")
    .doc(`s${this.seccionActual}-impulsor-${impulsor.numImpulsor}`).set({...impulsor})
    this.equipo.nImpulsores[this.seccionActual -1]++
    await this.afs.collection("proyectos")
    .doc(this.proyecto.id)
    .collection("equipos")
    .doc(this.equipo.tag).update({
      nImpulsores: this.equipo.nImpulsores
    })
  }

  async agregarImpulsorEquivalente(nombre: string){
    nombre = nombre.replace(" ","-")
    let impulsor = new curva()
    impulsor.numImpulsor = 1
    impulsor.ultimoEditor = this.usuario.correo
    impulsor.fab = false
    impulsor.equivalente = true
    impulsor.numSeccion = this.seccionActual
    impulsor.nombre = nombre
    await this.afs.collection("proyectos")
    .doc(this.proyecto.id)
    .collection("equipos")
    .doc(this.equipo.tag)
    .collection("curvas")
    .doc(`s${this.seccionActual}-${nombre}`).set({...impulsor})
  }

  eliminarImpulsor(idImpulsor){
    this.afs.collection("proyectos").doc(this.trenTag).collection("equipos").doc(this.equipo.tag).collection("curvas").doc(idImpulsor).delete()
  }

  filterImpulsores(){
    console.log("entre")
    this.filteredImpulsores = this.impulsores.filter(x => x.numSeccion == this.seccionActual).sort((a,b) => +a.numImpulsor - +b.numImpulsor)
    this.filteredImpulsoresEq = this.impusoresEq.filter(x => x.numSeccion == this.seccionActual)
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
}
