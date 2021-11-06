import { BlankProgrammeComponent } from './blank-programme/blank-programme.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypeEvaluationComponent } from './type-evaluation/type-evaluation.component';
import { CategorieueComponent } from './categorieue/categorieue.component';
import { EcComponent } from './ec/ec.component';
import { EnseignantComponent } from './enseignant/enseignant.component';
import { EcUeComponent } from './ec-ue/ec-ue.component';
import { UeComponent } from './ue/ue.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { SemestreComponent } from './semestre/semestre.component';
import { ProgrammeComponent } from './programme/programme.component';
import { EnseignantEcComponent } from './enseignant-ec/enseignant-ec.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Gestion des programmes',
      status: false
    },
    children: [
      {
        path: 'gestion-programmes',
        loadChildren: () => import('./gestion-programmes.module').then(m => m.GestionProgrammesModule)
      },
      {
        path: 'blank-program',
        component: BlankProgrammeComponent,
        data: {
          breadcrumb: 'Accueil gestion des programmes',
          icon: 'icofont icofont-file-document bg-c-pink',
          breadcrumb_caption: 'Bienvenue dans le module d\'administration des programmes.',
          status: true
        }
      },
      {
        path: 'enseignants',
        data: {
          breadcrumb: 'Gérer les enseignants',
          icon: 'icofont-users bg-c-yellow',
          breadcrumb_caption: 'Gérer les enseignants',
          status: true
        },
        component: EnseignantComponent 
      },
      {
        path: 'ec',
        data: {
          breadcrumb: 'Gérer les Ecs',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les ec',
          status: true
        },
        component: EcComponent 
      },
      {
        path: 'ue',
        data: {
          breadcrumb: 'Gérer les ue',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les ue',
          status: true
        },
        component: UeComponent 
      },
      {
        path: 'evaluations',
        data: {
          breadcrumb: 'Gérer les évaluations',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les évaluations',
          status: true
        },
        component: EvaluationComponent 
      },
      {
        path: 'EcUe',
        data: {
          breadcrumb: 'Gérer les ec et ue',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les ec-ue',
          status: true
        },
        component: EcUeComponent 
      },
      {
        path: 'categorieues',
        data: {
          breadcrumb: 'Catégories ue',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les Catégories d\' ue',
          status: true
        },
        component: CategorieueComponent
      },
      {
        path: 'type-evaluation',
        data: {
          breadcrumb: 'Type d\'évaluation',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les types d\'évaluation',
          status: true
        },
        component: TypeEvaluationComponent
      },
      {
        path: 'semestres',
        data: {
          breadcrumb: 'Semestre',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les semestres',
          status: true
        },
        component: SemestreComponent
      },
      {
        path: 'programmes',
        data: {
          breadcrumb: 'Programme',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les programmes',
          status: true
        },
        component: ProgrammeComponent
      },
      {
        path: 'enseignants-ec',
        data: {
          breadcrumb: 'Enseignant Ec',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Gérer les enseignants-ec',
          status: true
        },
        component: EnseignantEcComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionProgrammesRoutingModule { }
