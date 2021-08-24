import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'curvas',
  templateUrl: './curvas.component.html',
  styleUrls: ['./curvas.component.css']
})
export class CurvasComponent implements OnInit {

  impulsorSeleccionado: number;

  constructor() { }

  ngOnInit(): void {
  }

  seleccionarImpulsor(i){
    this.impulsorSeleccionado = i;
  }

}
