import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputType } from './input-field-interface';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() defaultValue: string = '';
  @Input() type: InputType = 'text';
  @Input() placeholder: string = '';
  @Input() name: string = '';
  @Input() readonly: boolean = false;
  @Input() autofocus: boolean = false;
  @Input() autocomplete: boolean = false;
  @Input() identifier: string = '';
  @Input() validation: boolean = false;
  @Input() required: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  ngModelChange(event) {
    this.defaultValue = event;
  }

}
