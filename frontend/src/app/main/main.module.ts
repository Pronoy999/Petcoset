import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { UiModule } from '../ui/ui.module';
import { SubscriptionComponent } from './subscription/subscription.component';
import { BecomeAPartnerComponent } from './become-a-partner/become-a-partner.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { Constant } from '../core/helper/constant';

export const mainRoute: Routes = [
  { path: '', component: HomeComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'become-a-partnar', component: BecomeAPartnerComponent },
  { path: 'user-profile', component: UserProfileComponent},
]

@NgModule({
  declarations: [HomeComponent, SubscriptionComponent, BecomeAPartnerComponent, UserProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(mainRoute),
    UiModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule
  ],
  providers: [Constant]
})
export class MainModule { }
