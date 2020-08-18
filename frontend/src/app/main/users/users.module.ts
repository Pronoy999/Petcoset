import { Constant } from 'src/app/core/helper/constant';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateVendorProfileComponent } from './update-vendor-profile/update-vendor-profile.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { UpdateAddressComponent } from './update-address/update-address.component';
import { UpdatePetDetailsComponent } from './update-pet-details/update-pet-details.component';
import { VendorComponent } from './vendor/vendor.component';
import { ViewServiceComponent } from './view-service/view-service.component';

export const userRoute: Routes = [
  { path: 'vendor', component: VendorProfileComponent },
  { path: 'customer', component: CustomerProfileComponent },
  { path: 'update-details/:id', component: UpdateVendorProfileComponent },
  { path: 'update-address/:id', component: UpdateAddressComponent },
  { path: 'update-pet/:id', component: UpdatePetDetailsComponent },
  { path: 'vendor/:id', component: VendorComponent },
  { path: 'service/:id', component: ViewServiceComponent },
  { path: '', pathMatch: 'full', redirectTo: 'vendor' }
];

@NgModule({
  declarations: [VendorProfileComponent, UpdateVendorProfileComponent, CustomerProfileComponent, UpdateAddressComponent, UpdatePetDetailsComponent, VendorComponent, ViewServiceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(userRoute),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    Constant
  ]
})
export class UsersModule {
}
