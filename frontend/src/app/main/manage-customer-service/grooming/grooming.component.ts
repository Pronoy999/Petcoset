import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { UserDetails, AuthenticationService } from 'src/app/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';


@Component({
  selector: 'app-grooming',
  templateUrl: './grooming.component.html',
  styleUrls: ['./grooming.component.css']
})
export class GroomingComponent implements OnInit {

  parentForm: FormGroup;
  isEditClicked = false;
  isMaleSelected = false;
  isFemaleSelected = false;
  isDogSelected = false;
  isCatSelected = false;
  isOneTimeSelected = false;
  isRepeatSelected = false;
  // isMondaySelected = false;
  // isTuesdaySelected = false;
  // isWednesdaySelected = false;
  // isThursdaySelected = false;
  // isFridaySelected = false;
  // isSaturdaySelected = false;
  // isSundaySelected = false;
  isMoreThanThreeTimeSelected = false;
  breedList = [];
  petGender;
  petWeightId;
  openform = false;
  selectProfileTypeCount = 0;
  newPetDetails = false;
  newDayCareDetails = false;
  dateValue: Date [];
  chosenDay: string = 'Tuesday';
  multiSelectDate: Boolean = true;
  isLookAfterOneClicked = false;
  isLookAfterTwoClicked = false;
  isLookAfterThreeClicked = false;
  isLookAfterFourClicked = false;
  userDetails: UserDetails;
  isSubmitted = false;
  //SelectedDays = Array<{id: number, name: string}>();
  isDaysSelected = [];
  days = [];
  
