import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService, UserDetails } from 'src/app/authentication.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css']
})
export class TrainerComponent implements OnInit {

  parentForm: FormGroup;
  userDetails: UserDetails;
  isLookAfterOneClicked = false;
  isLookAfterTwoClicked = false;
  isLookAfterThreeClicked = false;
  isLookAfterFourClicked = false;
  isDogSelected = false;
  isCatSelected = false;
  trainingValue = '';
  isSubmit;
  petWeight = [];
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

  lookAfterClicked(value, pos) {
    if (this.petWeight.indexOf(value) === -1) {
      this.petWeight.push(value);
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
      this.petWeight.splice(this.petWeight.indexOf(value), 1);
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

  serviceProvide(value){
    this.isDogSelected = value === '1' ? true : false;
    this.isCatSelected = value === '2' ? true : false;
    this.trainingValue = value;
  }

  initParentForm() {
    this.parentForm = this._formBuilder.group({
      is_behavioural_modification: [0],
      is_obedience_training: [0],
      is_scientific_training: [0],
      is_agility_training: [0],
      is_therapy_training: [0],
      service_per_week: ['',Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      service_charge: ['',Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])]
    })
  }

  submitTraing() {
    this.isSubmit = true;
    if(this.parentForm.invalid)
      return;
    else {
      this.spinner.show();
      const data = {...this.parentForm.value};
      data.vendor_id = this.userDetails.id;
      data.service_id = 5;
      data.service_charge = +data.service_charge;
      data.is_behavioural_modification = data.is_behavioural_modification === true ? 1 : 0;
      data.is_obedience_training = data.is_obedience_training === true ? 1 : 0;
      data.is_scientific_training = data.is_scientific_training === true ? 1 : 0;
      data.is_agility_training = data.is_agility_training === true ? 1 : 0;
      data.is_therapy_training = data.is_therapy_training === true ? 1 : 0;
      data.service_duration_hours = +this.trainingValue;
      data.service_per_week = +data.service_per_week;
      data.pet_weight = +this.petWeight.toString();
      this._authService.request('post', `vendors/service`, data)
      .subscribe((response) => {
        this.spinner.hide();
        Swal.fire({
          text: 'Trainer is successfully added with your account!',
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
