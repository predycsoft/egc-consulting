import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'dialog-libreria-cromatografias',
  templateUrl: './dialog-libreria-cromatografias.component.html',
  styleUrls: ['./dialog-libreria-cromatografias.component.css']
})
export class DialogLibreriaCromatografiasComponent implements OnInit {

  cromatografias;
  filteredCromatografias;

  constructor(private afs: AngularFirestore,
    public dialogRef: MatDialogRef<DialogLibreriaCromatografiasComponent>,
    @Inject(MAT_DIALOG_DATA) public dataEnviada
    ) { }

  ngOnInit(): void {
    this.getCromatografias()
  }

  getCromatografias(){
    this.afs.collection("proyectos").doc(this.dataEnviada.proyectoId).collection("cromatografias").valueChanges().subscribe((cromatogafia) => {
      let arr = []
       Object.keys(cromatogafia).map(function(key) {
        arr.push(cromatogafia[key])
        return arr
       })
       this.cromatografias = arr
       this.cromatografias.sort((a, b) => +a.fechaCreacion - +b.fechaCreacion);
       this.filteredCromatografias = this.cromatografias
       console.log(this.cromatografias)
    })

  }

  seleccionar(cromatografia){
    this.dialogRef.close(cromatografia)
  }

}
