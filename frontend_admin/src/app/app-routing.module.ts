import { AuthGuard } from './auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {path: '', loadChildren: './auth/auth.module#AuthModule'}
    ]
  }, 
  {
    path: 'admin',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [
      {path: 'dashboard', canActivate: [AuthGuard], loadChildren: './main/dashboard/dashboard.module#DashboardModule'},
      {path: 'vendor', canActivate: [AuthGuard], loadChildren: './main/vendor/vendor.module#VendorModule'},
      {path: 'customer', canActivate: [AuthGuard], loadChildren: './main/customer/customer.module#CustomerModule'},
      {path: '**', redirectTo: 'dashboard'}
    ]
  },
  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
