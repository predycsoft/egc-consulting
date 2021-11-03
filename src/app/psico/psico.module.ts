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
import { MapasCompresorComponent } from './compresor/mapas-compresor/mapas-compresor.component';
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
import { ConfigurarEquipoComponent } from './proyectos/configurar-equipo/configurar-equipo.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { DialogDocumentoComponent } from './dialogs/dialog-documento/dialog-documento.component';
import { CurvasCompresorComponent } from './compresor/curvas-compresor/curvas-compresor.component';
import { InfoGeneralCompresor } from './compresor/info-general-compresor/info-general-compresor.component';
import { DialogPolinomiosCurvasCompresorComponent } from '../psico/compresor/dialog-polinomios-curvas-compresor/dialog-polinomios-curvas-compresor.component';
import { EnvioDataComponent } from './envio-data/envio-data.component';
import { HttpClientModule } from '@angular/common/http';
import { ListaTrenesComponent } from './proyectos/lista-trenes/lista-trenes.component';
import { DialogNuevoTrenComponent } from './proyectos/dialog-nuevo-tren/dialog-nuevo-tren.component';
import { DialogLibreriaCromatografiasComponent } from './inputs/dialog-libreria-cromatografias/dialog-libreria-cromatografias.component';
import { DialogDuplicarNuevoTagComponent } from './proyectos/dialog-duplicar-nuevo-tag/dialog-duplicar-nuevo-tag.component';
import { DialogLibreriaEquiposComponent } from './dialog-libreria-equipos/dialog-libreria-equipos.component';
import { DialogMapaCompresorComponent } from './compresor/dialog-mapa-compresor/dialog-mapa-compresor.component';
import { ChartsModule } from 'ng2-charts';
import { GoogleChartsModule } from 'angular-google-charts';
import { SimulacionCampoInputComponent } from './simulacion-campo-input/simulacion-campo-input.component';
import { SimulacionCampoComponent } from './compresor/simulacion-campo/simulacion-campo.component';
import { SimulacionCampoListaComponent } from './compresor/simulacion-campo-lista/simulacion-campo-lista.component';
import { SimulacionCampoDashboardComponent } from './compresor/simulacion-campo-dashboard/simulacion-campo-dashboard.component';
import { SimulacionCampoDialogResultadosComponent } from './compresor/simulacion-campo-dialog-resultados/simulacion-campo-dialog-resultados.component';
import { ReporteSumarioSeccionComponent } from './reportes/reporte-sumario-seccion/reporte-sumario-seccion.component';
import { ReporteSumarioInputsComponent } from './reportes/reporte-sumario-inputs/reporte-sumario-inputs.component';
import { ReportePuntoComponent } from './reportes/reporte-punto/reporte-punto.component';
import { ReportePuntoSumarioComponent } from './reportes/reporte-punto-sumario/reporte-punto-sumario.component';
import { CompresorDimsComponent } from './compresor/compresor-dims/compresor-dims.component';

@NgModule({
  declarations: [
    InputsComponent,
    ImportCsvComponent,
    CromatografiaComponent,
    DatasheetPuntosCompresorComponent,
    CaracteristicasTurbinaComponent,
    MapasCompresorComponent,
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
    EnvioDataComponent,
    ListaTrenesComponent,
    DialogNuevoTrenComponent,
    DialogLibreriaCromatografiasComponent,
    DialogDuplicarNuevoTagComponent,
    DialogLibreriaEquiposComponent,
    DialogMapaCompresorComponent,
    SimulacionCampoInputComponent,
    SimulacionCampoComponent,
    SimulacionCampoListaComponent,
    SimulacionCampoDashboardComponent,
    SimulacionCampoDialogResultadosComponent,
    ReporteSumarioSeccionComponent,
    ReporteSumarioInputsComponent,
    ReportePuntoComponent,
    ReportePuntoSumarioComponent,
    CompresorDimsComponent
  ],
  imports: [
    CommonModule,
    PsicoRoutingModule,
    NgxCsvParserModule,
    FormsModule,
    NgxChartsModule,
    SharedModule,
    HttpClientModule,
    GoogleChartsModule.forRoot(),
  ]
})
export class PsicoModule { }
