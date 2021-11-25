import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService } from 'src/app/services/data-service.service';
import { compresorDims, equipo, Proyecto, tren } from 'src/app/services/data-service.service';
import { DimensionesService } from 'src/app/services/dimensiones.service';
import { IconServiceService } from 'src/app/services/icon-service.service';

class datosCompresor{
  
}

@Component({
  selector: 'info-general-compresor',
  templateUrl: './info-general-compresor.component.html',
  styleUrls: ['./info-general-compresor.component.css']
})
export class InfoGeneralCompresor implements OnInit {

  // Datos generales del equipo asociado al proyecto
  proyecto: Proyecto;
  equipo: equipo;
  tren: tren = new tren()
  

  // Datos tecnicos inherentes al modelo de compresor

  //potencia: string;
  //.. 
  //..
  //Se debe completar esta info con enrique


  constructor(
    public data: DataServiceService, private afs: AngularFirestore, public dims: DimensionesService, private route: ActivatedRoute, public icon: IconServiceService
    ) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.data.obtenerProyecto(params.id).subscribe(proyecto => {
        this.proyecto = proyecto
        this.route.params.subscribe(params => {
          this.data.getTren(this.proyecto.id, params.trenTag).subscribe(tren => {
            this.tren = tren
          })
          this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc<equipo>(params.equipoTag).valueChanges().subscribe(equipo => {
            this.equipo = equipo
            console.log(this.equipo)
          })
        })
      })
    })
  }

  guardar(){
    this.afs.collection("proyectos").doc(this.proyecto.id).collection("equipos").doc(this.equipo.tag).set(this.equipo)
  }

}
