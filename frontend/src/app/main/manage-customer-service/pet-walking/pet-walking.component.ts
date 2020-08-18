import { DatePipe } from '@angular/common';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserDetails, AuthenticationService } from 'src/app/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { Constant } from 'src/app/core/helper/constant';

declare const Razorpay: any;

@Component({
  selector: 'app-pet-walking',
  templateUrl: './pet-walking.component.html',
  styleUrls: ['./pet-walking.component.css']
})
export class PetWalkingComponent implements OnInit {

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
  selectedVendorId;
  bookingDetails = [];
  preferredLocationErrorText = '';
  bookingDetailsError = '';
  petSelectError = '';
  bookingList = [];
  addressList;
  selectedPetIndex;
  todayDate;
  oneTimeImgSrc = '../../../../assets/images/customer_form_icon/onetime 1.png';
  repeateImgSrc = '../../../../assets/images/customer_form_icon/Repeat 2.png';
  subscriptionDetails = [];
  subscriptionId;
  isSubscription;
  public cityList = [];
  keyword = 'name';


  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private _authService: AuthenticationService,
    private route: Router,
    private constant: Constant,
    private datePipe: DatePipe,
    private ngZone: NgZone
  ) {
    this.isSubscription = false;
  }

  ngOnInit() {
    this.userDetails = this._authService.getUserDetails();
    this.todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.initParentForm();
    this.getPetInformation();
    this.getCityList();
    this.constructionTime();
    this.getCustomerAddressList();
    this.getSubscriptionDetails();
  }

  /**
   * INTI DAY-CARE BOOKING FORM:
   */
  initParentForm = () => {
    this.parentForm = this._formBuilder.group({
      preferred_location: [''],
      date: [''],
      pick_up_time: [''],
      drop_off_time: [''],
      bookingInformation: this._formBuilder.array([]),
      extraMessage: [''],
      subscription_id: ['']
    })
  }

  /**
   * DYNAMIC FORM SECTION:
   */
  get bookingInfoFormarray(): FormArray {
    return this.parentForm.get('bookingInformation') as FormArray;
  }

  createBookingInfoForm = () => {
    return this._formBuilder.group({
      start_date: [''],
      pick_up_time: [''],
      drop_off_time: ['']
    });
  }

  addBookingInfoForm = () => {
    this.imgSelection('two');
    this.bookingInfoFormarray.push(this.createBookingInfoForm());
  }

  /**
   * METHOD TO GET TIME PICKER ONLY HRS
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
   * METHOD TO CHANGE BLOCK BOOKING INFORMATION TO PET INFORMATION
   */
  changeFirstBlock = () => {
    const data = { ...this.parentForm.value };
    this.preferredLocationErrorText = data.preferred_location === '' ? 'Preferred Location is required' : '';

    if (!data.date || !data.pick_up_time || !data.drop_off_time)
      this.bookingDetailsError = 'Full booking details is required';
    else
      this.bookingDetailsError = '';

    this.petSelectError = this.selectedPetList ? '' : 'Please select one pet from list';

    if (!this.preferredLocationErrorText && !this.bookingDetailsError && !this.petSelectError) {
      this.displayCount = 1;
      this.getVendorList();
    }
  }

  /**
   * GET VENDOR DETAILS AS PER CUSTOMER SELECTION
   */
  selectedVendor = (id) => {
    if (this.selectedPetList) {
      this.selectedVendorId = this.vendorList[id];
      this.bookingList = this.parentForm.controls.bookingInformation.value;
      this.displayCount = 3;
      this.petSelectError = '';
    } else {
      this.petSelectError = 'Please select one pet from list';
    }
  }

  /**
   * METHOD TO GET SAVED PAT INFORMATION
   */
  getPetInformation = () => {
    this.spinner.show();
    setTimeout(() => {
      this._authService.request('get', `customers/pet?customer_id=${this.userDetails.id}`)
        .subscribe(response => {
          if (response.res.length !== 0) {
            this.petDetails = response.res;
            this.spinner.hide();
          }
          else {
            this.petDetailsTextError = 'No Pet Added!';
            this.spinner.hide();
          }
        }, err => {
          if (err === 403) {
            localStorage.clear();
            this.route.navigateByUrl('/auth/login');
            this.spinner.hide();
          }
        });
    }, 1000);
    console.log('pet details list ', this.petDetails);
  }

  /**
   * METHOD TO GET SELECTED PET ID 
   */
  selectedPet = (index) => {
    this.selectedPetList = this.petDetails[index];
    this.selectedPetIndex = index;
  }

  /**
   * METHOD WILL RETURN VENDOR LIST AS PER CUSTOMER REQUIRMENT:
   */
  getVendorList = () => {
    this._authService.request('get', `services/vendors?service_id=7&booking_date=${this.parentForm.controls.date.value}&booking_time=${this.parentForm.controls.pick_up_time.value}:00:00`)
      .subscribe(response => {
        if (response.res.length !== 0) {
          this.vendorList = response.res;
          this.noVendorText = '';
        } else
          this.noVendorText = 'No vendor found';
      });
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
        }else {
          Swal.fire({
            text: 'No Addess details found. Please add address!',
            icon: 'success',
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
    /* const rzpConfig = {
      "key": this.constant.RAZORPAY_KEY_ID,
      "amount": this.selectedVendorId['service_charge'] * 100, // 2000 paise = INR 20
      "name": "Petcoset",
      "description": "Purchase Description",
      "image": '',
      "handler": this.submitParentForm.bind(this),
      "prefill": {
        "name": `${this.userDetails.first_name} ${this.userDetails.last_name}`,
        "email": `${this.userDetails.email}`
      },
      "notes": {
        "address": `${this.userDetails.address_1} ${this.userDetails.address_2}`
      },
      "theme": {
        "color": "#0d519c"
      }
    }
    let rzp = new Razorpay(rzpConfig);
    rzp.open(); */
    this.spinner.show();
    const data = { ...this.parentForm.value };
    data.customer_id = +this.userDetails.id;
    data.vendor_id = +this.selectedVendorId['VendorId'];
    data.total_amount = +this.selectedVendorId['service_charge'];
    data.service_id = 7;
    data.address_id = +this.addressList;
    data.booking_date = data.date;
    data.booking_time = `${data.drop_off_time}:00`;
    data.booking_end_time = `${data.pick_up_time}:00`; 
    data.remarks = data.extraMessage;
    data.preferred_location = data.preferred_location.name;
    data.transaction_id = '';
    if (data.bookingInformation.length === 0) {
      data.recurringBookings = null;
    } else {
      let recurringList = [];
      for (let i = 0; i < data.bookingDetails.length; i++) {
        let recurringData = {};
        recurringData['booking_time'] = `${this.bookingList[i]['pick_up_time']}:00`;
        recurringData['booking_date'] = `${this.bookingList[i]['date']}`;
        recurringData['booking_end_time'] = `${this.bookingList[i]['drop_off_time']}:00`
        recurringList.push(recurringData);
      }
      data.recurringBookings = recurringList;
    }

    delete data.extraMessage;
    delete data.drop_off_time;
    let url;
    if(data.subscription_id === true ) {
      data.subscription_id = this.subscriptionId;
      url = 'booking';
    } else 
      url = 'booking/service';
    this._authService.request('post', url, data)
      .subscribe(response => {
        console.log('submitted response', response)
        this.spinner.hide();
        Swal.fire({
          text: 'Pet Walking Request Added Successfully!',
          icon: 'success',
          confirmButtonText: 'OKay',
          width: 400,
          allowOutsideClick: false
        }).then(result => {
          if (result.value) {
            this.route.navigate(['/user/customer']);
            this.spinner.hide()
          }
        })
      })

  }


  /**
   * SUBMIT DAY-CARE BOOKING FORM:
   */
  submitParentForm = (response) => {
    this.spinner.show();
    const data = { ...this.parentForm.value };
    data.customer_id = +this.userDetails.id;
    data.service_id = 7;
    data.vendor_id = +this.selectedVendorId['VendorId'];
    data.address_id = +this.addressList;
    data.total_amount = +this.selectedVendorId['service_charge'];
    data.transaction_id = response.razorpay_payment_id;
    data.booking_time = `${this.bookingList[0]['pick_up_time']}:00`;
    data.booking_date = `${this.bookingList[0]['start_date']}`;
    if (this.bookingList.length === 1)
      data.recurringBookings = null;
    else {
      let recurringList = [];
      for (let i = 1; i < this.bookingList.length; i++) {
        let recurringData = {};
        recurringData['booking_time'] = `${this.bookingList[i]['pick_up_time']}:00:00`;
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
        console.log('submitted response', response)
        this.spinner.hide();
        Swal.fire({
          text: 'Pet Walking Request Added Successfully!',
          icon: 'success',
          confirmButtonText: 'OKay',
          width: 400,
          allowOutsideClick: false
        }).then(result => {
          if (result.value)
            this.ngZone.run(() => this.route.navigate(['/user/customer']));
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
      while (this.bookingInfoFormarray.length !== 0) {
        this.bookingInfoFormarray.removeAt(0);
      }
    }
  }

  /**
   * METHOD TO  REMOVE ITEM FROM FORMARRAY:
   */
  removeItem = (index) => {
    this.bookingInfoFormarray.removeAt(index);
  }

  /**
   * METHOD TO BACK PET INFORMATION BLOCK FORM VENDOE SELECTION PAGE.
   */
  backToBookingInfoBlock = () => {
    this.displayCount = 0;
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
    this.isSubscription = this.subscriptionDetails.find(x => x.ServiceId === 7) ? true : false;
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