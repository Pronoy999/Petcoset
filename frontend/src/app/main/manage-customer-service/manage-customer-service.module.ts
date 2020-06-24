import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayCareComponent } from './day-care/day-care.component';
import { DropInComponent } from './drop-in/drop-in.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { BoardingComponent } from './boarding/boarding.component';
import { HomeSittingComponent } from './home-sitting/home-sitting.component';
import { PetWalkingComponent } from './pet-walking/pet-walking.component';
import { GroomingComponent } from './grooming/grooming.component';
import { MatingComponent } from './mating/mating.component';
//import { DatepickerModule } from 'ngx-date-picker';

export const customerService: Routes = [
  { path: 'drop-in', component: DropInComponent },
  { path: 'day-care', component: DayCareComponent },
  { path: 'boarding', component: BoardingComponent },
  {path: 'home-sitting', component: HomeSittingComponent},
  {path: 'grooming', component: GroomingComponent},
  {path: 'mating', component: MatingComponent},
  {path: 'pet-walking', component: PetWalkingComponent},
  { path: '', pathMatch: 'full', redirectTo: 'day-care' }
]

@NgModule({
  declarations: [
    DayCareComponent, 
    DropInComponent, BoardingComponent, HomeSittingComponent, PetWalkingComponent, GroomingComponent, MatingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(customerService),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule 
    //DatepickerModule
  ]
})
export class ManageCustomerServiceModule { }
