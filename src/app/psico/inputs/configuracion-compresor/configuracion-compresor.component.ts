import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'configuracion-compresor',
  templateUrl: './configuracion-compresor.component.html',
  styleUrls: ['./configuracion-compresor.component.css']
})
export class ConfiguracionCompresorComponent implements OnInit {

  tabSelected: any;

  constructor() { }

  ngOnInit(): void {
  }

  tabSelect(id: string){
    this.tabSelected = id;
  }
  
}
