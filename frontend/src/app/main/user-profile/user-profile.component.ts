import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  vendorFreelancerForm: FormGroup;
  myProfileServiceForm: FormGroup;
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
  constructor(
    private _formbuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: Router
  ) { }

  ngOnInit() {
    this.initVendorFreelancerForm();
    this.initMyProfileForm();
  }

  selectProfileType(value) {
    switch(value) {
      case 'details':
        this.selectProfileTypeCount = 1;
        this.detailsSelected = true;
        this.profileSelected = false;
        this.serviceSelected = false;
        this.previousCaesSelected = false;
        break;
      case 'profile' :
        this.selectProfileTypeCount = 2;
        this.detailsSelected = false;
        this.profileSelected = true;
        this.serviceSelected = false;
        this.previousCaesSelected = false;
        break;
      case 'service' :
        this.selectProfileTypeCount = 3;
        this.detailsSelected = false;
        this.profileSelected = false;
        this.serviceSelected = true;
        this.previousCaesSelected = false;
        break;
      case 'pervious-case' :
        this.selectProfileTypeCount = 4;
        this.detailsSelected = false;
        this.profileSelected = false;
        this.serviceSelected = false;
        this.previousCaesSelected = true;
        break;
    }
  }

  selectType(value) {
    this.isSelected = true;
    this.isSubmitted = false;
    this.isGenderSelected = false;
    this.isCompanySelected = value === 3 ? true : false;
    this.isFreelancerSelected = value === 2 ? true : false;
    switch (value) {
      case 2:
        this.selectedFormType = 2;
        break;
      case 3:
        this.selectedFormType = 3;
        break;
    }
  }

  backPage() {
    this.selectedFormType = 0;
    this.isSelected = false;
  }

  selectedGender(value) {
    this.isMaleSelected = value === 'male' ? true : false;
    this.isFemaleSelected = value === 'female' ? true : false;

    if (!this.isMaleSelected || !this.isFemaleSelected)
      this.gender = value;
  }

  initMyProfileForm() {
    this.myProfileServiceForm = this._formbuilder.group({
      service: ['', Validators.compose([Validators.required])]
    })
  }

  initVendorFreelancerForm() {
    this.vendorFreelancerForm = this._formbuilder.group({
      name: [''],
      type: [''],
      gender: [''],
      phoneNo: [''],
      email: [''],
      otherNumber: [''],
      location: ['',Validators.compose([Validators.required])],
      addressLineOne: ['', Validators.compose([Validators.required])],
      addressLineTwo: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      pincode: ['', Validators.compose([Validators.required])],
      companyBrand: ['', Validators.compose([Validators.required])],
      gstNumber: [''],
      bankAccountNo: ['', Validators.compose([Validators.required])],
      accountType: ['', Validators.compose([Validators.required])],
      IFCSCode: ['', Validators.compose([Validators.required])],
      beneficiary: ['', Validators.compose([Validators.required])],
    });
    this.setValueToForm();
  }

  setValueToForm() {
    this.vendorFreelancerForm.patchValue({
      phoneNo: '8481057774',
      email: 'banerjee4785@gmail.com'
    })
  }

  submitVendor() {
    console.log('vendor freelancer value ', this.vendorFreelancerForm.value);
    this.isSubmitted = true;
    this.isGenderSelected = this.gender === '' ? true : false;
    if(this.vendorFreelancerForm.invalid)
      return;
    else{
      if (!this.isGenderSelected) {
        this.spinner.show();
      }
    }
  }

  selectedService (value){
    this.vendorService = value;
  }

  serviceSubmit() {
    console.log('service button clicked');
    this.isProfileFormSubmitted = true;
    if(this.myProfileServiceForm.invalid) 
      return;
    else {
      switch(this.vendorService) {
        case 'boarding' :
          this.route.navigateByUrl('/vendor/boarding');
          break;
        case 'drop-in' :
          this.route.navigateByUrl('/vendor/drop-in');
          break;
        case 'home-sitting' :
          this.route.navigateByUrl('/vendor/home-sitting');
          break;
        case 'pet-walking' :
          this.route.navigateByUrl('/vendor/pet-walking');
          break;
        case 'grooming' :
          this.route.navigateByUrl('/vendor/grooming');
          break;
        case 'adoption' :
          this.route.navigateByUrl('/vendor/adoption');
          break;
      }
    }
  }

}
