import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';

export const paymentRoute: Routes = [
  {path: 'recurring/:id', component: PaymentComponent},
  {path: '', pathMatch: 'full', redirectTo: 'recurring/:id'},
  {path: '**', pathMatch: 'full', redirectTo: 'recurring/:id'}
]

@NgModule({
  declarations: [PaymentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(paymentRoute)
  ]
})
export class PaymentModule {
  constructor () {
    console.log('this is payment routing page');
  }
 }
