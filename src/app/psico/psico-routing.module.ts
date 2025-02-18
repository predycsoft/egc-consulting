import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnvioDataComponent } from './envio-data/envio-data.component';
import { ImportCsvComponent } from './import-csv/import-csv.component';
import { ConfiguracionTrenComponent } from './proyectos/configuracion-tren/configuracion-tren.component';
import { InputsComponent } from './inputs/inputs.component';
import { ListaProyectosComponent } from './proyectos/lista-proyectos/lista-proyectos.component';
import { PsicoDashboardComponent } from './psico-dashboard/psico-dashboard.component';
import { ListaTrenesComponent } from '../psico/proyectos/lista-trenes/lista-trenes.component';
import { SimulacionCampoInputComponent } from './simulacion-campo-input/simulacion-campo-input.component';
import { ReporteSumarioSeccionComponent } from './reportes/reporte-sumario-seccion/reporte-sumario-seccion.component';
import { ReporteSumarioInputsComponent } from './reportes/reporte-sumario-inputs/reporte-sumario-inputs.component';
import { ReportePuntoComponent } from './reportes/reporte-punto/reporte-punto.component';
import { ReportePuntoSumarioComponent } from './reportes/reporte-punto-sumario/reporte-punto-sumario.component';
import { DialogSimCampoComponent } from './compresor/dialog-sim-campo/dialog-sim-campo.component';
import { ListaPeComponent } from './lista-pe/lista-pe.component';
import { ListaStComponent } from './lista-st/lista-st.component';
import { SimulacionTeoricaComponent } from './simulacion-teorica/simulacion-teorica.component';
import { ConfigProyectoComponent } from './config-proyecto/config-proyecto.component';
import { ConfiguracionCompresorComponent } from './compresor/configuracion-compresor/configuracion-compresor.component';
import { SimulacionCampoListaComponent } from './compresor/simulacion-campo-lista/simulacion-campo-lista.component';
import { SimulacionCampoDashboardComponent } from './compresor/simulacion-campo-dashboard/simulacion-campo-dashboard.component';


const routes: Routes = [
  {path: 'inputs', component: InputsComponent},
  {path: 'envio', component: EnvioDataComponent},
  {path: 'import-csv', component: ImportCsvComponent},
  {path: 'proyectos', component: ListaProyectosComponent},
  {path: "proyecto/:id", component:PsicoDashboardComponent, children: [

    {path: '', component:ListaTrenesComponent},
    {path: 'config-proyecto', component:ConfigProyectoComponent},
    {path: 'tren/:trenTag', component: ConfiguracionTrenComponent},


    {path: 'simulacion-input/:trenTag/:equipoTag', component: SimulacionCampoInputComponent},
    {path: 'tren/:trenTag/conf/:equipoTag', component: ConfiguracionCompresorComponent},
    // {path: 'tren/:trenTag/sim-teorica', component: SimulacionTeoricaComponent},


    // Sim campo
    {path: 'tren/:trenTag/sim-campo-lista', component: SimulacionCampoListaComponent},
    {path: 'tren/:trenTag/sim-campo-dashboard', component: SimulacionCampoDashboardComponent},
    // Sim teorica
    {path: 'tren/:trenTag/lista-simulaciones-teoricas', component:ListaStComponent},
    {path: 'tren/:trenTag/simulacion-teorica/:idPrueba', component:SimulacionTeoricaComponent},
    // Prueba efic
    {path: 'tren/:trenTag/lista-pruebas-eficiencia', component:ListaPeComponent},
    {path: 'tren/:trenTag/prueba-eficiencia/:idPrueba', component:DialogSimCampoComponent},





    {path: 'tren/:trenTag/reporte-sumario-seccion', component: ReporteSumarioSeccionComponent},
    {path: 'tren/:trenTag/reporte-sumario-inputs', component: ReporteSumarioInputsComponent},
    {path: 'tren/:trenTag/reporte-punto/:puntoId/:seccion', component: ReportePuntoComponent},
    {path: 'tren/:trenTag/reporte-punto-sumario/:puntoId', component: ReportePuntoSumarioComponent},
 ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PsicoRoutingModule { }
