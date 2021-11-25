import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MenuComponent } from './menu/menu.component';

// Responsive
import { FlexLayoutModule } from '@angular/flex-layout';

// ANGULAR MATERIAL
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {TextFieldModule} from '@angular/cdk/text-field'
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatBadgeModule} from '@angular/material/badge';
import {MatExpansionModule} from '@angular/material/expansion';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatMenuModule} from '@angular/material/menu';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatSliderModule} from '@angular/material/slider';
import {MatListModule} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatStepperModule} from '@angular/material/stepper';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatTreeModule} from '@angular/material/tree';
import {CdkTreeModule} from '@angular/cdk/tree';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const components = [
  MenuComponent,
];

const modules = [
  CommonModule,
  RouterModule,
  MatToolbarModule,
  MatIconModule,
  LayoutModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatMenuModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  FlexLayoutModule,
  DragDropModule,
  ReactiveFormsModule,
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  TextFieldModule,
  MatIconModule,
  MatButtonToggleModule,
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatSnackBarModule,
  MatTabsModule,
  MatBadgeModule,
  MatExpansionModule,
  ClipboardModule,
  MatMenuModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatRadioModule,
  MatSliderModule,
  MatListModule,
  MatTooltipModule,
  MatStepperModule,
  DragDropModule,
  MatTreeModule,
  CdkTreeModule,
  NgbModule,
  HttpClientModule
];

@NgModule({
  declarations: [
  ...components    
  ],
  imports: [
    ...modules,
  ],
  exports: [
    ...components,
    ...modules,   
  ],
})
export class SharedModule {}