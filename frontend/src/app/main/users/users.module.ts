import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VendorProfileComponent} from './vendor-profile/vendor-profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UpdateVendorProfileComponent} from './update-vendor-profile/update-vendor-profile.component';
import {CustomerProfileComponent} from './customer-profile/customer-profile.component';

export const userRoute: Routes = [
  {path: 'vendor', component: VendorProfileComponent},
  {path: 'customer', component: CustomerProfileComponent},
  {path: 'update-details/:id', component: UpdateVendorProfileComponent},
  {path: '', pathMatch: 'full', redirectTo: 'vendor'}
];

@NgModule({
  declarations: [VendorProfileComponent, UpdateVendorProfileComponent, CustomerProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(userRoute),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsersModule {
}
