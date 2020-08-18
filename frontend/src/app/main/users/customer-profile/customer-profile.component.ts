import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, UserDetails } from '../../../authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import Swal from "sweetalert2";
import { forkJoin } from 'rxjs';
import { Constant } from 'src/app/core/helper/constant';

declare const Razorpay: any;

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {

  vendorFreelancerForm: FormGroup;
  myProfileServiceForm: FormGroup;
  addMoreAddressForm: FormGroup;
  parentForm: FormGroup;
  myPetDayCareForm: FormGroup;
  addPetDetailsForm: FormGroup;
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
  addressSelected: boolean = false;
  isPetDetaildSelected: boolean = false;
  isProfileFormSubmitted = false;
  isAddMoreAddress = false;
  customerService;
  userDetails: UserDetails;
  fullName;
  serviceList = [];
  stateList = [];
  cityList = [];
  customerDetails = [];
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
  openform = false;
  isEditClicked = false;
  userGender = '';
  userState = '';
  userCity = '';
  isDocumentSelected = false;
  fileUploadErrorMessage = 'Pdf only(Document mentioned at the time of registration)';
  imgdate: any;
  imageUploadErrorMessage1 = '';
  imageUploadErrorMessage2 = '';
  imageUploadErrorMessage3 = '';
  imageUploadErrorMessage4 = '';
  uploadedFileList = ['', '', '', ''];
  vendorCurrentStatus = '';
  addressList = [];
  addressErrorText = '';
  isDogSelected: boolean = false;
  isCatSelected: boolean = false;
  servicesProvidedToValue;
  breedList = [];
  petGender;
  isLookAfterOneClicked = false;
  isLookAfterTwoClicked = false;
  isLookAfterThreeClicked = false;
  isLookAfterFourClicked = false;
  petWeightId;
  isPetDetailsSubmit: boolean = false;
  petDetails = [];
  petDetailsTextError: string = '';
  bookingDetails = [];
  bookingErrorText = '';
  updatedPhoneNumberError = '';
  bookingId;
  paymentAmount;
  subscriptionDetails = [];

  constructor(
    private _formbuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: Router,
    private _authService: AuthenticationService,
    private constant: Constant,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.spinner.show();
    window.scrollTo(0, 0);
    this.getCustomerDetailsById();
    this.getStateList();
    //this.initVendorFreelancerForm();
    this.initMyProfileForm();
    this.initParentForm();
    this.userDetails = this._authService.getUserDetails();
    this.fullName = `${this.userDetails.first_name} ${this.userDetails.last_name}`;
    this.getService();
    this.initPetDetailsForm();
  }

  onClickOpenForm() {
    this.openform = true;
  }
  selectProfileType(value) {
    switch (value) {
      case 'details':
        this.selectProfileTypeCount = 1;
        this.detailsSelected = true;
        this.profileSelected = false;
        this.serviceSelected = false;
        this.previousCaesSelected = false;
        this.isDocumentSelected = false;
        this.addressSelected = false;
        this.isPetDetaildSelected = false;
        break;
      case 'profile':
        this.selectProfileTypeCount = 2;
        this.detailsSelected = false;
        this.profileSelected = true;
        this.serviceSelected = false;
        this.previousCaesSelected = false;
        this.isDocumentSelected = false;
        this.addressSelected = false;
        this.isPetDetaildSelected = false;
        this.getCustomerBookingDetails();
        break;
      case 'service':
        this.selectProfileTypeCount = 3;
        this.detailsSelected = false;
        this.profileSelected = false;
        this.serviceSelected = true;
        this.previousCaesSelected = false;
        this.isDocumentSelected = false;
        this.addressSelected = false;
        this.isPetDetaildSelected = false;
        break;
      case 'pervious-case':
        this.selectProfileTypeCount = 4;
        this.detailsSelected = false;
        this.profileSelected = false;
        this.serviceSelected = false;
        this.previousCaesSelected = true;
        this.isDocumentSelected = false;
        this.addressSelected = false;
        this.isPetDetaildSelected = false;
        break;
      case 'document':
        this.selectProfileTypeCount = 5;
        this.detailsSelected = false;
        this.profileSelected = false;
        this.serviceSelected = false;
        this.previousCaesSelected = false;
        this.isDocumentSelected = true;
        this.addressSelected = false;
        this.isPetDetaildSelected = false;
        this.getUploadedDocument();
        break;
      case 'address':
        this.selectProfileTypeCount = 6;
        this.detailsSelected = false;
        this.profileSelected = false;
        this.serviceSelected = false;
        this.previousCaesSelected = false;
        this.isDocumentSelected = false;
        this.addressSelected = true;
        this.isPetDetaildSelected = false;
        this.getCustomerAddressList();
        break;
      case 'pet-details':
        this.selectProfileTypeCount = 7;
        this.detailsSelected = false;
        this.profileSelected = false;
        this.serviceSelected = false;
        this.previousCaesSelected = false;
        this.isDocumentSelected = false;
        this.addressSelected = false;;
        this.isPetDetaildSelected = true;
        break;
    }
  }

  initParentForm() {
    this.parentForm = this._formbuilder.group({
      first_name: [''],
      last_name: [''],
      phoneNo: [''],
      email: [''],
      gender: [''],
      address_1: [''],
      address_2: [''],
      //state_name: [''],
      //city_name: [''],
      // pincode: ['']
      // account_number: [''],
      // bank_name: [''],
      // ifsc_code: ['']
    })
  }

  initVendroBankDetailsForm() {
    this.vendorBankDetailsForm = this._formbuilder.group({

    })
  }

  setValueToParentForm() {
    const customer = { ...this.customerDetails };
    console.log('Set Values', customer);
    this.userGender = customer['gender'];
    this.userCity = customer['city_name'];
    this.userState = customer['state_name'];
    if (customer) {
      this.parentForm.patchValue({
        first_name: customer['first_name'],
        last_name: customer['last_name'],
        phoneNo: customer['phone_number'],
        email: customer['email'],
        gender: customer['gender'] === 'M' ? 'Male' : 'Female',
      });
    }
  }

  selectType(value) {
    this.isSelected = true;
    this.isSubmitted = false;
    this.isGenderSelected = false;
    this.isCompanySelected = value === 3;
    this.isFreelancerSelected = value === 2;
    switch (value) {
      case 2:
        this.selectedFormType = 2;
        break;
      case 3:
        this.selectedFormType = 3;
        break;
    }
  }

  getService() {
    this._authService.request(`get`, `services`)
      .subscribe((response) => {
        response.res.forEach(element => {
          if (element.service_type === 'Regular') {
            this.serviceList.push({ code: element.id, value: element.service_name });
          }
        });
      })
  }

  getCustomerDetailsById() {
    setTimeout(() => {
      let customer = this._authService.request(`get`, `customers?customer_id=${this.userDetails.id}`);
      let pet = this._authService.request('get', `customers/pet?customer_id=${this.userDetails.id}`);
      forkJoin([customer, pet]).subscribe((response) => {
        console.log('customer details', response);
        this.customerDetails = response[0].res;
        this.petDetails = response[1].res;
        this.setValueToParentForm();
        /* this.getCustomerPetDetails(); */
        this.spinner.hide();
      }, err => {
        if (err === 403) {
          localStorage.clear();
          this.route.navigateByUrl('/user/customer');
        }
      })
    }, 1000);
  }

  getVendorSelectedServive() {
    this._authService.request('get', `vendors/service?vendor_id=${this.userDetails.id}`)
      .subscribe((response) => {
        this.vendorSelectedServiceList = response.res;
      })
  }

  getSelectedImg(value) {
    if (value === 'Home Sitting')
      return this.selectedImgUrl = this.serviceImageList[3];
    if (value === 'Groomer')
      return this.selectedImgUrl = this.serviceImageList[5];
    if (value === 'Boarding')
      return this.selectedImgUrl = this.serviceImageList[0];
    if (value === 'Day Care')
      return this.selectedImgUrl = this.serviceImageList[2];
    if (value === 'Drop In')
      return this.selectedImgUrl = this.serviceImageList[1];
    if (value === 'Trainer')
      return this.selectedImgUrl = this.serviceImageList[4];
    if (value === 'Walking')
      return this.selectedImgUrl = this.serviceImageList[6];
    if (value === 'Mating')
      return this.selectedImgUrl = this.serviceImageList[7];
    if (value === 'Veterinary')
      return this.selectedImgUrl = this.serviceImageList[8];
    if (value === 'Adoption')
      return this.selectedImgUrl = this.serviceImageList[9]
  }

  backPage() {
    this.selectedFormType = 0;
    this.isSelected = false;
    this.isEditClicked = false;
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
    console.log('works');
  }

  setValueToForm() {
    const vendor = { ...this.customerDetails };
    if (vendor) {
      this.vendorFreelancerForm.patchValue({
        phoneNo: '8481057774',
        email: 'banerjee4785@gmail.com',
      })
    }
  }

  addCustomerAddress() {
    this.isAddMoreAddress = true;
    if (this.addMoreAddressForm.invalid)
      return;
    else { }
  }

  /** 
   * METHOD TO UPDATE USER PHONE NUMBER
   */
  updateCustomerDetails = () => {
    Swal.fire({
      text: 'Do you want to update this account?',
      icon: 'warning',
      confirmButtonText: 'Okay',
      width: 400,
      showCancelButton: true,
      cancelButtonColor: '#f66531',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        const data = { ...this.parentForm.value };
        data.customer_id = +this.userDetails.id;
        if (data.phoneNo.length === 10) {
          let newPhoneNumber = data.phoneNo.substring(0, 3);
          data.phone_number = newPhoneNumber === '+91' ? data.phoneNo : `+91${data.phoneNo}`;
          this.updatedPhoneNumberError = '';
        } else {
          this.updatedPhoneNumberError = `Mobile number length can't be more than 10`;
          this.spinner.hide();
        }
        if (!this.updatedPhoneNumberError) {
          this._authService.request('put', `customers`, data)
            .subscribe(response => {
              console.log('respons data ', response);
              if (response.res.id === 1) {
                this.spinner.hide();
                this.setValueToParentForm();
                this.isEditClicked = false;
              }
            })
        }
      }
    })
  }

  selectedService(value) {
    this.customerService = value;
  }

  serviceSubmit() {
    this.isProfileFormSubmitted = true;
    if (this.myProfileServiceForm.invalid)
      return;
    else {
      switch (this.customerService) {
        case '1':
          this.route.navigateByUrl('/customer/boarding');
          break;
        case '2':
          this.route.navigateByUrl('/customer/drop-in');
          break;
        case '3':
          this.route.navigateByUrl('/customer/day-care');
          break;
        case '4':
          this.route.navigateByUrl('/customer/home-sitting');
          break;
        case '5':
          this.route.navigateByUrl('/customer/trainer');
          break;
        case '7':
          this.route.navigateByUrl('/customer/pet-walking');
          break;
        case '6':
          this.route.navigateByUrl('/customer/grooming');
          break;
        case '10':
          this.route.navigateByUrl('/customer/adoption');
          break;
        case '9':
          this.route.navigateByUrl('/customer/veterinary-doctor');
          break;
        case '8':
          this.route.navigateByUrl('/customer/mating');
          break;

      }
    }
  }

  getStateList() {
    this._authService.request(`get`, `city/state`)
      .subscribe((response) => {
        response.res.forEach(element => {
          this.stateList.push({ code: element.id, value: element.state_name });
        });
        console.log('StateList', this.stateList);
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

  updateProfile() {
    this.isEditClicked = true;
  }

  uploadDocument(event): any {
    let file = event.target.files[0];
    if (file.type === 'application/pdf') {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      fileReader.onload = () => this.getFileValue(btoa(fileReader.result.toString()));
    } else {
      this.fileUploadErrorMessage = 'Please Uplaod PDF file only!';
    }
  }

  uploadedFile(event) {
    this.uploadDocument(event);
  }

  getFileValue(result) {
    this.spinner.show();
    this.imgdate = atob(result);
    let data = {};
    data['vendor_id'] = this.userDetails.id;
    data['image_type'] = 'DOCUMENT';
    data['image_data'] = result;
    data['file_extension'] = 'pdf';
    data['position'] = 20;
    this._authService.request('post', `vendors/images`, data)
      .subscribe((response) => {
        this.fileUploadErrorMessage = 'File uploaded Successfully!';
        this.getCustomerDetailsById();
        this.spinner.hide();
      })
  }

  getUploadedDocument() {
    this.spinner.show();
    setTimeout(() => {
      this._authService.request('get', `vendors/images?vendor_id=${this.userDetails.id}&image_type=PET`)
        .subscribe((response) => {
          console.log('image response ', response);
          if (response.res.length > 0) {
            if (response.res.filter(x => x.position === 1)[0] !== undefined)
              this.uploadedFileList[0] = response.res.filter(x => x.position === 1)[0].base_url;
            if (response.res.filter(x => x.position === 2)[0] !== undefined)
              this.uploadedFileList[1] = response.res.filter(x => x.position === 2)[0].base_url;
            if (response.res.filter(x => x.position === 3)[0] !== undefined)
              this.uploadedFileList[2] = response.res.filter(x => x.position === 3)[0].base_url;
            if (response.res.filter(x => x.position === 4)[0] !== undefined)
              this.uploadedFileList[3] = response.res.filter(x => x.position === 4)[0].base_url;
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
          fileReader.onload = () => this.uploadVendorImages(btoa(fileReader.result.toString()), 'pic1', file.type);
        } else {
          this.imageUploadErrorMessage1 = 'PNG/JPGE image file only!';
          this.spinner.hide()
        }
        break;
      case 'pic-2':
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
          fileReader.readAsBinaryString(file);
          fileReader.onload = () => this.uploadVendorImages(btoa(fileReader.result.toString()), 'pic2', file.type);
        }
        else {
          this.imageUploadErrorMessage2 = 'PNG/JPGE image file only!';
          this.spinner.hide();
        }
        break;
      case 'pic-3':
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
          fileReader.readAsBinaryString(file);
          fileReader.onload = () => this.uploadVendorImages(btoa(fileReader.result.toString()), 'pic3', file.type);
        }
        else {
          this.imageUploadErrorMessage3 = 'PNG/JPGE image file only!';
          this.spinner.hide();
        }
        break;
      case 'pic-4':
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
          fileReader.readAsBinaryString(file);
          fileReader.onload = () => this.uploadVendorImages(btoa(fileReader.result.toString()), 'pic4', file.type);
        }
        else {
          this.imageUploadErrorMessage4 = 'PNG/JPGE image file only!';
          this.spinner.hide()
        }
        break;
    }
  }

  uploadVendorImages(result, value, type) {
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

  updateAddress = () => {
    this.route.navigate(['user/update-address', this.userDetails.id])
  }

  /**
   * GET ADDRESS LIST OF CUSTOMER:
   */
  getCustomerAddressList = () => {
    this.spinner.show();
    this._authService.request('get', `customers/address?customer_id=${this.userDetails.id}`)
      .subscribe(response => {
        console.log('address list', response.res);
        if (response.res.length === 0) {
          this.addressErrorText = 'No address added yet!';
          this.spinner.hide();
        }
        else {
          this.addressErrorText = '';
          this.addressList = response.res;
          this.spinner.hide();
        }
      }, err => {
        this.addressErrorText = 'Something went worng, please try again later!';
        this.spinner.hide();
      });
  }

  /**
   * INIT PET DETAILS FORM:
   */
  initPetDetailsForm = () => {
    this.addPetDetailsForm = this._formbuilder.group({
      pet_type: [''],
      pet_name: ['', Validators.compose([Validators.required])],
      breed: ['', Validators.compose([Validators.required])],
      pet_age: ['', Validators.compose([Validators.required])],
      pet_age_month: [],
      weight: [''],
      pet_sex: ['']
    });
  }

  /**
   * SUBMIT PET DETAILS FORM:
   */
  submitPetDetailsForm = () => {
    this.isPetDetailsSubmit = true;
    if (this.addPetDetailsForm.invalid)
      return;
    else {
      this.spinner.show();
      const data = { ...this.addPetDetailsForm.value };
      data.customer_id = +this.userDetails.id;
      data.weight = this.petWeightId;
      data.pet_type = this.servicesProvidedToValue;
      data.pet_sex = this.petGender;

      console.log('add pet details ', data)
      this._authService.request(`post`, `customers/pet`, data)
        .subscribe(response => {
          this.spinner.hide();
          Swal.fire({
            text: 'Pet Details Added Successfully',
            icon: 'success',
            confirmButtonText: 'Okay',
            width: 400,
            allowOutsideClick: false
          }).then(result => {
            if (result.value) {
              this.getCustomerPetDetails();
              this.selectProfileTypeCount = 1;
              this.addPetDetailsForm.reset();
            }
          })
        })
    }
  }

  /**
   * SELECTED TYPE OF ANIMAL
   */
  serviceProvide = (value) => {
    this.servicesProvidedToValue = value;
    this.isDogSelected = value === 'Dog' ? true : false;
    this.isCatSelected = value === 'Cat' ? true : false;

    /**
     * API CALL TO POPULATE CAT / DOG BREED LIST:
     */
    this.breedList = [];
    this._authService.request(`get`, `breed?pet_type=${value}`)
      .subscribe(response => {
        response.res.forEach(element => {
          this.breedList.push({ code: element.id, value: element.breed_name })
        });
      })
  }

  /**
   * GET SELECTED GENDER:
   */
  genderSelected = (value) => {
    this.isMaleSelected = value === 'M' ? true : false;
    this.isFemaleSelected = value === 'F' ? true : false;
    this.petGender = value;
  }

  /**
   * GET WEIGHT OF PET:
   */
  lookAfterClicked = (value) => {
    this.isLookAfterOneClicked = value === 1 ? true : false;
    this.isLookAfterTwoClicked = value === 2 ? true : false;
    this.isLookAfterThreeClicked = value === 3 ? true : false;
    this.isLookAfterFourClicked = value === 4 ? true : false;
    this.petWeightId = value;
  }

  /**
   * GET CUSTOMER PET DETAILS:
   */
  getCustomerPetDetails = () => {
    this._authService.request(`get`, `customers/pet?customer_id=${this.userDetails.id}`)
      .subscribe(response => {
        console.log('customer pet details ', response.res);
        if (response.res.length !== 0)
          this.petDetails = response.res;
        else
          this.petDetailsTextError = 'No Pet Added!';
      });
  }


  /**
   * METHOD TO GET CUSTOMER PREVIOUS BOOKING AND UPCOMING BOOKING:
   */
  getCustomerBookingDetails = () => {
    this.spinner.show();
    setTimeout(() => {
      let booking = this._authService.request('get', `booking?customer_id=${this.userDetails.id}`);
      let subscription = this._authService.request('get', `customers/subscription?customer_id=${this.userDetails.id}`);
      forkJoin([booking, subscription]).subscribe(response => {
        this.subscriptionDetails = response[1].res;
        this._authService.subscription_id = this.subscriptionDetails['SubscriptionId'];
      })
      this._authService.request('get', `booking?customer_id=${this.userDetails.id}`)
        .subscribe(response => {
          if (response.res.length !== 0) {
            this.bookingDetails = response.res.filter(x => x.booking_type === 'service_booking');
            console.log('booking ', this.bookingDetails);
            this.bookingErrorText = '';
          } else {
            this.bookingErrorText = 'No requested service found';
          }
          this.spinner.hide();
        })
    }, 1000);
  }

  /**
   * DELETE PET DETAILS:
   */
  deletePetDetails = (index) => {
    if (index) [
      Swal.fire({
        text: 'Do you want to delete this pet details?',
        icon: 'warning',
        confirmButtonText: 'Okay',
        showCancelButton: true,
        width: 400,
        allowOutsideClick: false
      }).then(result => {
        if (result.value) {
          this.spinner.show();
          const data = {};
          data['customer_id'] = +this.userDetails.id;
          data['pet_details_id'] = +index;
          data['pet_type'] = this.petDetails['pet_type'];
          data['pet_name'] = this.petDetails['pet_name'];
          data['breed'] = +this.petDetails['breed_id'];
          data['pet_age'] = +this.petDetails['pet_age_yr'];
          data['weight'] = +this.petDetails['weight'];
          data['is_delete'] = 1;
          this._authService.request('put', `customers/pet`, data)
            .subscribe(response => {
              this.spinner.hide();
              Swal.fire({
                text: 'Deleted Successfully',
                icon: 'success',
                confirmButtonText: 'Okay',
                width: 400,
              }).then(res => {
                if(res.value) {
                  window.location.reload();
                }
              })
            }, err => {
              Swal.fire({
                text: 'Something went wrong! Please try again leter.',
                icon: 'error'
              }).then(res => {
                if(res.value) {
                  window.location.reload();
                }
              })
            });
        }
      })
    ]
  }

  /**
   * mathod to make payment.
   * @param value: Parameter to get serice value
   * @param id: Parameter for booking id
   */
  makePayment = (value, id) => {
    this.bookingId = id;
    this.paymentAmount = value;
    const rzpConfig = {
      "key": this.constant.RAZORPAY_KEY_ID,
      "amount": value * 100, // 2000 paise = INR 20
      "name": "Petcoset",
      "description": "Purchase Description",
      "image": '',
      "prefill": {
        "name": `${this.userDetails.first_name} ${this.userDetails.last_name}`,
        "email": `${this.userDetails.email}`
      },
      "notes": {
        "address": `${this.userDetails.address_1} ${this.userDetails.address_2}`
      },
      "theme": {
        "color": "#0d519c"
      },
      "handler": this.getTnxId.bind(this),
    }
    let rzp = new Razorpay(rzpConfig);
    rzp.open();
  }

  /**
   * Method to get Tansaction id of Transaction.
   * @param response: Parameter to get razorpay payment id
   */
  getTnxId = (response) => {
    /* this.confirmRequest(response.razorpay_payment_id) */

    this.spinner.show();
    const data = {};
    data['booking_id'] = this.bookingId;
    data['transaction_id'] = response.razorpay_payment_id;
    data['customer_id'] = this.userDetails.id;
    data['payment_amount'] = this.paymentAmount;
    console.log('payment data ', data);
    this._authService.request('post', `payment`, data)
      .subscribe(response => {
        console.log('payment response',response);
        this.spinner.hide();
        Swal.fire({
          title: 'Payment Successfull',
          icon: 'success'
        }).then(result => {
          if(result.value) {
            this.selectProfileTypeCount = 1;
            this.spinner.hide();
          }
        });
      }, err => {
        Swal.fire({
          text: 'Something went wrong! Please try again later',
          icon: 'error'
        })
      });
  }

  /**
   * Method to confirm service request. 
   * @param value : Parameter for payment id.
   */
  confirmRequest = (value) => {
    console.log('booking id ', this.bookingId);
    console.log('payment id ', value);
    this.spinner.show();
    const data = {};
    data['booking_id'] = this.bookingId;
    data['transaction_id'] = value;
    data['customer_id'] = this.userDetails.id;
    data['payment_amount'] = this.paymentAmount;
    this._authService.request('post', `payment`, data)
      .subscribe(response => {
        this.spinner.hide();
        Swal.fire({
          title: 'Payment successfull',
          icon: 'success',
        });
      }, err =>{
        Swal.fire({
          title: 'Payment unsuccessfull',
          icon: 'error',
        });
      });
  }

}
