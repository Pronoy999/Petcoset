import { Component, OnInit, Input } from '@angular/core';
export const FormValidationRequired = ' is required';
export const FormValidationEmail = 'Enter valid email';
@Component({
  selector: 'app-input-validation',
  templateUrl: './input-validation.component.html',
  styleUrls: ['./input-validation.component.scss']
})
export class InputValidationComponent implements OnInit {

  @Input() formInput: any;
  @Input() name: string;
  @Input() identifier: string;
  required : string = FormValidationRequired;
	email = FormValidationEmail;
  constructor() { }

  ngOnInit() {
  }

}
