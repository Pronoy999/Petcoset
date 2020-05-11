import { AuthenticationService } from './../../authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RequiredValidator } from 'src/app/core/validator/required.validator';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  parentForm: FormGroup;
  isLoginError = false;

  constructor(
    private _formBuilder: FormBuilder,
    private route: Router,
    private spinner: NgxSpinnerService,
    private _authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.initLoginForm();
  }

  initLoginForm() {
    this.parentForm = this._formBuilder.group({
      email: ['', Validators.compose([RequiredValidator('Email id is required')])],
      password: ['', Validators.compose([RequiredValidator('Password is required')])]
    })
  }

  loginSubmit() {
    if(this.parentForm.status === 'INVALID') {
      this.markFormGroupTouched(this.parentForm)
    } else {
      this.spinner.show();
      const data = {...this.parentForm.value};
      data.email_id = data.email;
      data.password = btoa(data.password)
      delete data.email;
      console.log('data', data);
      this._authService.request('post', `auth`, data) 
        .subscribe((response) => {
          console.log(response);
          this.isLoginError = response.res.user_data.id === -1 ? true : false;
          if(this.isLoginError)
            this.spinner.hide();
          else{
            this._authService.setToken(response.res.jw_token);
            localStorage.setItem('userDetails',JSON.stringify(response.res.user_data));
            this.route.navigateByUrl('admin/dashboard');
            this.spinner.hide();
          }
        })
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
