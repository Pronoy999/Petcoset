import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UserDetails, AuthenticationService } from 'src/app/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { Constant } from 'src/app/core/helper/constant';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';


declare const Razorpay: any;

@Component({
  selector: 'app-boarding',
  templateUrl: './boarding.component.html',
  styleUrls: ['./boarding.component.css']
})
export class BoardingComponent implements OnInit {

  parentForm: FormGroup;
  userDetails: UserDetails;
  displayCount: number = 0;
  timePickerhrs = [];
  timePickerMin = [];
  petDetails = [];
  petDetailsTextError;
  selectedPetList;
  vendorList = [];
  noVendorText: string = '';
  selectedVendorId = '';
  isSubmitted: boolean = false;
  preferredLocationErrorText: string = '';
  bookingList = [];
  bookingDetailsError = '';
  petSelectError = '';
  selectedPetIndex: number;
  todayDate = new Date();
  currentDate = '';
  addressList;
  oneTimeImgSrc = '../../../../assets/images/customer_form_icon/onetime 1.png';
  repeateImgSrc = '../../../../assets/images/customer_form_icon/Repeat 2.png';
  subscriptionDetails = [];
  subscriptionId;
  isSubscription;

  keyword = 'name';
  data = [
     {
       id: 1,
       name: 'Kolkata'
     },
     {
       id: 2,
       name: 'Dumdum'
     },
     {
      id: 2,
      name: 'bangalore'
    }
  ];
  public cityList = [];

  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private _authService: AuthenticationService,
    private route: Router,
    private constant: Constant,
    private datePipe: DatePipe,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.userDetails = this._authService.getUserDetails();
    this.initBoardingForm();
    /* this.addBookingDetails(); */
    this.getCityList();
    this.constructionTime();

