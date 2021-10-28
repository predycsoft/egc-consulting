import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataServiceService, Proyecto, tren } from 'src/app/services/data-service.service';
import { IconServiceService } from 'src/app/services/icon-service.service';
import { isThisTypeNode } from 'typescript';

@Component({
  selector: 'menu-vertical',
  templateUrl: './menu-vertical.component.html',
  styleUrls: ['./menu-vertical.component.css']
})
export class MenuVerticalComponent implements OnInit {

  selectedTag: string;


  constructor(private data: DataServiceService, public icon: IconServiceService, private route: ActivatedRoute) { }

  usuario = JSON.parse(localStorage.getItem("user"))
  proyecto: Proyecto;
  trenes: tren[];


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params.id)
      this.data.obtenerProyecto(params.id).subscribe(data => {
        this.proyecto = data;
        this.data.getTrenes(params.id).subscribe(trenes => {
          this.trenes = trenes as tren[]
        })
      })
    })
  }
  
  tagSeleccionado(tag){
    this.selectedTag = tag;
  }

}

