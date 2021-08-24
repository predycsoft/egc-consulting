import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-psico-dashboard',
  templateUrl: './psico-dashboard.component.html',
  styleUrls: ['./psico-dashboard.component.css']
})
export class PsicoDashboardComponent implements OnInit {

  logo: string = "assets/images/design/logo.svg"
  defaultUserImage: string = "assets/images/design/default-user-image.svg";

  constructor() { }

  ngOnInit(): void {
  }

}
