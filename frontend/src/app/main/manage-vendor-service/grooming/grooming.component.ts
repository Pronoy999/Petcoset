import { Component, OnInit } from '@angular/core';
import { UserDetails, AuthenticationService } from 'src/app/authentication.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grooming',
  templateUrl: './grooming.component.html',
  styleUrls: ['./grooming.component.css']
})
export class GroomingComponent implements OnInit {

  isDogSelected = false;
  isCatSelected = false;
  isLookAfterOneClicked = false;
  isLookAfterTwoClicked = false;
  isLookAfterThreeClicked = false;
  isLookAfterFourClicked = false;
  userDetails: UserDetails;
  isSubmitted = false;
  servicesProvidedToValue;
  parentForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private _authService: AuthenticationService,
    private route: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.initParentForm();
    this.userDetails = this._authService.getUserDetails();
  }

  initParentForm() {
    this.parentForm = this._formBuilder.group({
      is_bathing_provided: [0],
      service_duration_hours: [1],
      service_charge: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      is_massage_provided: [0],
      is_cleaning_provided: [0],
      is_fur_trimming_provided: [0],
      pet_weight: [0]
    })
  }

  serviceProvide(value) {
    this.servicesProvidedToValue = value;
    this.isDogSelected = value === 'dog' ? true : false;
    this.isCatSelected = value === 'cat' ? true : false;
  }

  lookAfterClicked(value) {
    console.log(value)
    this.isLookAfterOneClicked = value === 1 ? true : false;
    this.isLookAfterTwoClicked = value === 2 ? true : false;
    this.isLookAfterThreeClicked = value === 3 ? true : false;
    this.isLookAfterFourClicked = value === 4 ? true : false;
  }

  submitBoarding() {
    this.isSubmitted = true;
    if (this.parentForm.invalid)
      return;
    else {
      this.spinner.show();
      const data = { ...this.parentForm.value };
      data.vendor_id = this.userDetails.id;
      data.service_id = 6;
      data.pet_type = this.servicesProvidedToValue;
      data.service_charge = +data.service_charge
      data.is_bathing_provided = data.is_bathing_provided === true ? 1 : 0;
      data.is_massage_provided = data.is_massage_provided === true ? 1 : 0;
      data.is_cleaning_provided = data.is_cleaning_provided === true ? 1 : 0;
      data.is_fur_trimming_provided = data.is_fur_trimming_provided === true ? 1 : 0;
      this._authService.request('post', `vendors/service`, data)
        .subscribe((response) => {
          this.spinner.hide();
          Swal.fire({
            text: 'Grooming is successfully added with your account!',
            icon: 'success',
            confirmButtonText: 'OKay',
            width: 400,
            allowOutsideClick: false
          }).then((result) => {
            if (result.value)
              this.route.navigateByUrl('/user/vendor');
          })
        })
    }
  }

}
