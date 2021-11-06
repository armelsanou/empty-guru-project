import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsComponent } from './components.component';
import { ComponentsRoutingModule } from './components-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    SharedModule
  ],
  declarations: [
    ComponentsComponent,
    HomeComponent
  ]
})
export class ComponentsModule { }
