import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputValidationComponent } from './input-validation/input-validation.component';

@NgModule({
  declarations: [CardComponent, InputFieldComponent, InputValidationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [CardComponent, InputFieldComponent, InputValidationComponent]
})
export class UiModule { }