    this.getCustomerPetDetails();
    this.currentDate = this.datePipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.getCustomerAddressList();
    this.isSubscription = false;
    this.getSubscriptionDetails();
  }

  /**
   * INIT BOARDING FORM:
   */
  initBoardingForm = () => {
    this.parentForm = this._formBuilder.group({
      preferred_location: [''],
      start_date: [''],
      pick_up_time_hrs: [''],
      dropOffTime: [''],
      bookingDetails: this._formBuilder.array([]),
      has_house: [''],
      has_fenced_garden: [''],
      is_pets_allowed_on_furniture: [''],
      is_pets_allowed_on_bed: [''],
      is_non_smoking: [''],
      does_own_dog: [''],
      does_own_cat: [''],
      only_one_booking: [''],
      does_own_caged_animals: [''],
      child_age: [''],
      is_bathing_provided: [''],
      is_first_aid: [''],
      extraMessage: [''],
      subscription_id: [''],
      booking_end_date: ['']
    });
  }

  /**
   * DYNAMIC BOARDING FORM SECTION:
   */
  get bookingDetailsFormArray(): FormArray {
    return this.parentForm.get('bookingDetails') as FormArray;
  }

  createBookingDetailsForm = () => {
    return this._formBuilder.group({
      start_date: [''],
      pick_up_time_hrs: [''],
      dropOffTime: ['']
    })
  }

  addBookingDetails = () => {
    this.imgSelection('two');
    this.bookingDetailsFormArray.push(this.createBookingDetailsForm());
  }

  submitBoardingForm = () => {
    this.spinner.show();
    const data = { ...this.parentForm.value };
    data.coustomer_id = +this.userDetails.id;
    this._authService.request('post', '', data)
      .subscribe(response => {
        this.spinner.hide();
        if (response.res.id !== -1) {
          Swal.fire({
            text: 'Boarding Request Added Successfully',
            icon: 'success',
            confirmButtonText: 'Okay',
            width: 400,
            allowOutsideClick: false
          }).then(result => {
            if (result.value) {
              localStorage.clear();
              this.route.navigateByUrl('/user/customer');
            }
          });
        }
      });
  }

  /**
   * CONSTRUCTION TIME:
   */
  constructionTime = () => {
    for (let i = 0; i <= 23; i++) {
      let timeHour = i < 10 ? `0${i}` : `${i}`;
      this.timePickerhrs.push({ code: timeHour, value: timeHour });
    }

    for (let i = 0; i < 60; i++) {
      let timeMin = i < 10 ? `0${i}` : `${i}`;
      this.timePickerMin.push({ code: timeMin, value: timeMin })
    }
  }

  /**
   * METHOD TO CHANGE FIRST BLOCK:
   */
  changeFirstBlock = (value) => {
    const data = { ...this.parentForm.value };
    if (!data.preferred_location) {
      this.preferredLocationErrorText = 'Preferred Location is required'
    } else {
      this.preferredLocationErrorText = '';
    }

    if (!data.start_date || !data.pick_up_time_hrs || !data.dropOffTime)
      this.bookingDetailsError = 'Full booking details is required';
    else
      this.bookingDetailsError = '';

    if (this.selectedPetList) {
      this.petSelectError = '';
    } else {
      this.petSelectError = 'Please select one pet from list';
    }

    if (!this.preferredLocationErrorText && !this.petSelectError) {
      this.preferredLocationErrorText = '';
      this.bookingDetailsError = '';
      this.petSelectError = '';
      this.displayCount = value === 'next' ? 2 : 1;
      window.scrollTo(0, 0);
      this.getVendorList();
    }
  }

  /**
   * METHOD TO CHANGE ADVANCE FILTER BLOCK
   */
  changeAdvanceFilterBlock = () => {
    this.displayCount = 2;
  }

  /**
   * METHOD TO GET SELECTED VENDOR AND 
   * CHANGE BLOCK TO PAYMENT BLOCK
   */
  selectedVendor = (id) => {
    if (this.selectedPetList) {
      this.selectedVendorId = this.vendorList[id];
      this.displayCount = 3;
      this.bookingList = this.parentForm.controls.bookingDetails.value;
      this.petSelectError = '';
    } else {
      this.petSelectError = 'Please select one pet from list';
    }
  }

  /**
   *METHOD TO BACK PERVIOUS BLOCK: 
   */
  back = () => {
    this.displayCount = 0;
  }

  /**
   * METHOD WILL RETURN CUSTOMER PET DETAILS
   */
  getCustomerPetDetails = () => {
    setTimeout(() => {
      this._authService.request('get', `customers/pet?customer_id=${this.userDetails.id}`)
        .subscribe(response => {
          if (response.res.length !== 0) {
            this.petDetails = response.res;
            this.spinner.hide();
          }
          else
            this.petDetailsTextError = 'No Pet Added!';
        }, err => {
          if (err === 403) {
            localStorage.clear()
            this.route.navigateByUrl('/auth/login');
            this.spinner.hide();
          }
        });
    }, 1000);
  }

  /**
   * METHOD WILL RETURN SELECTED PET DETAILS LIST
   */
  selectedPet = (index) => {
    this.selectedPetList = this.petDetails[index];
    this.selectedPetIndex = index;
  }

  /**
   * METHOD WILL RETURN VENDOR LIST AS PER CUSTOMER REQUIRMENT:
   */
  getVendorList = () => {
    this.spinner.show();
    setTimeout(() => {
      this._authService.request('get', `services/vendors?service_id=1&booking_date=${this.parentForm.controls.start_date.value}&booking_time=${this.parentForm.controls.pick_up_time_hrs.value}:00`)
        .subscribe(response => {
          if (response.res.length !== 0) {
            this.vendorList = response.res;
            this.noVendorText = '';
            console.log('vendor list ', response);
            this.spinner.hide()
          } else {
            this.noVendorText = 'No vendor is available on your requested date and time';
            this.spinner.hide();
          }
        });
    }, 1000);
  }

  /**
   * METHOD TO GET CUSTOMER ADDRESS LIST
   * DEFAULT ADDRESS IS THE BOOKING ADDRESS 
   */
  getCustomerAddressList = () => {
    this._authService.request('get', `customers/address?customer_id=${this.userDetails.id}`)
      .subscribe(response => {
        if (response.res.length !== 0) {
          let noDefault;
          this.addressList = response.res.find(x => x.is_default === 1) !== undefined ? response.res.find(x => x.is_default === 1)['id'] : noDefault = true;
          console.log('address list ', this.addressList);
          if(noDefault) {
            Swal.fire({
              text: 'No default address found. Please mark one address as default!',
              icon: 'error',
              confirmButtonText: 'OKay',
              width: 400,
              allowOutsideClick: false,
            }).then(result => {
              if(result.value) {
                this.route.navigateByUrl('/user/customer');
                this.spinner.hide();
              }
            })
          }
        } else {
          Swal.fire({
            text: 'No Addess details found. Please add address!',
            icon: 'error',
            confirmButtonText: 'OKay',
            width: 400,
            allowOutsideClick: false,
          }).then(result => {
            if(result.value) {
              this.route.navigateByUrl('/user/customer');
              this.spinner.hide();
            }
          })
        }
      });
  }

  /**
   * INIT PAYMENT WITH RAZORPAY:
   */
  initRazorPay = () => {
    /*  const rzpConfig = {
       "key": this.constant.RAZORPAY_KEY_ID,
       "amount": this.selectedVendorId['service_charge'] * 100, // 2000 paise = INR 20
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
     rzp.open(); */
    this.spinner.show();
    const data = { ...this.parentForm.value };
    data.customer_id = +this.userDetails.id;
    data.vendor_id = +this.selectedVendorId['VendorId'];
    data.total_amount = +this.selectedVendorId['service_charge'];
    data.service_id = 1;
    data.preferred_location = data.preferred_location.name;
    data.address_id = +this.addressList;
    data.booking_date = data.start_date;
    data.booking_time = `${data.dropOffTime}:00`; 
    data.booking_end_time = `${data.pick_up_time_hrs}:00`;
    data.remarks = data.extraMessage;
    data.transaction_id = '';
    if (data.bookingDetails.length.length === 0)
      data.recurringBookings = null;
    else {
      let recurringList = [];
      for (let i = 0; i < data.bookingDetails.length; i++) {
        let recurringData = {};
        recurringData['booking_time'] = `${this.bookingList[i]['pick_up_time_hrs']}:00`;
        recurringData['booking_date'] = `${this.bookingList[i]['start_date']}`;
        recurringData['booking_end_time'] = `${this.bookingList[i]['dropOffTime']}:00`
        recurringList.push(recurringData);
      }
      data.recurringBookings = recurringList;
    }
    delete data.bookingDetails;
    delete data.child_age;
    delete data.does_own_caged_animals;
    delete data.does_own_cat;
    delete data.does_own_dog;
    delete data.has_fenced_garden;
    delete data.has_house;
    delete data.is_bathing_provided;
    delete data.is_first_aid;
    delete data.is_non_smoking;
    delete data.is_pets_allowed_on_bed;
    delete data.is_pets_allowed_on_furniture;
    delete data.only_one_booking;
    delete data.pick_up_time_hrs;
    delete data.extraMessage;
    delete data.dropOffTime;

    let url;
    if (data.subscription_id === true) {
      data.subscription_id = this.subscriptionId;
      url = 'booking';
    } else
      url = 'booking/service';

    console.log('boarding details ', data);
    this._authService.request('post', url, data)
      .subscribe(response => {
        console.log('boarding response ', response);
        this.spinner.hide();
        Swal.fire({
          text: 'Boarding Request Added Successfully!',
          icon: 'success',
          confirmButtonText: 'OKay',
          width: 400,
          allowOutsideClick: false
        }).then(result => {
          if (result.value) {
            this.route.navigate(['/user/customer']);
            this.spinner.hide();
          }
        })
      })
  }

  getTnxId = (response) => {
    this.confirmRequest(response.razorpay_payment_id)
  }

  /**
   * METHOD TO COMPLETE CUSTOMER SERVICE REQUEST AFTER GETTING ORDER ID FROM RAZORPAY
   */
  confirmRequest = (response) => {
    this.spinner.show();
    const data = { ...this.parentForm.value };
    data.customer_id = +this.userDetails.id;
    data.service_id = 1;
    data.vendor_id = +this.selectedVendorId['VendorId'];
    data.address_id = +this.addressList;
    data.total_amount = +this.selectedVendorId['service_charge'];
    data.transaction_id = response;
    data.booking_time = `${this.bookingList[0]['pick_up_time_hrs']}:00`;
    data.booking_date = `${this.bookingList[0]['start_date']}`;
    if (this.bookingList.length === 1)
      data.recurringBookings = null;
    else {
      let recurringList = [];
      for (let i = 1; i < this.bookingList.length; i++) {
        let recurringData = {};
        recurringData['booking_time'] = `${this.bookingList[i]['pick_up_time_hrs']}:00:00`;
        recurringData['booking_date'] = `${this.bookingList[i]['start_date']}`
        recurringList.push(recurringData);
      }
      data.recurringBookings = recurringList;
    }
    delete data.bookingDetails;
    delete data.child_age;
    delete data.does_own_caged_animals;
    delete data.does_own_cat;
    delete data.does_own_dog;
    delete data.has_fenced_garden;
    delete data.has_house;
    delete data.is_bathing_provided;
    delete data.is_first_aid;
    delete data.is_non_smoking;
    delete data.is_pets_allowed_on_bed;
    delete data.is_pets_allowed_on_furniture;
    delete data.only_one_booking;

    this._authService.request('post', `booking/service`, data)
      .subscribe(response => {
        this.spinner.hide();
        Swal.fire({
          text: 'Boarding Request Added Successfully!',
          icon: 'success',
          confirmButtonText: 'OKay',
          width: 400,
          allowOutsideClick: false
        }).then(result => {
          if (result.value) {
            this.ngZone.run(() => this.route.navigate(['/user/customer']));
          }
        })
      })
  }

  /**
   * METHOD TO CHANGE IMAGE NON SELECT TO SELCTED FOR REPEAT OR SINGLE TIME 
   */
  imgSelection = (value) => {
    this.oneTimeImgSrc = value === "one" ? '../../../../assets/images/customer_form_icon/onetime 2.png' : '../../../../assets/images/customer_form_icon/onetime 1.png';
    this.repeateImgSrc = value === "two" ? '../../../../assets/images/customer_form_icon/Repeat 1.png' : '../../../../assets/images/customer_form_icon/Repeat 2.png';
    if (value === 'one') {
      while (this.bookingDetailsFormArray.length !== 0) {
        this.bookingDetailsFormArray.removeAt(0);
      }
    }
  }

  /**
   * METHOD TO  REMOVE ITEM FROM FORMARRAY:
   */
  removeItem = (index) => {
    this.bookingDetailsFormArray.removeAt(index);
  }

  /**
   * METHOD TO GET BACK IN FILTER BLOCK
   */
  backFilter = () => {
    this.displayCount = 1;
  }

  /**
   * Method to get customer subscription details
   */
  getSubscriptionDetails = () => {
    this._authService.request('get', `customers/subscription?customer_id=${this.userDetails.id}`)
      .subscribe(response => {
        if (response.res.lenght !== undefined) {
          this.subscriptionDetails = response.res;
          this.subscriptionId = response.res[0].SubscriptionId;
          this.isSubscriptionPrivilegeService();
        }
      });
  }

  /**
   * Method to get weathe this service have subscription privilege.
   */
  isSubscriptionPrivilegeService = () => {
    this.isSubscription = this.subscriptionDetails.find(x => x.ServiceId === 1) ? true : false;
  }

  getCityList = () => {
    this._authService.request('get', `city?state_id=29`)
      .subscribe(response => {
        response.res.forEach(element => {
          this.cityList.push({id: element.id, name: element.city_name})
        });
      });
  }
}