import { RouterModule, Routes } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardingComponent } from './boarding/boarding.component';
import { ShearedModule } from 'src/app/sheared/sheared.module';

export const serviceRoute: Routes = [
  { path: 'boarding', component: BoardingComponent }
]

@NgModule({
  declarations: [BoardingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(serviceRoute),
    ShearedModule
  ]
})
export class ManageServiceModule { }
