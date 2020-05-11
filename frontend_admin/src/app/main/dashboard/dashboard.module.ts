import { UiModule } from './../../ui/ui.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';

export const dashboardRoute: Routes = [
  {path: '', component: DashboardComponent}
]

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoute),
    UiModule
  ]
})
export class DashboardModule { }
