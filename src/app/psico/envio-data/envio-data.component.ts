import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-envio-data',
  templateUrl: './envio-data.component.html',
  styleUrls: ['./envio-data.component.css']
})
export class EnvioDataComponent implements OnInit {

  usuario = localStorage.getItem("user");
  secret_key = "pasaporte";

  constructor(public http: HttpClient) { }
  // url = "https://egc-consulting-server.uc.r.appspot.com"
  url = "http://127.0.0.1:5000/"
  prueba = {
    usuario: this.usuario,
    secret_key: this.secret_key,
    mensaje: "andres ve esta vaina"
  }
  body;

  ngOnInit(): void {
    this.http.post(this.url,JSON.stringify(this.prueba)).subscribe(res => {
      console.log(res)
    })
  }

}
