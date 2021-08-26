import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'configuracion-turbina',
  templateUrl: './configuracion-turbina.component.html',
  styleUrls: ['./configuracion-turbina.component.css']
})
export class ConfiguracionTurbinaComponent implements OnInit {

  tabSelected: any;

  constructor() { }

  ngOnInit(): void {
  }

  tabSelect(id: string){
    this.tabSelected = id;
  }
  
}
