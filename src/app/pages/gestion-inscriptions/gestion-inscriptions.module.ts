import { InscriptionComponent } from './inscription/inscription.component';
import { BlankInscriptionComponent } from './blank-inscription/blank-inscription.component';
import { EtudiantComponent } from './etudiant/etudiant.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionInscriptionsComponent } from './gestion-inscriptions.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';
import { SharedModule } from './../../shared/shared.module';
import { GestionInscriptionsRoutingModule } from './gestion-inscriptions-routing.module';
import { PaiementComponent } from './paiement/paiement.component';
import { BanqueComponent } from './banque/banque.component';
import { DepartementComponent } from './departement/departement.component';
import { DroitUniversitaireComponent } from './droit-universitaire/droit-universitaire.component';
import { PaysComponent } from './pays/pays.component';
import { RegionComponent } from './region/region.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TinymceModule } from 'angular2-tinymce';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch';
import { TagInputModule } from 'ngx-chips';
import { NgxEchartsModule } from 'ngx-echarts';
import {SelectModule} from 'ng-select';
import { SelectOptionService } from './../../shared/element/select-option.service';
import { DatePipe } from '@angular/common';
import {Ng2TelInputModule} from 'ng2-tel-input';

@NgModule({
  imports: [
    CommonModule,
    GestionInscriptionsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTableModule,
    Ng2SearchPipeModule,
    DataTableModule,
    TinymceModule,
    NgxDatatableModule,
    UiSwitchModule,
    TagInputModule,
    NgxEchartsModule,
    SelectModule,
    Ng2TelInputModule
  ],
  declarations: [
    GestionInscriptionsComponent,
    BlankInscriptionComponent,
    EtudiantComponent,
    InscriptionComponent,
    PaiementComponent,
    BanqueComponent,
    DepartementComponent,
    DroitUniversitaireComponent,
    PaysComponent,
    RegionComponent
  ],
  providers: [SelectOptionService, DatePipe]
})
export class GestionInscriptionsModule { }
