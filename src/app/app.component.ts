import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'egc-consulting';

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', 'light');
  }

}

