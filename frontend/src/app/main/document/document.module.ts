import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentComponent } from './document/document.component';
import { PaymentPolicyComponent } from './payment-policy/payment-policy.component';

const docRouting: Routes = [
  { path: 'document/:type', component: DocumentComponent },
  { path: 'payment-policy', component: PaymentPolicyComponent }
]

@NgModule({
  declarations: [DocumentComponent, PaymentPolicyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(docRouting)
  ]
})
export class DocumentModule { }
