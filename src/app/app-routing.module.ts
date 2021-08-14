import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from './user/auth.guard';

const routes: Routes = [
  // canActivate: [AuthGuard]
  {path: '', component: HomePageComponent, canActivate: [AuthGuard]},
  {path: 'login', loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
  {path: 'psico', loadChildren: () => import('./psico/psico.module').then(m => m.PsicoModule)},  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
