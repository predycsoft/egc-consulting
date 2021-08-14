import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SnackService } from '../services/snack.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth, private snack: SnackService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  Promise<boolean> {
    
    return this.afAuth.currentUser.then(user => {
      if(user){
        return true;
      } else {
        this.snack.authError();
        return false;
      }  
    }).catch(error => {
      console.log(error);
      return false;
    });
      
  }   
}
