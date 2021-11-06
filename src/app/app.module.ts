import { BrowserModule } from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AdminComponent } from './layout/admin/admin.component';
import { BreadcrumbsComponent } from './layout/admin/breadcrumbs/breadcrumbs.component';
import { TitleComponent } from './layout/admin/title/title.component';
import { AuthComponent } from './layout/auth/auth.component';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ArchivesComponent } from './layout/archives/archives.component';
import { InscriptionComponent } from './layout/inscription/inscription.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ToastyModule } from 'ng2-toasty';
import { GestionDomainesModule } from './pages/gestion-domaines/gestion-domaines.module';
import { GestionInscriptionsModule } from './pages/gestion-inscriptions/gestion-inscriptions.module';
import { DomaineComponent } from './layout/domaine/domaine.component';
import { GestionProgrammesModule } from './pages/gestion-programmes/gestion-programmes.module';
import { ProgrammeComponent } from './layout/programme/programme.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ProgrammeComponent,
    DomaineComponent,
    ArchivesComponent,
    InscriptionComponent,
    BreadcrumbsComponent,
    TitleComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ToastyModule.forRoot(),
    SimpleNotificationsModule,
    GestionProgrammesModule,
    GestionDomainesModule,
    GestionInscriptionsModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
