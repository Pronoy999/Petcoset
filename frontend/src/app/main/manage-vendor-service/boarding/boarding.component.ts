import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserDetails, AuthenticationService } from 'src/app/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-boarding',
  templateUrl: './boarding.component.html',
  styleUrls: ['./boarding.component.css']
})
export class BoardingComponent implements OnInit {

  parentForm: FormGroup;
  isDogSelected = false;
  isCatSelected = false;
  isLookAfterOneClicked = false;
  isLookAfterTwoClicked = false;
  isLookAfterThreeClicked = false;
  isLookAfterFourClicked = false;
  userDetails: UserDetails;
  isSubmitted = false;
  servicesProvidedToValue;
  petWight = [];
  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private _authService: AuthenticationService,
    private route: Router
  ) { }

  ngOnInit() {
    this.initBoardingForm();
    this.userDetails = this._authService.getUserDetails();
  }

  serviceProvide(value) {
    this.servicesProvidedToValue = value;
    this.isDogSelected = value === 'Dog' ? true : false;
    this.isCatSelected = value === 'Cat' ? true : false;
  }

  lookAfterClicked(value, pos) {
    if (this.petWight.indexOf(value) === -1) {
      this.petWight.push(value);
      if (pos === 1)
        this.isLookAfterOneClicked = true;
      if (pos === 2)
        this.isLookAfterTwoClicked = true;
      if (pos === 3)
        this.isLookAfterThreeClicked = true;
      if (pos === 4)
        this.isLookAfterFourClicked = true;
    }
    else {
      this.petWight.splice(this.petWight.indexOf(value), 1);
      if (pos === 1)
        this.isLookAfterOneClicked = false;
      if (pos === 2)
        this.isLookAfterTwoClicked = false;
      if (pos === 3)
        this.isLookAfterThreeClicked = false;
      if (pos === 4)
        this.isLookAfterFourClicked = false;
    }
  }

  initBoardingForm() {
    this.parentForm = this._formBuilder.group({
      service_duration_hours: [1],
      service_charge: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      has_house: [0],
      is_pets_allowed_on_furniture: [0],
      is_non_smoking: [0],
      has_fenced_garden: [0],
      is_pets_allowed_on_bed: [0],
      does_own_dog: [0],
      only_one_booking: [0],
      does_own_cat: [0],
      does_own_caged_animals: [0],
      pet_weight: [0],
      number_of_visits: [0],
      is_full_time: [0],
      is_first_aid: [0],
      is_bathing_provided: [0],
      child_age: [0]
    })
  }

  submitBoarding() {
    this.isSubmitted = true;
    if (this.parentForm.invalid)
      return;
    else {
      this.spinner.show();
      const data = { ...this.parentForm.value };
      data.vendor_id = this.userDetails.id;
      data.service_id = 1;
      data.pet_type = this.servicesProvidedToValue;
      data.service_charge = +data.service_charge;
      data.has_house = data.has_house === true ? 1 : 0;
      data.is_pets_allowed_on_furniture = data.is_pets_allowed_on_furniture === true ? 1 : 0;
      data.is_non_smoking = data.is_non_smoking === true ? 1 : 0;
      data.has_fenced_garden = data.has_fenced_garden === true ? 1 : 0;
      data.is_pets_allowed_on_bed = data.is_pets_allowed_on_bed === true ? 1 : 0;
      data.does_own_dog = data.does_own_dog === true ? 1 : 0;
      data.only_one_booking = data.only_one_booking === true ? 1 : 0;
      data.does_own_cat = data.does_own_cat === true ? 1 : 0;
      data.does_own_caged_animals = data.does_own_caged_animals === true ? 1 : 0;
      data.number_of_visits = data.number_of_visits === true ? 1 : 0;
      data.is_full_time = data.is_full_time === true ? 1 : 0;
      data.is_first_aid = data.is_first_aid === true ? 1 : 0;
      data.is_bathing_provided = data.is_bathing_provided === true ? 1 : 0;
      data.child_age = data.child_age === true ? 1 : 0;
      data.pet_weight = this.petWight.toString();
      this._authService.request('post', `vendors/service`, data)
        .subscribe((response) => {
          this.spinner.hide();
          Swal.fire({
            text: 'Boarding is successfully added with your account!',
            icon: 'success',
            confirmButtonText: 'OKay',
            width: 400,
            allowOutsideClick: false
          }).then((result) => {
            if (result.value) {
              this.route.navigateByUrl('/user/vendor');
            }
          })
        })
    }
  }

}
