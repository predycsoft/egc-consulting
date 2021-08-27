import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'egc-consulting';

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore){}

  async ngOnInit() {
    document.documentElement.setAttribute('data-theme', 'light');
    this.afAuth.onAuthStateChanged(user => {
      this.afs.collection<any>("usuarios").doc(user.uid).valueChanges().subscribe(usuario => {
        localStorage.setItem("user", JSON.stringify(usuario))
      })
    })
  }

}

