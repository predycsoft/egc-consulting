import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EmailLoginComponent } from './email-login/email-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    EmailLoginComponent,
    LoginComponent,
    UserProfileComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule, 
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }
