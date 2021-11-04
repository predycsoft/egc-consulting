import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { cromatografia, DataServiceService } from 'src/app/services/data-service.service';
import { DialogLibreriaCromatografiasComponent } from '../dialog-libreria-cromatografias/dialog-libreria-cromatografias.component';

class propiedadesCromatografia{
    // Propiedades calculadas del gas
    presion: number = 0; //input
    temperatura: number = 0; //input
    densidad: number;
    volumen: number;
    entalpia: number;
    entropia: number;
    pesoMolecular: number;
    compresibilidad: number;
    calidad: number;
    LHV: number;
    HHV: number;
    gravedadEspecifica: number;
    wi: number
}

@Component({
  selector: 'cromatografia',
  templateUrl: './cromatografia.component.html',
  styleUrls: ['./cromatografia.component.css']
})
export class CromatografiaComponent implements OnInit {

  proyectoId: string = '';
  nombreCromatografia: string = '';
  cromatografiaOriginal = new cromatografia;
  cromatografiaNormalizada = new cromatografia;
  propidadesCromatografia = new propiedadesCromatografia();
  fraccMolarOriginal: number = 0;
  fraccMolarNorm: number = 0;
  constructor(private dialog: MatDialog, public data: DataServiceService, private afs: AngularFirestore,
    public dialogRef: MatDialogRef<CromatografiaComponent>,
    @Inject(MAT_DIALOG_DATA) public dataEnviada) { }

  ngOnInit(): void {
     this.proyectoId = this.dataEnviada.proyectoId
  }

  normalizar() {
    this.cromatografiaOriginal.fraccMolar = 0
    this.cromatografiaNormalizada.fraccMolar = 0
    this.cromatografiaOriginal.fraccMolar = +this.cromatografiaOriginal.metano + +this.cromatografiaOriginal.etano + +this.cromatografiaOriginal.propano + +this.cromatografiaOriginal.iButano + +this.cromatografiaOriginal.nButano + +this.cromatografiaOriginal.iPentano + +this.cromatografiaOriginal.nPentano + +this.cromatografiaOriginal.hexano + +this.cromatografiaOriginal.heptano + +this.cromatografiaOriginal.octano + +this.cromatografiaOriginal.nonano + +this.cromatografiaOriginal.decano + +this.cromatografiaOriginal.nitrogeno  + +this.cromatografiaOriginal.dioxCarbono + +this.cromatografiaOriginal.sulfHidrogeno
    this.cromatografiaNormalizada.metano = this.cromatografiaOriginal.metano/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.etano = this.cromatografiaOriginal.etano/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.propano = this.cromatografiaOriginal.propano/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.iButano = this.cromatografiaOriginal.iButano/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.nButano = this.cromatografiaOriginal.nButano/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.iPentano = this.cromatografiaOriginal.iPentano/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.nPentano = this.cromatografiaOriginal.nPentano/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.hexano = this.cromatografiaOriginal.hexano/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.heptano = this.cromatografiaOriginal.heptano/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.octano = this.cromatografiaOriginal.octano/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.nonano = this.cromatografiaOriginal.nonano/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.decano = this.cromatografiaOriginal.decano/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.dioxCarbono = this.cromatografiaOriginal.dioxCarbono/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.nitrogeno = this.cromatografiaOriginal.nitrogeno/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.sulfHidrogeno = this.cromatografiaOriginal.sulfHidrogeno/this.cromatografiaOriginal.fraccMolar;
    this.cromatografiaNormalizada.fraccMolar = +this.cromatografiaNormalizada.metano + +this.cromatografiaNormalizada.etano + +this.cromatografiaNormalizada.propano + +this.cromatografiaNormalizada.iButano + +this.cromatografiaNormalizada.nButano + +this.cromatografiaNormalizada.iPentano + +this.cromatografiaNormalizada.nPentano + +this.cromatografiaNormalizada.hexano + +this.cromatografiaNormalizada.heptano + +this.cromatografiaNormalizada.octano + +this.cromatografiaNormalizada.nonano + +this.cromatografiaNormalizada.decano + +this.cromatografiaNormalizada.nitrogeno  + +this.cromatografiaNormalizada.dioxCarbono + +this.cromatografiaNormalizada.sulfHidrogeno
  }

  guardarCromatografia(){
    this.nombreCromatografia = this.nombreCromatografia.replace(" ","-")
    this.nombreCromatografia = this.nombreCromatografia.replace(",","-")
    this.nombreCromatografia = this.nombreCromatografia.replace(".","-")
    this.nombreCromatografia = this.nombreCromatografia.replace("@","-")
    this.afs.collection("proyectos").doc(this.proyectoId).collection("cromatografias").doc(this.nombreCromatografia).set({
      nombre: this.nombreCromatografia,
      cromatografiaOriginal: JSON.parse(JSON.stringify(this.cromatografiaOriginal)),
      cromatografiaNormalizada: JSON.parse(JSON.stringify(this.cromatografiaNormalizada)),
    })
  }

  returnZero() {
    return 0
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  openLibreriaCromatografias(){
    const dialogRef = this.dialog.open(DialogLibreriaCromatografiasComponent, {
    });
  }


}
