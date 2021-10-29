import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServiceService, tren } from 'src/app/services/data-service.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DialogNuevoTrenComponent } from '../dialog-nuevo-tren/dialog-nuevo-tren.component';
import { IconServiceService } from 'src/app/services/icon-service.service';
import { ViewChild } from '@angular/core'
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'lista-trenes',
  templateUrl: './lista-trenes.component.html',
  styleUrls: ['./lista-trenes.component.css']
})
export class ListaTrenesComponent implements OnInit {

  constructor(public dialogService: DialogService,private route: ActivatedRoute, private data: DataServiceService, private dialog: MatDialog, public icon: IconServiceService,) { }

  id: string = "";
  trenes: tren[] = [];
  selectedTren: tren = new tren()


  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      console.log(params.id)
      this.id = params.id
      this.data.getTrenes(this.id).subscribe((trenes => {
        this.trenes = trenes as tren[]
      }))
    })
  }

  // context menu function

  @ViewChild('trigger')
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  // 
  


  eliminarTren(tren: tren) {
    this.dialogService.dialogConfirmar().afterClosed().subscribe(res => {
      if (res == true) {
        this.data.eliminarTren(this.id, tren)
      }
    });
  }

  

  openDialogNuevoTren() {
    const dialogRef = this.dialog.open(DialogNuevoTrenComponent);
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        console.log(result)
        await this.data.anexarTren(this.id, result);
        this.dialogService.dialogExito()
      }
    });
  }
}
