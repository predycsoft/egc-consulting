import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { DataServiceService, Usuario } from 'src/app/services/data-service.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private data: DataServiceService, private storage: AngularFireStorage, public dialog: DialogService) { }

  usuario: Usuario
  imgUsuario="./assets/images/design/default-user-image.svg";
  modificarFoto = 0;

  ngOnInit(): void {
    this.data.obtenerUsuario().subscribe(data => {
      console.log(data)
      this.usuario = data
    })
  }

  async updateUsuario(){
    try {
      await this.data.updateUsuario(this.usuario.id, this.usuario);
      localStorage.setItem("user",JSON.stringify(this.usuario))
      this.dialog.dialogExito()
    } catch (err) {
      console.log(err);
      this.dialog.dialogFracaso()
    }
  }
  cambiarFoto(event, campo) {
    const file = event.target.files[0];
    const filePath = `Usuarios/${this.usuario.correo}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`Usuarios/${this.usuario.correo}`, file);
    task
      .snapshotChanges().pipe(
        finalize(() => {
          const downloadURL = fileRef.getDownloadURL();
          downloadURL.subscribe(url => {
            if (campo == "foto") {
              this.usuario.foto = url;
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

}
