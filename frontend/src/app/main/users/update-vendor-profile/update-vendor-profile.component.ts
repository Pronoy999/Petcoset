import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AuthenticationService, UserDetails } from 'src/app/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-vendor-profile',
  templateUrl: './update-vendor-profile.component.html',
  styleUrls: ['./update-vendor-profile.component.css']
})
export class UpdateVendorProfileComponent implements OnInit {

  vendorFreelancerForm: FormGroup;
  myProfileServiceForm: FormGroup;
  parentForm: FormGroup;
  selectProfileTypeCount = 1;
  isFreelancerSelected = false;
  isCompanySelected = false;
  selectedFormType = 0;
  isSelected = false;
  isMaleSelected = false;
  isFemaleSelected = false;
  gender: string = '';
  isGenderSelected = false;
  isSubmitted = false;
  detailsSelected = true;
  profileSelected = false;
  serviceSelected = false;
  previousCaesSelected = false;
  isProfileFormSubmitted = false;
  vendorService;
  userDetails: UserDetails;
  fullName;
  serviceList = [];
  stateList = [];
  cityList = [];
  vendorDetails = [];
  vendorSelectedServiceList = [];
  serviceImageList = [
    '../../../../assets/images/product/home-1/boarding.png',
    '../../../../assets/images/product/home-1/Drop-In.png',
    '../../../../assets/images/product/home-1/Day-Care.png',
    '../../../../assets/images/product/home-1/Home-Sitting.png',
    '../../../../assets/images/product/home-1/Trainer.png',
    '../../../../assets/images/product/home-1/grooming.png',
    '../../../../assets/images/product/home-1/walking.png',
    '../../../../assets/images/product/home-1/mating.png',
    '../../../../assets/images/product/home-1/veterinary.png',
    '../../../../assets/images/product/home-1/adoption.png'
  ];
  vendorBankDetails = [];
  selectedImgUrl = '';
  vendorBankDetailsForm: FormGroup;
  constructor(
    private _formbuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: Router,
    private _authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.userDetails = this._authService.getUserDetails();
    this.fullName = `${this.userDetails.first_name} ${this.userDetails.last_name}`;
    this.initVendorFreelancerForm();
    this.getStateList();
  }

  initVendorFreelancerForm() {
    this.vendorFreelancerForm = this._formbuilder.group({
      address_1: ['', Validators.compose([Validators.required])],
      address_2: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      pincode: ['', Validators.compose([Validators.required])],
    })
  }

  getStateList() {
    this._authService.request(`get`, `city/state`)
      .subscribe((response) => {
        response.res.forEach(element => {
          this.stateList.push({ code: element.id, value: element.state_name });
        });
      })
  }

  selectedState(value) {
    if (value) {
      this.cityList = [];
      this._authService.request('get', `city?state_id=${value}`)
        .subscribe((response) => {
          response.res.forEach(element => {
            this.cityList.push({ code: element.id, value: element.city_name });
          });
        })
    }
  }

  updateVendor() {
    this.isSubmitted = true;
    if (this.vendorFreelancerForm.invalid)
      return;
    else {
      this.spinner.show();
      const data = { ...this.vendorFreelancerForm.value };
      data.vendor_id = this.userDetails.id;
      data.city = +data.city;
      data.pincode = +data.pincode;
      console.log('updated vendor ', data);
      this._authService.request('put', `vendors`, data)
        .subscribe((response) => {
          this.spinner.hide();
          Swal.fire({
            text: 'Account updated successfully',
            icon: 'success',
            confirmButtonText: 'Okay',
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
