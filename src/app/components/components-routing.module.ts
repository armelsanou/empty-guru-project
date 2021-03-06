import { ComponentsComponent } from './components.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Module',
      status: false
    },
    children: [
      {
        path: 'components',
        loadChildren: () => import('./components.module').then(m => m.ComponentsModule)
      },
      {
        path: 'home',
        data: {
          breadcrumb: 'Home',
          icon: 'icofont-maximize bg-c-yellow',
          breadcrumb_caption: 'Utilisateurs',
          status: true
        },
        component: HomeComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
