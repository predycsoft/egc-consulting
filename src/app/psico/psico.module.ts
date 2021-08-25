import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputsComponent } from './inputs/inputs.component';
import { PsicoRoutingModule } from './psico-routing.module';
import { ImportCsvComponent } from './import-csv/import-csv.component';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CromatografiaComponent } from './inputs/cromatografia/cromatografia.component';
import { CaracteristicasCompresorComponent } from './inputs/caracteristicas-compresor/caracteristicas-compresor.component';
import { CaracteristicasTurbinaComponent } from './inputs/caracteristicas-turbina/caracteristicas-turbina.component';
import { SimulacionTeoricaComponent } from './inputs/simulacion-teorica/simulacion-teorica.component';
import { MapasComponent } from './inputs/mapas/mapas.component';
import { AdimensionalizacionComponent } from './inputs/adimensionalizacion/adimensionalizacion.component';
import { CompresorComponent } from './outputs/compresor/compresor.component';
import { TurbinaComponent } from './outputs/turbina/turbina.component';
import { OutputsComponent } from './outputs/outputs/outputs.component';
import { ConfiguracionCompresorComponent } from './inputs/configuracion-compresor/configuracion-compresor.component';
import { ConfiguracionTurbinaComponent } from './inputs/configuracion-turbina/configuracion-turbina.component';
import { ConfiguracionTrenComponent } from './inputs/configuracion-tren/configuracion-tren.component';
import { DatosTecnicosCompresorComponent } from './inputs/datos-tecnicos-compresor/datos-tecnicos-compresor.component';
import { DialogAgregarEquipoComponent } from './inputs/dialog-agregar-equipo/dialog-agregar-equipo.component';
import { PsicoDashboardComponent } from './psico-dashboard/psico-dashboard.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { DialogsComponent } from './dialogs/dialogs.component';
import { DialogConfirmarComponent } from './dialogs/dialog-confirmar/dialog-confirmar.component';
import { DialogExitoComponent } from './dialogs/dialog-exito/dialog-exito.component';
import { DialogFracasoComponent } from './dialogs/dialog-fracaso/dialog-fracaso.component';
import { DialogNuevoProyectoComponent } from './dialogs/dialog-nuevo-proyecto/dialog-nuevo-proyecto.component';
import { MenuVerticalComponent } from './menu-vertical/menu-vertical.component';
import { ConfigurarEquipoComponent } from './configurar-equipo/configurar-equipo.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { DialogDocumentoComponent } from './dialogs/dialog-documento/dialog-documento.component';
import { CurvasComponent } from './curvas/curvas.component';
import { TipoCompresorComponent } from './tipo-compresor/tipo-compresor.component';
import { EnvioDataComponent } from './envio-data/envio-data.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    InputsComponent,
    ImportCsvComponent,
    CromatografiaComponent,
    CaracteristicasCompresorComponent,
    CaracteristicasTurbinaComponent,
    SimulacionTeoricaComponent,
    MapasComponent,
    AdimensionalizacionComponent,
    CompresorComponent,
    TurbinaComponent,
    OutputsComponent,
    ConfiguracionCompresorComponent,
    ConfiguracionTurbinaComponent,
    ConfiguracionTrenComponent,
    DatosTecnicosCompresorComponent,
    DialogAgregarEquipoComponent,
    PsicoDashboardComponent,
    ProyectosComponent,
    DialogsComponent,
    DialogConfirmarComponent,
    DialogExitoComponent,
    DialogFracasoComponent,
    DialogNuevoProyectoComponent,
    MenuVerticalComponent,
    ConfigurarEquipoComponent,
    DocumentosComponent,
    DialogDocumentoComponent,
    CurvasComponent,
    TipoCompresorComponent,
    EnvioDataComponent
  ],
  imports: [
    CommonModule,
    PsicoRoutingModule,
    NgxCsvParserModule,
    FormsModule,
    NgxChartsModule,
    SharedModule,
    HttpClientModule,
  ]
})
export class PsicoModule { }
