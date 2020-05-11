import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { RouterModule, Routes } from '@angular/router';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { UiModule } from 'src/app/ui/ui.module';
import { VendorVerifiedComponent } from './vendor-verified/vendor-verified.component';

export const vendorRoute: Routes = [
  { path: 'vendor-list', component: VendorListComponent },
  { path: 'vendor-verified-list', component: VendorVerifiedComponent },
  { path: 'vendor-details/:id', component: VendorDetailsComponent },
  { path: '', redirectTo: 'vendor-list', pathMatch: 'full' }
]

@NgModule({
  declarations: [VendorListComponent, VendorDetailsComponent, VendorVerifiedComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(vendorRoute),
    FormsModule,
    ReactiveFormsModule,
    UiModule
  ]
})
export class VendorModule { }
