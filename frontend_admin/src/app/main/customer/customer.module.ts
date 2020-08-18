import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiModule } from 'src/app/ui/ui.module';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';

export const customerRoute: Routes = [
  {path: 'customer-list/:type', component: CustomerListComponent},
  {path: 'customer-details/:type/:id', component: CustomerDetailsComponent},
  {path: '', redirectTo: 'customer-list', pathMatch: 'full'}
]

@NgModule({
  declarations: [CustomerListComponent, CustomerDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(customerRoute),
    FormsModule,
    ReactiveFormsModule,
    UiModule
  ],
  providers: [DatePipe]
})
export class CustomerModule { }
