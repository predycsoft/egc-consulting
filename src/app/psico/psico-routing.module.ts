import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputsComponent } from './inputs/inputs.component';


const routes: Routes = [
  {path: 'inputs', component: InputsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PsicoRoutingModule { }
