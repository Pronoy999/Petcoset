import { Router } from '@angular/router';
import  Swal  from 'sweetalert2';
import { RequiredValidator } from 'src/app/core/validation/required.validator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  parentForm: FormGroup

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initParentForm();
  }

  initParentForm = () => {
    this.parentForm = this._formBuilder.group({
      email: ['', Validators.compose([RequiredValidator('Email id is required')])]
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  submitParentForm = () => {
    if(this.parentForm.invalid)
      this.markFormGroupTouched(this.parentForm);
    else {
      this.spinner.show();
      const data = {...this.parentForm.value};
      data.is_prod = 1;
      data.email_id = data.email;

      delete data.email;
      this._authService.request('post', `auth/password`, data)
        .subscribe(response => {
          this.spinner.hide();
          console.log('response ', response);
          Swal.fire({
            text: 'Email sent to your registered mail id!',
            icon: 'success',
            confirmButtonText: 'Okay',
            width: 400,
            allowOutsideClick: false
          }).then(result => {
            if(result.value) {
              localStorage.setItem('fgei', this.parentForm.controls.email.value);
              this.router.navigateByUrl('/auth/login');
            }
          })
        });
    }
  }

}
