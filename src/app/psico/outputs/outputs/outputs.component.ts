import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-outputs',
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.css']
})
export class OutputsComponent implements OnInit {

  tabSelected: any;

  constructor() { }

  ngOnInit(): void {
  }

  tabSelect(id: string){
    this.tabSelected = id;
  }
}