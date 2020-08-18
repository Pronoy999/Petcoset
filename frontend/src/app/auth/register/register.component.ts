import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { RequiredValidator } from 'src/app/core/validation/required.validator';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthenticationService } from 'src/app/authentication.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

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
  registerForm: FormGroup;
  userOtpValue;
  otpError = '';
  registrationError = '';
  public isChecked: boolean;
  public email: string;
  public password: string;

  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private authService: AuthenticationService,
    private route: Router,
    private active: ActivatedRoute,
    private ngZone: NgZone,
    private changeDedectionRef: ChangeDetectorRef,
  ) { 
    this.isChecked = true;
  }

  ngAfterViewChecked() {
    this.changeDedectionRef.detectChanges();
  }

  ngOnInit() {
    this.initForm();
    this.email = this.active.snapshot.params.email;
    this.password = this.active.snapshot.params.password;
    if(this.email && this.password) {
      console.log('email ', this.password);
      this.registerForm.patchValue({
        email: this.email !== undefined ? this.email : 'Enter valid email id',
        password: this.password !== undefined ? this.password : 'Password',
        confirmPassword: this.password !== undefined ? this.password : 'Confirm Password'
      });
    }
  }

  initForm = () => {
    this.registerForm = this._formBuilder.group({
      first_name: ['', Validators.compose([RequiredValidator('First Name is required')])],
      last_name: ['', Validators.compose([RequiredValidator('First Name is required')])],
      mobileNo: ['', Validators.compose([RequiredValidator('Mobile Number is required')])],
      gender: ['', Validators.compose([RequiredValidator('Gender is required')])],
      email: ['', Validators.compose([RequiredValidator('Email is required')])],
      password: ['', Validators.compose([RequiredValidator('Password is required'),Validators.pattern("(?=^.{6,16}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?&gt;.&lt;,])(?!.*\\s).*$")])],
      confirmPassword: ['', Validators.compose([RequiredValidator('Confirm password is required')])],
      termsCondition: ['']
    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    });
  }

  setValueToRegistrationForm = () => {
    if(this.email && this.password) {
      console.log('email ', this.email);
      this.registerForm.patchValue({
        email: this.email !== undefined ? this.email : 'Enter valid email id',
        password: this.password !== undefined ? this.password : 'Password',
        confirmPassword: this.password !== undefined ? this.password : 'Confirm Password'
      });
    }
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

  /**
   * CONFIGURATION FOR OTP FIELD
   */
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: true,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  /**
   * METHOD TO GET OTP PROVIDED BY USER:
   * @param otp 
   */
  onOtpChange(otp) {
    this.userOtpValue = otp;
  }


  register() {
    console.log(this.registerForm.value);
    if(this.registerForm.invalid) 
      this.markFormGroupTouched(this.registerForm);
    else {
      this.spinner.show();
      this.userMobileNumber = `+91${this.registerForm.controls.mobileNo.value}`;
      this.isChecked = this.registerForm.controls.termsCondition.value === true ? true : false;
      if(this.userMobileNumber && this.isChecked) {
        let data = {};
        data['phone_number'] = this.userMobileNumber;
        this.authService.request('post', `auth/otp`, data)
          .subscribe(response => {
            if(response.res === true){
              this.displayCount = 2;
              this.spinner.hide();
            }
          });
      } else {
        this.isChecked = false;
        this.spinner.hide();
      }
    }
  }

  /**
   * METHOD TO CREATE CUSTOMER ACCOUNT AFTER OTP VAERFICATION
   */
  createAccount = () => {
    /**
     *API CALL TO VERIFY OTP PROVIDED BY USER:
     */
    this.spinner.show();
    const otpData = {};
    otpData['phone_number'] = this.userMobileNumber;
    otpData['otp'] = this.userOtpValue; 
    this.authService.request('put','auth/otp', otpData)
      .subscribe(res => {
        if(res.res === true) {
          this.otpError = '';
          const data = {...this.registerForm.value};
          data.first_name = this.registerForm.controls.first_name.value;
          data.last_name = this.registerForm.controls.last_name.value;
          data.phone_number = this.userMobileNumber;
          data.email = this.registerForm.controls.email.value;
          data.password = btoa(this.registerForm.controls.password.value);
          data.gender = this.registerForm.controls.gender.value;
          this.authService.request('post',`customers`,data)
            .subscribe(response => {
              if(response.res.customer_id !== -1) {
                this.customerId = response.res.customer_id;
                this.registrationError = '';
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
                this.registrationError = 'This phone number is already register!';
                this.spinner.hide();
              }
            });
        } else {
          this.otpError = 'Invalid OTP';
          this.spinner.hide();
        }
      });
  }

}
