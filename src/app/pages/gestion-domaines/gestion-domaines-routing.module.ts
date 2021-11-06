import { BlankDomaineComponent } from './blank-domaine/blank-domaine.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClasseComponent } from './classe/classe.component';
import { CycleComponent } from './cycle/cycle.component';
import { DomaineComponent } from './domaine/domaine.component';
import { FiliereComponent } from './filiere/filiere.component';
import { NiveauComponent } from './niveau/niveau.component';
import { SousDomaineComponent } from './sous-domaine/sous-domaine.component';
import { SpecialiteComponent } from './specialite/specialite.component';
import { CycleDomaineComponent } from './cycle-domaine/cycle-domaine.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Gestion des domaines',
      status: false
    },
    children: [
      {
        path: 'gestion-domaines',
        loadChildren: () => import('./gestion-domaines.module').then(m => m.GestionDomainesModule)
      },
      {
        path: 'blank-domaine',
        component: BlankDomaineComponent,
        data: {
          breadcrumb: 'Accueil gestion des domaines',
          icon: 'icofont icofont-file-document bg-c-pink',
          breadcrumb_caption: 'Bienvenue dans le module d\'administration des domaines.',
          status: true
        }
      },
      {
        path: 'domaines',
        data: {
          breadcrumb: 'Domaines',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Domaines',
          status: true
        },
        component: DomaineComponent
      },
      {
        path: 'sous-domaines',
        data: {
          breadcrumb: 'Sous-domaines',
          icon: 'icofont-chart-histogram bg-c-blue',
          breadcrumb_caption: 'Sous-domaines',
          status: true
        },
        component: SousDomaineComponent
      },
      {
        path: 'cycles',
        data: {
          breadcrumb: 'Cycles',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les cycles',
          status: true
        },
        component: CycleComponent
      },
      {
        path: 'cycles-domaines',
        data: {
          breadcrumb: 'Cycles Et Domaines',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Associer les cycles et les domaines',
          status: true
        },
        component: CycleDomaineComponent
      },
      {
        path: 'filieres',
        data: {
          breadcrumb: 'Gérer les filières',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les filières',
          status: true
        },
        component: FiliereComponent
      },
      {
        path: 'classes',
        data: {
          breadcrumb: 'Gérer les classes',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les classes',
          status: true
        },
        component: ClasseComponent
      },
      {
        path: 'niveaux',
        data: {
          breadcrumb: 'Gérer les niveaux',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les niveaux',
          status: true
        },
        component: NiveauComponent
      },
      {
        path: 'specialites',
        data: {
          breadcrumb: 'Gérer les specialites',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les specialités',
          status: true
        },
        component: SpecialiteComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionDomainesRoutingModule { }
