import { Component, OnInit } from '@angular/core';
import { compresorDims, DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'compresor-dims',
  templateUrl: './compresor-dims.component.html',
  styleUrls: ['./compresor-dims.component.css']
})
export class CompresorDimsComponent implements OnInit {

  constructor(public data: DataServiceService) { }

  compresorDims = new compresorDims

  ngOnInit(): void {
  }

}
