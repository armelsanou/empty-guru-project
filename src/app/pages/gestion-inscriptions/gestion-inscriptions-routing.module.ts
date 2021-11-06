import { InscriptionComponent } from './inscription/inscription.component';
import { PaiementComponent } from './paiement/paiement.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlankInscriptionComponent } from './blank-inscription/blank-inscription.component';
import { EtudiantComponent } from './etudiant/etudiant.component';
import {BanqueComponent} from './banque/banque.component';
import {DepartementComponent} from './departement/departement.component';
import {DroitUniversitaireComponent} from './droit-universitaire/droit-universitaire.component';
import {RegionComponent} from './region/region.component';
import { PaysComponent } from './pays/pays.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Gestion des inscriptions',
      status: false
    },
    children: [
      {
        path: 'gestion-inscriptions',
        loadChildren: () => import('./gestion-inscriptions.module').then(m => m.GestionInscriptionsModule)
      },
      {
        path: 'banque',
        data: {
          breadcrumb: 'Banque',
          icon: 'icofont-money bg-c-yellow',
          breadcrumb_caption: 'Banque',
          status: true
        },
        component: BanqueComponent
      },
      {
        path: 'departement',
        data: {
          breadcrumb: 'Département',
          icon: 'icofont-save bg-c-yellow',
          breadcrumb_caption: 'Département',
          status: true
        },
        component: DepartementComponent
      },
      {
        path: 'droit-universitaire',
        data: {
          breadcrumb: 'Droit universitaire',
          icon: 'icofont-save bg-c-yellow',
          breadcrumb_caption: 'Droit universitaire',
          status: true
        },
        component: DroitUniversitaireComponent
      },
      {
        path: 'etudiant',
        data: {
          breadcrumb: 'Etudiants',
          icon: 'icofont-users bg-c-yellow',
          breadcrumb_caption: 'Etudiants',
          status: true
        },
        component: EtudiantComponent
      },
      {
        path: 'inscription',
        data: {
          breadcrumb: 'Inscriptions',
          icon: 'icofont-save bg-c-yellow',
          breadcrumb_caption: 'Inscriptions',
          status: true
        },
        component: InscriptionComponent
      },
      {
        path: 'paiement',
        data: {
          breadcrumb: 'Paiements',
          icon: 'icofont-money bg-c-blue',
          breadcrumb_caption: 'Paiements',
          status: true
        },
        component: PaiementComponent
      },
      {
        path: 'pays',
        data: {
          breadcrumb: 'Pays',
          icon: 'icofont-country bg-c-yellow',
          breadcrumb_caption: 'Pays',
          status: true
        },
        component: PaysComponent
      },
      {
        path: 'region',
        data: {
          breadcrumb: 'Region',
          icon: 'icofont-country bg-c-yellow',
          breadcrumb_caption: 'Region',
          status: true
        },
        component: RegionComponent
      },
      {
        path: 'blank-inscription',
        component: BlankInscriptionComponent,
        data: {
          breadcrumb: 'Accueil gestion des inscriptions',
          icon: 'icofont icofont-file-document bg-c-pink',
          breadcrumb_caption: 'Bienvenue dans le module de gestion des inscriptions',
          status: true
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionInscriptionsRoutingModule { }
