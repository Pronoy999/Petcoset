import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService, UserDetails } from 'src/app/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-home-sitting',
  templateUrl: './home-sitting.component.html',
  styleUrls: ['./home-sitting.component.css']
})
export class HomeSittingComponent implements OnInit {

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
  confirmationText = '';
  petWight = [];

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

  serviceProvide(value){
    this.servicesProvidedToValue = value;
    this.isDogSelected = value === 'dog' ? true : false;
    this.isCatSelected = value === 'cat' ? true : false;
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

  initParentForm() {
    this.parentForm = this._formBuilder.group({
      is_bathing_provided: [0],
      service_duration_hours: [1],
      service_charge: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      does_own_dog: [''],
      is_first_aid: [0],
    })
  }

  submitBoarding() {
    this.isSubmitted = true;
    if(this.parentForm.invalid)
      return;
    else{
      this.spinner.show();
      const data = {...this.parentForm.value};
      data.vendor_id = this.userDetails.id;
      data.service_id = 4;
      data.pet_type = this.servicesProvidedToValue;
      data.service_charge = +data.service_charge;
      data.service_duration_hours = 1;
      data.is_bathing_provided = data.is_bathing_provided === true ? 1 : 0;
      data.is_first_aid = data.is_first_aid === true ? 1 : 0;
      data.pet_weight = this.petWight.toString();
      this._authService.request('post', `vendors/service`, data)
        .subscribe((response) => {
          this.spinner.hide();
          Swal.fire({
            text: 'Home sitting is successfully added with your account!',
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
