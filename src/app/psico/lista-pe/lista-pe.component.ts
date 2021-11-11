import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lista-pe',
  templateUrl: './lista-pe.component.html',
  styleUrls: ['./lista-pe.component.css']
})
export class ListaPeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private afs: AngularFirestore) { }
  proyectoId: string
  trenTag: string
  pruebas;
  anadiendo = false
  nombre = "";

  ngOnInit(): void {
    this.route.parent.params.subscribe((params) => {
      this.proyectoId = params.id
      this.route.params.subscribe((params) => {
        this.trenTag = params.trenTag;
        this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("pruebas-eficiencia").valueChanges({idField: 'id'}).subscribe((pruebas) => {
          pruebas
          console.log(pruebas)
          this.pruebas = pruebas
        })
      })
    })
  }

  async eliminarPrueba(id){
    this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("pruebas-eficiencia").doc(id).delete()
    const qry = await  this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("pruebas-eficiencia").doc(id).collection("puntos").ref.get()
    qry.forEach(doc => {
      doc.ref.delete();
   });
  }

  async anadirPrueba(nombre: string){
    this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("pruebas-eficiencia").doc(nombre).set({
      fechaCreacion: new Date,
      nombre: nombre
    })
  }

}
