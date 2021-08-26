import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { tren } from 'src/app/services/data-service.service';

@Component({
  selector: 'dialog-nuevo-tren',
  templateUrl: './dialog-nuevo-tren.component.html',
  styleUrls: ['./dialog-nuevo-tren.component.css']
})
export class DialogNuevoTrenComponent implements OnInit {

  constructor(public matDialogRef: MatDialogRef<DialogNuevoTrenComponent>) { }
  usuario = JSON.parse(localStorage.getItem("user"));
  tren: tren = new tren();

  ngOnInit(): void {
    this.tren.fechaCreacion = new Date();
  }

  guardar() {
    this.matDialogRef.close(this.tren);
  }

}