  serviceSelectionIntervalValue;
  servicesProvidedToValue;
  imageUploadErrorMessage1 = '';
  imageUploadErrorMessage2 = '';
  imageUploadErrorMessage3 = '';
  imageUploadErrorMessage4 = '';
  uploadedFileList = ['', '', '', ''];
  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private _authService: AuthenticationService,
    private route: Router
  ) { }

  ngOnInit() {
    this.initDropInForm();
    this.userDetails = this._authService.getUserDetails();
    this.days = [
      {id: 1, name: 'Sun'},
      {id: 2, name: 'Mon'},
      {id: 3, name: 'Tue'},
      {id: 4, name: 'Wed'},
      {id: 5, name: 'Thu'},
      {id: 6, name: 'Fri'},
      {id: 7, name: 'Sat'}
    ];
  }

  setNewPetDetails(value){
    switch (value){
      case 1:
        this.selectProfileTypeCount = 1;
        this.newPetDetails = true;
        this.newDayCareDetails = false;
      break;
      default:
        this.selectProfileTypeCount = 0;
        this.newPetDetails = false;
        this.newDayCareDetails = true;
      break;
    }
  }
  serviceProvide(value) {
    this.breedList = [];
    this.servicesProvidedToValue = value;
    this.isDogSelected = value === 'Dog' ? true : false;
    this.isCatSelected = value === 'Cat' ? true : false;

    this._authService.request('get', `breed?pet_type=${value}`)
      .subscribe((response) => {
        response.res.forEach(element => {
          this.breedList.push({code: element.id, value: element.breed_name});
        });
      });
  }

  genderSelected(value) {
    this.isMaleSelected = value === 'M' ? true : false;
    this.isFemaleSelected = value === 'F' ? true : false;
    this.petGender = value;
  }
  onClickOpenForm(){
    this.openform=true;
  }

  serviceSelectionInterval(value){
    this.serviceSelectionIntervalValue = value;
    this.isOneTimeSelected = value === 'One Time' ? true : false;
    this.isRepeatSelected = value === 'Repeat' ? true : false;
  }

  preferredDaysSelected(value, event){
    
    this.isDaysSelected.push(value);
    event.srcElement.classList.add("selection-border");
    console.log(this.isDaysSelected);
    // this.isMondaySelected = value === 1 ? true : false;
    // this.isTuesdaySelected = value === 2 ? true : false;
    // this.isWednesdaySelected = value === 3 ? true : false;
    // this.isThursdaySelected = value === 4 ? true : false;
    // this.isFridaySelected = value === 5 ? true : false;
    // this.isSaturdaySelected = value === 6 ? true : false;
    // this.isSundaySelected = value === 7 ? true : false;
  }

  changeLocation(){}

  submitPetDetails(){}

  lookAfterClicked(value) {
    this.isLookAfterOneClicked = value === 1 ? true : false;
    this.isLookAfterTwoClicked = value === 2 ? true : false;
    this.isLookAfterThreeClicked = value === 3 ? true : false;
    this.isLookAfterFourClicked = value === 4 ? true : false;
    this.petWeightId = value;
  }

  initDropInForm() {
    this.parentForm = this._formBuilder.group({
      // service_duration_hours: [1],
      breed: ['', Validators.compose([Validators.required])],
      age_yr: ['', Validators.compose([Validators.required, Validators.maxLength(2)])],
      age_month: ['', Validators.compose([Validators.required, Validators.maxLength(2)])],
      pet_name: ['', Validators.required],
      //service_charge: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      // has_house: [0],
      // is_pets_allowed_on_furniture: [0],
      // is_non_smoking: [0],
      // has_fenced_garden: [0],
      // is_pets_allowed_on_bed: [0],
      // does_own_dog: [0],
      // only_one_booking: [0],
      // does_own_cat: [0],
      // does_own_caged_animals: [0],
      // pet_weight: [0],
      // number_of_visits: [0],
      // is_full_time: [0],
      // is_first_aid: [0],
      // is_bathing_provided: [0],
      // child_age: [0]
    })
  }

  getUploadedDocument() {
    this.spinner.show();
    setTimeout(() => {
      this._authService.request('get', `vendors/images?vendor_id=${this.userDetails.id}&image_type=PET`)
        .subscribe((response) => {
          if(response.res.length > 0) {
            this.uploadedFileList[0] = response.res.filter(x=> x.position === 1)[0].base_url;
            this.uploadedFileList[1] = response.res.filter(x=> x.position === 2)[0].base_url;
            this.uploadedFileList[2] = response.res.filter(x=> x.position === 3)[0].base_url;
            this.uploadedFileList[3] = response.res.filter(x=> x.position === 4)[0].base_url;
            this.spinner.hide();
          } else {
            this.spinner.hide();
          }
        });
    }, 1000);
  }

  uploadImages(event, value) {
    this.spinner.show();
    let file = event.target.files[0];
    console.log('file', file);
    let fileReader = new FileReader();
    switch (value) {
      case 'pic-1':
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
          fileReader.readAsBinaryString(file);
          fileReader.onload = () => this.uploadPetImages(btoa(fileReader.result.toString()), 'pic1', file.type);
        } else {
          this.imageUploadErrorMessage1 = 'PNG/JPGE image file only!';
          this.spinner.hide()
        }
        break;
      case 'pic-2':
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
          fileReader.readAsBinaryString(file);
          fileReader.onload = () => this.uploadPetImages(btoa(fileReader.result.toString()), 'pic2', file.type);
        }
        else {
          this.imageUploadErrorMessage2 = 'PNG/JPGE image file only!';
          this.spinner.hide();
        }
        break;
      case 'pic-3':
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
          fileReader.readAsBinaryString(file);
          fileReader.onload = () => this.uploadPetImages(btoa(fileReader.result.toString()), 'pic3', file.type);
        }
        else {
          this.imageUploadErrorMessage3 = 'PNG/JPGE image file only!';
          this.spinner.hide();
        }
        break;
      case 'pic-4':
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
          fileReader.readAsBinaryString(file);
          fileReader.onload = () => this.uploadPetImages(btoa(fileReader.result.toString()), 'pic4', file.type);
        }
        else {
          this.imageUploadErrorMessage4 = 'PNG/JPGE image file only!';
          this.spinner.hide()
        }
        break;
    }
  }

  uploadPetImages(result, value, type) {
    let pos = 0;
    if (value === 'pic1')
      pos = 1;
    if (value === 'pic2')
      pos = 2;
    if (value === 'pic3')
      pos = 3;
    if (value === 'pic4')
      pos = 4;
    let data = {};
    data['vendor_id'] = this.userDetails.id;
    data['image_type'] = 'PET';
    data['image_data'] = result;
    data['file_extension'] = type.split("/")[1];
    data['position'] = pos;
    this._authService.request('post', `vendors/images`, data)
      .subscribe((response) => {
        console.log('images upload resposne ', response);
        switch (value) {
          case 'pic1':
            this.imageUploadErrorMessage1 = 'Image uploaded Successfully!';
            this.spinner.hide();
            break;
          case 'pic2':
            this.imageUploadErrorMessage2 = 'Image uploaded Successfully!';
            this.spinner.hide();
            break;
          case 'pic3':
            this.imageUploadErrorMessage3 = 'Image uploaded Successfully!';
            this.spinner.hide();
            break;
          case 'pic4':
            this.imageUploadErrorMessage4 = 'Image uploaded Successfully!';
            this.spinner.hide();
            break;
        }
        this.getUploadedDocument();
      });
  }

  submitGrooming() {
    this.isSubmitted = true;
    if (this.parentForm.invalid)
      return;
    else {
      
      this.spinner.show();
      const data = { ...this.parentForm.value };
      console.log(data);
      data.vendor_id = this.userDetails.id;
      data.service_id = 3;
      data.pet_type = this.servicesProvidedToValue;
      data.pet_weight = this.petWeightId;
      data.pet_gender = this.petGender;
      // data.int_input = +data.int_input;
      // data.has_house = data.has_house === true ? 1 : 0;
      // data.is_pets_allowed_on_furniture = data.is_pets_allowed_on_furniture === true ? 1 : 0;
      // data.is_non_smoking = data.is_non_smoking === true ? 1: 0;
      // data.has_fenced_garden = data.has_fenced_garden === true ? 1 : 0;
      // data.is_pets_allowed_on_bed = data.is_pets_allowed_on_bed === true ? 1 : 0;
      // data.does_own_dog = data.does_own_dog === true ? 1: 0;
      // data.only_one_booking = data.only_one_booking === true ? 1: 0;
      // data.does_own_cat = data.does_own_cat === true ? 1 : 0;
      // data.does_own_caged_animals = data.does_own_caged_animals === true ? 1: 0;
      // data.number_of_visits = data.number_of_visits === true ? 1 : 0;
      // data.is_full_time = data.is_full_time === true ? 1 : 0;
      // data.is_first_aid = data.is_first_aid === true ? 1 : 0;
      // data.is_bathing_provided = data.is_bathing_provided === true ? 1 : 0;
      // data.child_age = data.child_age === true ? 1 : 0;

      /*
      this._authService.request('post', `vendors/service`, data)
        .subscribe((response) => {
          this.spinner.hide();
          Swal.fire({
            text: 'Day care is successfully added with your account!',
            icon: 'success',
            confirmButtonText: 'OKay',
            width: 400,
            allowOutsideClick: false
          }).then((result) => {
            if(result.value){
              this.route.navigateByUrl('/user/vendor');
            }
          })
        })
        */
    }
  }

}