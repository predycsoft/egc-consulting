import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tipo-compresor',
  templateUrl: './tipo-compresor.component.html',
  styleUrls: ['./tipo-compresor.component.css']
})
export class TipoCompresorComponent implements OnInit {


  tag: string;
  modelo: string;
  fabricante: string;
  tipologia: string;
  secciones: number;

  constructor() { }

  ngOnInit(): void {
  }

}
