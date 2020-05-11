import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from './input-field/input-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputValidationComponent } from './input-validation/input-validation.component';
import { InputOptionListComponent } from './input-option-list/input-option-list.component';

@NgModule({
  declarations: [InputFieldComponent, InputValidationComponent, InputOptionListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    InputFieldComponent
  ]
})
export class UiModule { }
