import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';
import { HttpClientModule } from '@angular/common/http';
import { TinymceModule } from 'angular2-tinymce';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch';
import { TagInputModule } from 'ngx-chips';
import { NgxEchartsModule } from 'ngx-echarts';
import { SelectModule } from 'ng-select';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EnseignantComponent } from './enseignant/enseignant.component';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { EcComponent } from './ec/ec.component';
import { CategorieueComponent } from './categorieue/categorieue.component';
import { TypeEvaluationComponent } from './type-evaluation/type-evaluation.component';
import { EcUeComponent } from './ec-ue/ec-ue.component';
import { GestionProgrammesRoutingModule } from './gestion-programmes-routing.module';
import { BlankProgrammeComponent } from './blank-programme/blank-programme.component';
import { UeComponent } from './ue/ue.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { SemestreComponent } from './semestre/semestre.component';
import { ProgrammeComponent } from './programme/programme.component';
import { EnseignantEcComponent } from './enseignant-ec/enseignant-ec.component';

@NgModule({
  imports: [
    CommonModule,
    GestionProgrammesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTableModule,
    TagInputModule,
    UiSwitchModule,
    NgxDatatableModule,
    TinymceModule,
    NgxEchartsModule,
    SelectModule,
    Ng2SearchPipeModule,
    Ng2TelInputModule
  ],
  declarations: [
    EnseignantComponent,
    EcComponent,
    CategorieueComponent,
    TypeEvaluationComponent,
    EcUeComponent,
    BlankProgrammeComponent,
    UeComponent,
    EvaluationComponent,
    SemestreComponent,
    ProgrammeComponent,
    EnseignantEcComponent
  ],
})
export class GestionProgrammesModule { }
