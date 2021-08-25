import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurarEquipoComponent } from './configurar-equipo/configurar-equipo.component';
import { EnvioDataComponent } from './envio-data/envio-data.component';
import { ImportCsvComponent } from './import-csv/import-csv.component';
import { ConfiguracionTrenComponent } from './inputs/configuracion-tren/configuracion-tren.component';
import { InputsComponent } from './inputs/inputs.component';
import { OutputsComponent } from './outputs/outputs/outputs.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { PsicoDashboardComponent } from './psico-dashboard/psico-dashboard.component';


const routes: Routes = [
  {path: 'inputs', component: InputsComponent},
  {path: 'envio', component: EnvioDataComponent},
  {path: 'outputs', component: OutputsComponent},
  {path: 'import-csv', component: ImportCsvComponent},
  {path: 'proyectos', component: ProyectosComponent},
  {path: "proyecto", component:PsicoDashboardComponent, children: [
    {path: 'tren', component: ConfiguracionTrenComponent},
    {path: 'equipo', component: ConfigurarEquipoComponent},

 ]}



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PsicoRoutingModule { }
