import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  screenHeight;
  mobileScreentHeight;
  loginFrom: FormGroup;
  isLoginFormSubmitted = false;
  isLoginError = false;
  constructor(
    private _formBuilder: FormBuilder,
    private route: Router,
    private spinner: NgxSpinnerService,
    private _authService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.screenHeight = +screen.height - 143;
    this.mobileScreentHeight = +this.screenHeight;
    this.initLoginFrom();
  }

  initLoginFrom() {
    this.loginFrom = this._formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    })
  }

  loginSubmit() {
    this.isLoginFormSubmitted = true;
    if (this.loginFrom.invalid)
      return;
    else {
      this.spinner.show();
      const data = {... this.loginFrom.value};
      data.email_id = this.loginFrom.controls.email.value;
      data.password = btoa(this.loginFrom.controls.password.value);
      this._authService.request('post', `auth`, data)
        .subscribe((response) => {
          if(response.res.user_data.id === -1){
            this.isLoginError = true;
            this.spinner.hide();
          } else {
            this._authService.setToken(response.res.jw_token);
            localStorage.setItem('userDetails',JSON.stringify(response.res.user_data));
            this.route.navigateByUrl('/user/vendor');
          }
        })
    }
  }

}
