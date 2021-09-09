import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-duplicar-nuevo-tag',
  templateUrl: './dialog-duplicar-nuevo-tag.component.html',
  styleUrls: ['./dialog-duplicar-nuevo-tag.component.css']
})
export class DialogDuplicarNuevoTagComponent implements OnInit {

  tag: string;

  constructor(public matDialogRef: MatDialogRef<DialogDuplicarNuevoTagComponent> ){ }

  ngOnInit(): void {
  }

  guardar() {
    this.matDialogRef.close(this.tag);
  }

}
