import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.css']
})
export class EmailLoginComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth, private fb: FormBuilder, private afs: AngularFirestore, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.minLength(6), Validators.required]
      ],
      passwordConfirm: ['', []]
    });
  }

  form: FormGroup;
  type: 'login' | 'signup' | 'reset' = 'signup';
  loading = false;
  serverMessage: string = '';


  ngOnInit(): void {

  }

  changeType(val: any) {
    this.type = val;
  }

  get isLogin() {
    return this.type === 'login';
  }

  get isSignup() {
    return this.type === 'signup';
  }

  get isPasswordReset() {
    return this.type === 'reset';
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  get passwordDoesMatch() {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  async onSubmit() {
    this.loading = true;

    const email = this.email.value;
    const password = this.password.value;

    try {
      if (this.isLogin) {
        const credential = await this.afAuth.signInWithEmailAndPassword(email, password);
        const userDoc = await this.afs.collection("usuarios").doc(credential.user.uid).ref.get();
        const user = userDoc.data();
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(["/psico/proyectos"])
      }
      if (this.isSignup) {
        const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
        const docRef = this.afs.collection("usuarios").doc(credential.user.uid);
        await docRef.set({
          id: docRef.ref.id,
          correo: email,
          empresa: "",
          especialidad: "",
          fechaCreacion: new Date,
          foto: "",
          nombre: "",
          telefono: "",
        })
        const user = await docRef.ref.get();
        localStorage.setItem('user', JSON.stringify(user.data()));
        this.router.navigate(["/psico/proyectos"])
      }
      if (this.isPasswordReset) {
        await this.afAuth.sendPasswordResetEmail(email);
        this.serverMessage = 'Check your email';
      }
    } catch (err) {
      this.serverMessage = err;
      console.log(err)
    }
    this.loading = false;
  }
}
