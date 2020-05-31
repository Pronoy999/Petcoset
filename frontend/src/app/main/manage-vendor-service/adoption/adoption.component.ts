import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService, UserDetails } from 'src/app/authentication.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-adoption',
  templateUrl: './adoption.component.html',
  styleUrls: ['./adoption.component.css']
})
export class AdoptionComponent implements OnInit {

  parentForm: FormGroup;
  isDogSelected = false;
  isCatSelected = false;
  isLookAfterOneClicked = false;
  isLookAfterTwoClicked = false;
  isLookAfterThreeClicked = false;
  isLookAfterFourClicked = false;
  isSubimitted = false;
  petGender;
  userDetails: UserDetails;
  dogBreed = false;
  catBreed = false;
  breedList = [];
  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private _authService: AuthenticationService,
    private route: Router,
  ) { }

  ngOnInit() {
    this.initParentForm();
    this.userDetails = this._authService.getUserDetails();
  }

  serviceProvide(value){
    this.isDogSelected = value === 'M' ? true : false;
    this.isCatSelected = value === 'F' ? true : false;
    this.petGender = value;
  }

  lookAfterClicked(value) {
    this.isLookAfterOneClicked = value === 1 ? true : false;
    this.isLookAfterTwoClicked = value === 2 ? true : false;
    this.isLookAfterThreeClicked = value === 3 ? true : false;
    this.isLookAfterFourClicked = value === 4 ? true : false; 
  }

  selectBreedType(value) {
    this.breedList = [];
    this.dogBreed = value === 'Dog' ? true : false;
    this.catBreed = value === 'Cat' ? true : false;
    this._authService.request('get', `breed?pet_type=${value}`)
      .subscribe((response) => {
        response.res.forEach(element => {
          this.breedList.push({code: element.id, value: element.breed_name});
        });
      });
  }

  initParentForm() {
    this.parentForm = this._formBuilder.group({
      breed: ['', Validators.compose([Validators.required])],
      pet_sex: [''],
      pet_age: [''],
      is_pedigree_certificate: [0],
      is_written_medical_certificate: [0],
      is_immunization_certificate: [0],
      service_charge: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])]
    })
  }

  submitAdoption() {
    console.log(this.parentForm.value);
    this.isSubimitted = true;
    if(this.parentForm.invalid)
      return;
    else {
      this.spinner.show();
      const data = {...this.parentForm.value};
      data.pet_sex = this.petGender;
      data.pet_age = +data.pet_age;
      data.is_pedigree_certificate = data.is_pedigree_certificate === true ? 1 : 0;
      data.is_written_medical_certificate = data.is_written_medical_certificate === true ? 1 : 0;
      data.is_immunization_certificate = data.is_immunization_certificate === true ? 1 : 0;
      data.service_charge = +data.service_charge;
      data.service_duration_hours = 1;
      data.vendor_id = this.userDetails.id;
      data.service_id = 10;
      this._authService.request('post', `vendors/service`, data)
        .subscribe((response) => {
          this.spinner.hide();
          Swal.fire({
            text: 'Adoption is successfully added with your account!',
            icon: 'success',
            confirmButtonText: 'OKay',
            width: 400,
            allowOutsideClick: false
          }).then((result) => {
            if(result.value)
              this.route.navigateByUrl('/user/vendor');
          })
        })
    }
  }

}
