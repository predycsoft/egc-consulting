import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportCsvComponent } from './import-csv/import-csv.component';
import { InputsComponent } from './inputs/inputs.component';
import { OutputsComponent } from './outputs/outputs/outputs.component';


const routes: Routes = [
  {path: 'inputs', component: InputsComponent},
  {path: 'outputs', component: OutputsComponent},
  {path: 'import-csv', component: ImportCsvComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PsicoRoutingModule { }
