import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

export const PasswordRoute: Routes = [
  { path: 'forgetPassword/:id', component: ForgetPasswordComponent },
  { path: '', pathMatch: 'full', redirectTo: 'forgetPassword/:id' },
  { path: '**', pathMatch: 'full', redirectTo: 'forgetPassword/:id' }
]

@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PasswordRoute)
  ]
})
export class ForgetPasswordModule { }
