import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService, outputTrenTeorico, simulacionTeorica, simulacionTrenTeorica } from 'src/app/services/data-service.service';
import { SimulacionTeoricaComponent } from '../simulacion-teorica/simulacion-teorica.component';


@Component({
  selector: 'app-lista-st',
  templateUrl: './lista-st.component.html',
  styleUrls: ['./lista-st.component.css']
})
export class ListaStComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, 
    private afs: AngularFirestore,
    public data: DataServiceService,
    public dialog: MatDialog
    ) { }

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
    let punto: simulacionTrenTeorica = new simulacionTrenTeorica
    let timestamp = +new Date
    punto = {
      simId: timestamp.toString(),
      simTimestamp: timestamp,
      simDate: new Date(timestamp),
      nombre: nombre,
      outputTren: new outputTrenTeorico,
      mapaTren: [],
      simulacion: [],
    }
    this.afs.collection("proyectos").doc(this.proyectoId).collection("trenes").doc(this.trenTag).collection("simulaciones-teoricas").doc(punto.simId).set({
      ...JSON.parse(JSON.stringify(punto))
    })
  }

  openSimulacion(simId){
    const dialogRef = this.dialog.open(SimulacionTeoricaComponent, {
      data: {
        simId: simId,
        proyectoId: this.proyectoId,
        trenTag: this.trenTag,
      }
    })
  }
}
