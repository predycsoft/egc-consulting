import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.css']
})
export class InputsComponent implements OnInit {

  tabSelected: any;

  constructor() { }

  ngOnInit(): void {
  }

  tabSelect(id: string){
    this.tabSelected = id;
  }
  
}
