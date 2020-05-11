import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinearStepperComponent } from './linear-stepper/linear-stepper.component';

@NgModule({
  declarations: [LinearStepperComponent],
  imports: [
    CommonModule
  ],
  exports: [LinearStepperComponent]
})
export class ShearedModule { }
