import  Swal  from 'sweetalert2';
import { AuthenticationService, UserDetails } from './../../../authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-pet-details',
  templateUrl: './update-pet-details.component.html',
  styleUrls: ['./update-pet-details.component.css']
})
export class UpdatePetDetailsComponent implements OnInit {

  parentForm: FormGroup;
  petDetails;
  petId;
  userDetails: UserDetails;
  breedList = [];
  isDogSelected = false;
  isCatSelected = false;
  selectedPet;
  isMaleSelected = false;
  isFemaleSelected = false;
  isLookAfterOneClicked = false;
  isLookAfterTwoClicked = false;
  isLookAfterThreeClicked = false;
  isLookAfterFourClicked = false;
  petWeight;

  constructor(
    private _formbuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: Router,
    private _authService: AuthenticationService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.userDetails = this._authService.getUserDetails();
    this.petId = this.activatedRoute.snapshot.params.id;
    this.initParentForm();
    this.getPetDetails();
  }

  /**
   * INIT PARENT FORM:
   */
  initParentForm = () => {
    this.parentForm = this._formbuilder.group({
      breed_name: [''],
      pet_age_yr: [''],
      pet_age_mo: [''],
      pet_gender: [''],
      pet_name: [''],
      pet_type: [''],
      pet_weight: [''],
      pet_age_month: ['']
    });
  }

  /**
   * GET DETAILS BY ID
   */
  getPetDetails = () => {
    setTimeout(() => {
      this._authService.request('get', `customers/pet?customer_id=${this.userDetails.id}`)
        .subscribe(response => {
          this.petDetails = response.res.filter(x => x.id === +this.petId);
          this.setValueToForm();
          console.log('pet details ', this.petDetails);
          this.spinner.hide();
        })
    }, 1000);
  }

  /**
   * METHOD TO SET VALUE TO FORM:
   */
  setValueToForm = () => {
    const currentPet = { ...this.petDetails };
    if (currentPet) {
      this.isDogSelected = currentPet[0].pet_type === 'DOG' ? true : false;
      this.isCatSelected = currentPet[0].pet_type === 'CAT' ? true : false;
      this.selectedPet = currentPet[0].pet_type;
      this.isMaleSelected = currentPet[0].pet_gender === 'M' ? true : false;
      this.isFemaleSelected = currentPet[0].pet_gender === 'F' ? true : false;
      this.isLookAfterOneClicked = currentPet[0].pet_weight === "1" ? true : false;
      this.isLookAfterTwoClicked = currentPet[0].pet_weight === "2" ? true : false;
      this.isLookAfterThreeClicked = currentPet[0].pet_weight === "3" ? true : false;
      this.isLookAfterFourClicked = currentPet[0].pet_weight === "4" ? true : false;
      this.petWeight = currentPet[0].pet_weight;
      this.getBreedList();
      this.parentForm.patchValue({
        breed_name: currentPet[0].breed_name,
        pet_age_yr: currentPet[0].pet_age_yr,
        pet_age_month: currentPet[0].pet_age_mo,
        pet_gender: currentPet[0].pet_gender,
        pet_name: currentPet[0].pet_name,
        pet_type: currentPet[0].pet_type,
        pet_weight: currentPet[0].pet_weight
      });
    }
  }

  /**
   * METHOD TO GET UPDATED PET TYPE:
   */
  petType = (value) => {
    this.isDogSelected = value === 'DOG' ? true : false;
    this.isCatSelected = value === 'CAT' ? true : false;
    this.selectedPet = value === 'DOG' ? 'DOG' : 'CAT' 
    if(value) 
      this.getBreedList();
  } 

  /**
   * METHOD TO GET BREED LIST
   */
  getBreedList = () => {
    this._authService.request('get', `breed?pet_type=${this.selectedPet}`)
      .subscribe(response => {
        response.res.forEach(element => {
          this.breedList.push({code: element.id, value: element.breed_name});
        });
      });
  }

  /**
   * METHOD GET UPDATED PET WEIGHT
   */
  lookAfterClicked = (value) =>{
    this.isLookAfterOneClicked = value === 1 ? true : false;
    this.isLookAfterTwoClicked = value === 2 ? true : false;
    this.isLookAfterThreeClicked = value === 3 ? true : false;
    this.isLookAfterFourClicked = value === 4 ? true : false;
    this.petWeight = value;
  }

  /**
   * METHOD TO CLOSE UPDATE PAGE
   */
  closeUpdate = () => {
    this.route.navigateByUrl('/user/customer')
  }

  /**
   * Method to update customer pet details.
   */
  updateCustomerPetDetails = () => {
    Swal.fire({
      title: 'Are you sure to update ?',
      icon: 'warning',
    }).then(result => {
      if(result.value) {
        this.spinner.show();
        const data = {...this.parentForm.value};
        data.customer_id = +this.userDetails.id;
        data.pet_details_id = +this.petId;
        data.pet_type = this.selectedPet;
        data.pet_name = data.pet_name;
        data.breed = +data.breed_name;
        data.pet_age = +data.pet_age_yr;
        data.pet_age_mo = +data.pet_age_month;
        data.weight = +this.petWeight;
        data.is_delete = 0;
        console.log('update details ', data);
        this._authService.request('put', `customers/pet`, data)
          .subscribe(response => {
            this.spinner.hide();
            Swal.fire({
              title: 'updated successfully',
              icon: 'success'
            }).then(res => {
              if(res.value) {
                window.location.reload();
              }
            });
          }, err => {
            Swal.fire({
              text: 'Something went wrong! Please try again leter.',
              icon: 'error',
            }).then(res => {
              if(res.value) 
                window.location.reload();
            })
          });
      }
    });
  }

}
