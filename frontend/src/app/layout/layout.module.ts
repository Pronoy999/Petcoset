import { FooterComponent } from './main-layout/footer/footer.component';
import { TopbarComponent } from './main-layout/topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';


@NgModule({
  declarations: [MainLayoutComponent, TopbarComponent, FooterComponent, AuthLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
})
export class LayoutModule { }
