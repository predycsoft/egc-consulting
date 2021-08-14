import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputsComponent } from './inputs/inputs.component';
import { PsicoRoutingModule } from './psico-routing.module';
import { ImportCsvComponent } from './import-csv/import-csv.component';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { NgxChartsModule }from '@swimlane/ngx-charts';

import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    InputsComponent,
    ImportCsvComponent
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
