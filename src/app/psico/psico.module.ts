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
    OutputsComponent
  ],
  imports: [
    CommonModule,
    PsicoRoutingModule,
    NgxCsvParserModule,
    FormsModule,
    NgxChartsModule,
    SharedModule,
  ]
})
export class PsicoModule { }
