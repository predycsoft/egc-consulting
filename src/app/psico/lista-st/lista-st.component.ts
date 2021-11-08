import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-lista-st',
  templateUrl: './lista-st.component.html',
  styleUrls: ['./lista-st.component.css']
})
export class ListaStComponent implements OnInit {

  constructor(private route: ActivatedRoute, private afs: AngularFirestore) { }
  proyectoId: string;
  trenTag: string;
  simulaciones;
  nombre: string = ""
  anadiendo: boolean = false

  ngOnInit(): void {
    this.route.parent.params.subscribe((params) => {
      this.proyectoId = params.id
      this.route.params.subscribe((params) => {
        this.trenTag = params.trenTag;
        this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("simulaciones-teoricas").valueChanges({idField: 'id'}).subscribe((simulaciones) => {
          console.log(simulaciones)
          this.simulaciones = simulaciones
        })
      })
    })
  }

  async eliminarPrueba(id){
    this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("simulaciones-teoricas").doc(id).delete()
  }

  async anadirPrueba(nombre: string){
    this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("simulaciones-teoricas").doc(nombre).set({
      nombre: nombre,
      fechaCreacion: new Date,
      simulaciones: []
    })
  }
}
