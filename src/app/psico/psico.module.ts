import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputsComponent } from './inputs/inputs.component';
import { PsicoRoutingModule } from './psico-routing.module';



@NgModule({
  declarations: [
    InputsComponent
  ],
  imports: [
    CommonModule,
    PsicoRoutingModule,
  ]
})
export class PsicoModule { }
