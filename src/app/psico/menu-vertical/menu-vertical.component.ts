import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'menu-vertical',
  templateUrl: './menu-vertical.component.html',
  styleUrls: ['./menu-vertical.component.css']
})
export class MenuVerticalComponent implements OnInit {

  logo: string = "assets/images/design/logo.svg"
  defaultUserImage: string = "assets/images/design/default-user-image.svg";

  constructor() { }

  ngOnInit(): void {
  }

}

