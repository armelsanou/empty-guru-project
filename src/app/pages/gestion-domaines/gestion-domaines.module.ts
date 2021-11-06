import { SharedModule } from '../../shared/shared.module';
import { SpecialiteComponent } from './specialite/specialite.component';
import { NiveauComponent } from './niveau/niveau.component';
import { ClasseComponent } from './classe/classe.component';
import { FiliereComponent } from './filiere/filiere.component';
import { CycleComponent } from './cycle/cycle.component';
import { SousDomaineComponent } from './sous-domaine/sous-domaine.component';
import { DomaineComponent } from './domaine/domaine.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionDomainesComponent } from './gestion-domaines.component';
import { GestionDomainesRoutingModule } from './gestion-domaines-routing.module';
import { BlankDomaineComponent } from './blank-domaine/blank-domaine.component';
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
import { CycleDomaineComponent } from './cycle-domaine/cycle-domaine.component';
import { Ng2TelInputModule } from 'ng2-tel-input';

@NgModule({
  imports: [
    CommonModule,
    GestionDomainesRoutingModule,
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
    GestionDomainesComponent,
    DomaineComponent,
    SousDomaineComponent,
    CycleComponent,
    FiliereComponent,
    ClasseComponent,
    NiveauComponent,
    SpecialiteComponent,
    BlankDomaineComponent,
    CycleDomaineComponent
  ],
})
export class GestionDomainesModule { }
