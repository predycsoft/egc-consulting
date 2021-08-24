import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-dialog-documento',
  templateUrl: './dialog-documento.component.html',
  styleUrls: ['./dialog-documento.component.css']
})
export class DialogDocumentoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogDocumentoComponent>) { }

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialogRef.close();
  }

}

