
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { equipo_tren } from 'src/app/services/data-service.service';
import { IconServiceService } from 'src/app/services/icon-service.service';


@Component({
  selector: 'app-dialog-agregar-equipo',
  templateUrl: './dialog-agregar-equipo.component.html',
  styleUrls: ['./dialog-agregar-equipo.component.css']
})
export class DialogAgregarEquipoComponent implements OnInit {

  equipo: equipo_tren = new equipo_tren()
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAgregarEquipoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: equipo_tren,
    public fb: FormBuilder,
    public icon: IconServiceService
  ) { }


  ngOnInit(): void {
    console.log(this.data)
    this.form = this.fb.group({
      tag: ['', Validators.required],
      orden: [0, Validators.required],
      familia: ['', Validators.required],
      tipologia: ['', Validators.required],
    })

    if(this.data) {
      this.form.patchValue({
        tag: this.data.tag,
        orden: this.data.orden,
        familia: this.data.familia,
        tipologia: this.data.tipologia,
      })
    }

    this.data = new equipo_tren()
  }

  guardar() {
    this.equipo = this.form.value
    this.dialogRef.close(this.equipo);
  }

}
