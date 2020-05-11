import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardingComponent } from './boarding/boarding.component';
import { DropInComponent } from './drop-in/drop-in.component';
import { HomeSittingComponent } from './home-sitting/home-sitting.component';
import { PetWalkingComponent } from './pet-walking/pet-walking.component';
import { GroomingComponent } from './grooming/grooming.component';
import { AdoptionComponent } from './adoption/adoption.component';
import { VeterinaryComponent } from './veterinary/veterinary.component';
import { MattingComponent } from './matting/matting.component';
import { TrainerComponent } from './trainer/trainer.component';
import { DayCareComponent } from './day-care/day-care.component';

export const vendorService: Routes = [
  { path: 'boarding', component: BoardingComponent },
  { path: 'drop-in', component: DropInComponent },
  { path: 'home-sitting', component: HomeSittingComponent},
  { path: 'pet-walking', component: PetWalkingComponent },
  { path: 'grooming', component: GroomingComponent },
  { path: 'adoption', component: AdoptionComponent },
  { path: 'veterinary', component: VeterinaryComponent },
  { path: 'matting', component: MattingComponent },
  { path: 'trainer', component: TrainerComponent },
  { path: 'day-care', component: DayCareComponent },
  { path: '', pathMatch: 'full', redirectTo: 'boarding' }
]

@NgModule({
  declarations: [
    BoardingComponent, 
    DropInComponent, 
    HomeSittingComponent, 
    PetWalkingComponent, 
    GroomingComponent, 
    AdoptionComponent, 
    VeterinaryComponent,
    MattingComponent, 
    TrainerComponent, DayCareComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(vendorService),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ManageVendorServiceModule { }
