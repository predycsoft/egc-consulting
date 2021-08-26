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
import { DatasheetPuntosCompresorComponent } from './compresor/datasheet-puntos-compresor/datasheet-puntos-compresor.component';
import { CaracteristicasTurbinaComponent } from './turbina/caracteristicas-turbina/caracteristicas-turbina.component';
import { SimulacionTeoricaComponent } from './compresor/simulacion-teorica/simulacion-teorica.component';
import { MapasCompresorComponent } from './compresor/mapas-compresor/mapas-compresor.component';
import { AdimensionalizacionComponent } from './compresor/adimensionalizacion/adimensionalizacion.component';
import { ConfiguracionCompresorComponent } from './compresor/configuracion-compresor/configuracion-compresor.component';
import { ConfiguracionTurbinaComponent } from './turbina/configuracion-turbina/configuracion-turbina.component';
import { ConfiguracionTrenComponent } from './proyectos/configuracion-tren/configuracion-tren.component';
import { DatosTecnicosCompresorComponent } from './compresor/datos-tecnicos-compresor/datos-tecnicos-compresor.component';
import { DialogAgregarEquipoComponent } from './proyectos/dialog-agregar-equipo/dialog-agregar-equipo.component';
import { PsicoDashboardComponent } from './psico-dashboard/psico-dashboard.component';
import { ListaProyectosComponent } from './proyectos/lista-proyectos/lista-proyectos.component';
import { DialogsComponent } from './dialogs/dialogs.component';
import { DialogConfirmarComponent } from './dialogs/dialog-confirmar/dialog-confirmar.component';
import { DialogExitoComponent } from './dialogs/dialog-exito/dialog-exito.component';
import { DialogFracasoComponent } from './dialogs/dialog-fracaso/dialog-fracaso.component';
import { DialogNuevoProyectoComponent } from './proyectos/dialog-nuevo-proyecto/dialog-nuevo-proyecto.component';
import { MenuVerticalComponent } from './menu-vertical/menu-vertical.component';
import { ConfigurarEquipoComponent } from './configurar-equipo/configurar-equipo.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { DialogDocumentoComponent } from './dialogs/dialog-documento/dialog-documento.component';
import { CurvasCompresorComponent } from './compresor/curvas-compresor/curvas-compresor.component';
import { InfoGeneralCompresor } from './compresor/info-general-compresor/info-general-compresor.component';
import { DialogPolinomiosCurvasCompresorComponent } from '../psico/compresor/dialog-polinomios-curvas-compresor/dialog-polinomios-curvas-compresor.component';
import { EnvioDataComponent } from './envio-data/envio-data.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    InputsComponent,
    ImportCsvComponent,
    CromatografiaComponent,
    DatasheetPuntosCompresorComponent,
    CaracteristicasTurbinaComponent,
    SimulacionTeoricaComponent,
    MapasCompresorComponent,
    AdimensionalizacionComponent,
    ConfiguracionCompresorComponent,
    ConfiguracionTurbinaComponent,
    ConfiguracionTrenComponent,
    DatosTecnicosCompresorComponent,
    DialogAgregarEquipoComponent,
    PsicoDashboardComponent,
    ListaProyectosComponent,
    DialogsComponent,
    DialogConfirmarComponent,
    DialogExitoComponent,
    DialogFracasoComponent,
    DialogNuevoProyectoComponent,
    MenuVerticalComponent,
    ConfigurarEquipoComponent,
    DocumentosComponent,
    DialogDocumentoComponent,
    CurvasCompresorComponent,
    InfoGeneralCompresor,
    DialogPolinomiosCurvasCompresorComponent,
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
