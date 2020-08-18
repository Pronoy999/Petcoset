import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { TrainerComponent } from './trainer/trainer.component';
import { VeterinaryDoctorComponent } from './veterinary-doctor/veterinary-doctor.component';
import { AdoptionComponent } from './adoption/adoption.component';
import { Constant } from 'src/app/core/helper/constant';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

//import { DatepickerModule } from 'ngx-date-picker';

export const customerService: Routes = [
  { path: 'drop-in', component: DropInComponent },
  { path: 'day-care', component: DayCareComponent },
  { path: 'boarding', component: BoardingComponent },
  { path: 'home-sitting', component: HomeSittingComponent },
  { path: 'grooming', component: GroomingComponent },
  { path: 'mating', component: MatingComponent },
  { path: 'pet-walking', component: PetWalkingComponent },
  { path: 'trainer', component: TrainerComponent },
  { path: 'veterinary-doctor', component: VeterinaryDoctorComponent },
  { path: 'adoption', component: AdoptionComponent },
  { path: '', pathMatch: 'full', redirectTo: 'day-care' }
]

@NgModule({
  declarations: [
    DayCareComponent,
    DropInComponent,
    BoardingComponent, 
    HomeSittingComponent, 
    PetWalkingComponent, 
    GroomingComponent,
    MatingComponent,
    TrainerComponent,
    VeterinaryDoctorComponent,
    AdoptionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(customerService),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    AutocompleteLibModule
    //DatepickerModule
  ],
  providers: [
    Constant,
    DatePipe
  ]
})
export class ManageCustomerServiceModule { }
