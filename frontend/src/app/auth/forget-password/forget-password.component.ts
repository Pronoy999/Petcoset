import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { RequiredValidator } from 'src/app/core/validation/required.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  public parentForm: FormGroup;
  public token: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private active: ActivatedRoute
  ) {
    this.token = active.snapshot.params.id;
   }

  ngOnInit() {
    this.initParentForm();
  }

  initParentForm = () => {
    this.parentForm = this._formBuilder.group({
      password: ['',Validators.compose([RequiredValidator('Password is required'),Validators.pattern("(?=^.{6,16}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?&gt;.&lt;,])(?!.*\\s).*$")])],
      confirmPassword: ['', Validators.compose([RequiredValidator('Confirm Password is required')])]
    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    }
    );
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

  submitParentForm = () => {
    if(this.parentForm.invalid) 
      this.markFormGroupTouched(this.parentForm);
    else {
      this.spinner.show();
      const data = {...this.parentForm.value};
      data.password = btoa(data.password);
      data.password_token = this.token;
      data.email_id = localStorage.getItem('fgei');

      delete data.confirmPassword;
      console.log(data);
      this._authService.request('put', `auth/password`, data)
        .subscribe(response => {
          this.spinner.hide();
          Swal.fire({
            text: 'Password updated successfully!',
            icon: 'success',
            confirmButtonText: 'Okay',
            width: 400,
            allowOutsideClick: false
          }).then(result => {
            if(result.value) {
              this.router.navigateByUrl('/auth/login');
            }
          })
        });
    }
  }

}
