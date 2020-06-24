import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RequiredValidator } from 'src/app/core/validation/required.validator';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthenticationService } from 'src/app/authentication.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  displayCount = 1;
  phoneNoRegisterMessage = '';
  userMobileNumber;
  customerId;
  registerForm: FormGroup
  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private authService: AuthenticationService,
    private route: Router
  ) { }

  ngOnInit() {
    this.registerForm = this._formBuilder.group({
      first_name: ['', Validators.compose([RequiredValidator('First Name is required')])],
      last_name: ['', Validators.compose([RequiredValidator('First Name is required')])],
      mobileNo: ['', Validators.compose([RequiredValidator('Mobile Number is required')])],
      gender: ['', Validators.compose([RequiredValidator('Gender is required')])],
      email: ['', Validators.compose([RequiredValidator('Email is required')])],
      password: ['', [Validators.compose([Validators.required,
        Validators.pattern("(?=^.{6,16}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?&gt;.&lt;,])(?!.*\\s).*$")])]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    })
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
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

  register() {
    if(this.registerForm.invalid) 
      this.markFormGroupTouched(this.registerForm);
    else {
      console.log('register form', this.registerForm.value );
      this.spinner.show();
      this.userMobileNumber = `+91${this.registerForm.controls.mobileNo.value}`;
      let data = {... this.registerForm.value};
      data.first_name = this.registerForm.controls.first_name.value;
      data.last_name = this.registerForm.controls.last_name.value;
      data.phone_number = this.userMobileNumber;
      data.email = this.registerForm.controls.email.value;
      data.password = btoa(this.registerForm.controls.password.value);
      data.gender = this.registerForm.controls.gender.value;
      delete data.mobileNo;
      console.log(data, this.registerForm.controls.mobileNo.value);
      this.authService.request('post',`customers`,data).subscribe(
          response =>{
            //console.log(response.res.id);
            this.customerId = response.res.customer_id;
          if(this.customerId !== -1) {
            this.displayCount = 2;
            this.spinner.hide();
            Swal.fire({
              text: 'Registration is successfull, Please login and fill up all required information!',
              icon: 'success',
              confirmButtonText: 'Okay',
              width: 400,
              allowOutsideClick: false
            }).then((result) => {
              if(result.value){
                this.route.navigateByUrl('/auth/login');
              }
            })
          } else {
            console.log('Works');
            this.phoneNoRegisterMessage = 'This Phone Number is already registered!';
            this.spinner.hide();
          }
          }
      )
    }
  }

  // createAccount() {
  //   if(this.userOtpValue !== '') {
  //     this.spinner.show();
  //     const data = {};
  //     data['customer_id'] = this.customerId;
  //     this.authService.request('post', `vendors/2f`, data)
  //       .subscribe((response) => {
  //         this.spinner.hide();
  //         Swal.fire({
  //           text: 'Registration is successfull, Please login and fill up all required information!',
  //           icon: 'success',
  //           confirmButtonText: 'Okay',
  //           width: 400,
  //           allowOutsideClick: false
  //         }).then((result) => {
  //           if(result.value){
  //             this.route.navigateByUrl('/auth/login');
  //           }
  //         })
  //       })
  //   }
  // }

}
