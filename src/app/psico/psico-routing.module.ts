import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurarEquipoComponent } from './proyectos/configurar-equipo/configurar-equipo.component';
import { EnvioDataComponent } from './envio-data/envio-data.component';
import { ImportCsvComponent } from './import-csv/import-csv.component';
import { ConfiguracionTrenComponent } from './proyectos/configuracion-tren/configuracion-tren.component';
import { InputsComponent } from './inputs/inputs.component';
import { ListaProyectosComponent } from './proyectos/lista-proyectos/lista-proyectos.component';
import { PsicoDashboardComponent } from './psico-dashboard/psico-dashboard.component';
import { ListaTrenesComponent } from '../psico/proyectos/lista-trenes/lista-trenes.component';
import { SimulacionCampoInputComponent } from './simulacion-campo-input/simulacion-campo-input.component';
import { SimulacionTeoricaComponent } from './compresor/simulacion-teorica/simulacion-teorica.component';
import { SimulacionCampoComponent } from './compresor/simulacion-campo/simulacion-campo.component';


const routes: Routes = [
  {path: 'inputs', component: InputsComponent},
  {path: 'envio', component: EnvioDataComponent},
  {path: 'import-csv', component: ImportCsvComponent},
  {path: 'proyectos', component: ListaProyectosComponent},
  {path: "proyecto/:id", component:PsicoDashboardComponent, children: [
    {path: 'trenes', component:ListaTrenesComponent},
    {path: 'tren/:trenTag', component: ConfiguracionTrenComponent},
    {path: 'equipo/:trenTag/:equipoTag', component: ConfigurarEquipoComponent},
    {path: 'simulacion-input/:trenTag/:equipoTag', component: SimulacionCampoInputComponent},
    {path: 'tren/:trenTag/sim-teorica', component: SimulacionTeoricaComponent},
    {path: 'tren/:trenTag/sim-campo', component: SimulacionCampoComponent},

    
    

 ]}



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PsicoRoutingModule { }
