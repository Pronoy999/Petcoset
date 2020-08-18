import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiModule } from '../ui/ui.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

export const AuthRoute: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login/:returnUrl', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/:email/:password', component: RegisterComponent },
  { path: 'reset', component: ResetPasswordComponent},
  { path: 'forgetPassword/:id', component: ForgetPasswordComponent},
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
]

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ResetPasswordComponent, ForgetPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AuthRoute),
    FormsModule,
    ReactiveFormsModule,
    UiModule,
    NgOtpInputModule,
  ],
  providers: []
})
export class AuthModule { }
