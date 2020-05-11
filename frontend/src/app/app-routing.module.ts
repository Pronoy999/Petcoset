import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AuthGuard } from './auth.guard';
import { UserProfileComponent } from './main/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './auth/auth.module#AuthModule'
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './main/main.module#MainModule'
      }
    ]
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './main/users/users.module#UsersModule'
      }
    ]
  },
  {
    path: 'service',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './main/manage-service/manage-service.module#ManageServiceModule'
      }
    ]
  },
  {
    path: 'vendor',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './main/manage-vendor-service/manage-vendor-service.module#ManageVendorServiceModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
