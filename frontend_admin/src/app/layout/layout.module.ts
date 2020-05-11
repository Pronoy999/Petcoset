import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { TopbarComponent } from './main-layout/topbar/topbar.component';
import { FooterComponent } from './main-layout/footer/footer.component';
import { NavbarComponent } from './main-layout/navbar/navbar.component';

@NgModule({
  declarations: [AuthLayoutComponent, MainLayoutComponent, TopbarComponent, FooterComponent, NavbarComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class LayoutModule { }
