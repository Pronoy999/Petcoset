import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService, UserDetails} from '../../../authentication.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import Swal from "sweetalert2";

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
  openform=false;
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

  constructor(
    private _formbuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: Router,
    private _authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getCustomerDetailsById();
    this.getStateList();
    //this.initVendorFreelancerForm();
    this.initMyProfileForm();
    this.initParentForm();
    this.userDetails = this._authService.getUserDetails();
    this.fullName = `${this.userDetails.first_name} ${this.userDetails.last_name}`;
    this.getService();
  }

  onClickOpenForm(){
    this.openform=true;
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
        break;
      case 'profile':
        this.selectProfileTypeCount = 2;
        this.detailsSelected = false;
        this.profileSelected = true;
        this.serviceSelected = false;
        this.previousCaesSelected = false;
        this.isDocumentSelected = false;
        break;
      case 'service':
        this.selectProfileTypeCount = 3;
        this.detailsSelected = false;
        this.profileSelected = false;
        this.serviceSelected = true;
        this.previousCaesSelected = false;
        this.isDocumentSelected = false;
        break;
      case 'pervious-case':
        this.selectProfileTypeCount = 4;
        this.detailsSelected = false;
        this.profileSelected = false;
        this.serviceSelected = false;
        this.previousCaesSelected = true;
        this.isDocumentSelected = false;
        break;
      case 'document':
        this.selectProfileTypeCount = 5;
        this.detailsSelected = false;
        this.profileSelected = false;
        this.serviceSelected = false;
        this.previousCaesSelected = false;
        this.isDocumentSelected = true;
        this.getUploadedDocument();
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
        // address_1: vendor[0]['address_1'] ? vendor[0]['address_1'] : 'Address Line One',
        // address_2: vendor[0]['address_2'] ? vendor[0]['address_2'] : 'Address Line Two',
        // state_name: vendor[0]['state_name'] ? vendor[0]['state_name'] : 'State',
        // city_name: vendor[0]['city_name'] ? vendor[0]['city_name'] : 'City',
        // pincode: vendor[0]['pincode'] ? vendor[0]['pincode'] : 'Pincode',
        // account_number: vendor[0]['account_number'] ? vendor[0]['account_number'] : 'Bank Account Number',
        // bank_name: vendor[0]['bank_name'] ? vendor[0]['bank_name'] : 'Branch Name',
        // ifsc_code: vendor[0]['ifsc_code'] ? vendor[0]['ifsc_code'] : 'IFSC Code'
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
      this._authService.request(`get`, `customers?customer_id=${this.userDetails.id}`)
        .subscribe((response) => {
          console.log('customer details', response.res);
          this.customerDetails = response.res;
          this.setValueToParentForm();
          this.spinner.hide();
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

  /*
  initVendorFreelancerForm() {
    this.vendorFreelancerForm = this._formbuilder.group({
      name: [''],
      type: [''],
      gender: [''],
      phoneNo: [''],
      email: [''],
      otherNumber: [''],
      location: ['', Validators.compose([Validators.required])],
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
  }*/

  setValueToForm() {
    const vendor = { ...this.customerDetails };
    if (vendor) {
      this.vendorFreelancerForm.patchValue({
        phoneNo: '8481057774',
        email: 'banerjee4785@gmail.com',
      })
    }
  }

  addCustomerAddress(){
    this.isAddMoreAddress = true;
    if(this.addMoreAddressForm.invalid)
      return;
    else {}
  }

  submitVendor() {
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
        data.vendor_id = this.userDetails.id;
        data.address_1 = this.parentForm.controls.address_1.value === 'Address Line one' ? '' : this.parentForm.controls.address_1.value;
        data.address_2 = this.parentForm.controls.address_2.value === 'Address Line two' ? '' : this.parentForm.controls.address_2.value;
        data.city = this.parentForm.controls.city_name.value === 'City' ? '' : this.parentForm.controls.city_name.value;
        data.pincode = this.parentForm.controls.pincode.value === 'Pincode' ? '' : this.parentForm.controls.pincode.value;
        data.phone_number = data.phoneNo;
        data.email = data.email;
        delete data.first_name;
        delete data.last_name;
        delete data.state_name;
        delete data.phoneNo;

        let personal = {}
        personal['vendor_id'] = this.userDetails.id;
        personal['address_1'] = data.address_1;
        personal['address_2'] = data.address_2;
        personal['email'] = data.email;
        personal['phone_number'] = data.phone_number;
        personal['city'] = data.city;
        personal['pincode'] = data.pincode

        let banking = {};
        banking['holder_id'] = this.userDetails.id;
        banking['account_number'] = data.account_number;
        banking['bank_name'] = data.bank_name;
        banking['ifsc_code'] = data.ifsc_code;
        banking['holder_type'] = 'tbl_VendorMaster';
        banking['holder_name'] = `${this.userDetails.first_name} ${this.userDetails.last_name}`
        banking['contact_number'] = data.phone_number;
        banking['is_update'] = 1

        this._authService.request('put', `vendors`, personal)
          .subscribe((response) => {
            this._authService.request('post', `vendors/details`, banking)
              .subscribe((res) => {
                this.spinner.hide();
                Swal.fire({
                  text: 'Account is updated successfully',
                  icon: 'success',
                  confirmButtonText: 'Okay',
                  width: 400,
                  allowOutsideClick: false
                }).then((end) => {
                  if (end.value) {
                    this.isEditClicked = false;
                    this.getCustomerDetailsById();
                  }
                })
              })
          })
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
          this.route.navigateByUrl('/customer/veterinary');
          break;
        case '8':
          this.route.navigateByUrl('/customer/matting');
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

}
