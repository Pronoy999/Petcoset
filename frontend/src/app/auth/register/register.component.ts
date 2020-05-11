import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RequiredValidator } from 'src/app/core/validation/required.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup
  constructor(
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.registerForm = this._formBuilder.group({
      mobileNo: ['', Validators.compose([RequiredValidator('Mobile Number is required')])],
      email: ['', Validators.compose([RequiredValidator('Email is required')])],
      password: ['', Validators.compose([RequiredValidator('Password is required'), Validators.minLength(6), Validators.maxLength(16)])]
    })
  }
  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  register() {
    if(this.registerForm.invalid) 
      this.markFormGroupTouched(this.registerForm);
    else {
      console.log('register form', this.registerForm.value );
    }
  }

}
