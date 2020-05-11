import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService, UserDetails } from 'src/app/authentication.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-pet-walking',
  templateUrl: './pet-walking.component.html',
  styleUrls: ['./pet-walking.component.css']
})
export class PetWalkingComponent implements OnInit {

  parentForm: FormGroup;
  isDogSelected = false;
  isCatSelected = false;
  isLookAfterOneClicked = false;
  isLookAfterTwoClicked = false;
  isLookAfterThreeClicked = false;
  isLookAfterFourClicked = false;
  isSubmit = false;
  walkingValue;
  userDetails: UserDetails;
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
    this.isDogSelected = value === '1' ? true : false;
    this.isCatSelected = value === '2' ? true : false;
    this.walkingValue = value;
  }

  lookAfterClicked(value) {
    console.log(value)
    this.isLookAfterOneClicked = value === 1 ? true : false;
    this.isLookAfterTwoClicked = value === 2 ? true : false;
    this.isLookAfterThreeClicked = value === 3 ? true : false;
    this.isLookAfterFourClicked = value === 4 ? true : false; 
  }

  initParentForm() {
    this.parentForm = this._formBuilder.group({
      service_charge: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])]
    });
  }

  submitMatting() {
    this.isSubmit = true;
    if(this.parentForm.invalid)
      return;
    else{
      this.spinner.show();
      const data = {...this.parentForm.value};
      data.service_duration_hours = +this.walkingValue;
      data.vendor_id = this.userDetails.id;
      data.service_id = 7;
      data.service_charge = +data.service_charge;
      this._authService.request('post', `vendors/service`, data)
      .subscribe((response) => {
        this.spinner.hide();
        Swal.fire({
          text: 'Pet walking is successfully added with your account!',
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
