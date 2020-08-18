import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, NgZone } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService, UserDetails } from 'src/app/authentication.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { Constant } from 'src/app/core/helper/constant';

declare const Razorpay: any;


@Component({
  selector: 'app-mating',
  templateUrl: './mating.component.html',
  styleUrls: ['./mating.component.css']
})
export class MatingComponent implements OnInit {

  parentForm: FormGroup;
  userDetails: UserDetails;
  displayCount = 0;
  petDetails = [];
  petDetailsTextError;
  selectedPetList;
  vendorList = [];
  noVendorText: string = '';
  selectedVendorId = [];
  preferredLocatinoError = '';
  petSelectError = '';
  addressList;
  selectedPetIndex;
  subscriptionDetails = [];
  subscriptionId;
  isSubscription;
  breedList = [];
  public imageList = [];
  public cityList = [];
  keyword = 'name';

  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private _authService: AuthenticationService,
    private route: Router,
    private constant: Constant,
    private ngZone: NgZone
  ) {
    this.isSubscription = false;
  }

  ngOnInit() {
    this.userDetails = this._authService.getUserDetails();
    this.initParentForm();
    this.getCustomerPetDetails();
    this.getCityList();
    this.getCustomerAddressList();
    this.getSubscriptionDetails();
  }

  /**
   * INIT PARENT FORM:
   */
  initParentForm = () => {
    this.parentForm = this._formBuilder.group({
      preferred_location: [''],
      gender: [''],
      mate_pet: [''],
      available_matting: [''],
      extraMessage: [''],
      subscription_id: [''],
      breed_id: ['']
    });
  }

  /**
   * METHOD TO CHANGE BLOCK BOOKING TO PET INFORMATION
   */
  changeBlock = () => {
    const data = {...this.parentForm.value}
    this.preferredLocatinoError = data.preferred_location === '' ? 'Preferred location is required' : '';
    this.petSelectError = !this.selectedPetList ? 'Please select one pet from list' : '';
    if (!this.preferredLocatinoError && !this.petSelectError) {
      this.getVendorList();
      this.displayCount = 1;
    } 
  }

  /**
 * METHOD WILL RETURN CUSTOMER PET DETAILS
 */
  getCustomerPetDetails = () => {
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
  }

  /**
  * METHOD WILL RETURN SELECTED PET DETAILS LIST
  */
  selectedPet = (index) => {
    this.selectedPetList = this.petDetails[index];
    this.selectedPetIndex = index;
    this.breedList = [];
    if(this.selectedPetList) {
      this._authService.request('get', `breed?pet_type=${this.selectedPetList['pet_type']}`)
      .subscribe(response => {
        if(response.res.length !== 0) {
          response.res.forEach(element => {
            this.breedList.push({code: element.id, value: element.breed_name});
          });
        }
      });
    }
  }

  /**
   * METHOD WILL RETURN VENDOR LIST AS PER CUSTOMER REQUIRMENT:
   * SERVICE ID: 8
   */
  getVendorList = () => {
    this._authService.request('get', 'services/vendors?service_id=8&booking_date=2020-07-22&booking_time=10:00:00') 
      .subscribe(response => {
        if (response.res.length !== 0) {
          this.vendorList = response.res;
          console.log('vendor list ', this.vendorList);
          this.noVendorText = '';
        } else
          this.noVendorText = 'No vendor found';
      });
  }

  /**
   * METHOD TO GET SELECTED VENDOR AND 
   * CHANGE BLOCK TO PAYMENT BLOCK
   */
  selectedVendor = (id, index) => {
    this.spinner.show();
      this.imageList = [];
      this._authService.request('get', `vendors/images?vendor_id=${id}&image_type=PET`)
        .subscribe(response => {
          response.res.forEach(element => {
            if (element.position === 801 || element.position === 802 || element.position === 803 || element.position === 804) {
              this.imageList.push(element.base_url);
              this.displayCount = 4;
              this.spinner.hide();
            }
          });
        })
      this.selectedVendorId = this.vendorList[index];
   /*  if (this.selectedPetList) {
      this.selectedVendorId = id;
      this.displayCount = 3;
      this.petSelectError = '';
    } else {
      this.petSelectError = 'Please select one pet from list';
    } */
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
    const rzpConfig = {
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
    rzp.open();
  }

  /**
  * SUMBIT PARENT FORM:
  */
  submitParentForm = () => {
    this.spinner.show();
    const data = { ...this.parentForm.value };
    data.customer_id = this.userDetails.id;
    data.customer_id = +this.userDetails.id;
    data.vendor_id = +this.selectedVendorId['VendorId'];
    data.total_amount = +this.selectedVendorId['service_charge'];
    data.service_id = 8;
    data.address_id = +this.addressList;
    data.booking_date = '2020-07-24';
    data.booking_time = `10:00:00`; 
    data.booking_end_time = `12:00:00`;
    data.remarks = data.extraMessage;
    data.transaction_id = '';
    data.recurringBookings = null;
    data.booking_end_date = '2020-07-24';
    data.preferred_location = data.preferred_location.name;
    let url;
    if (data.subscription_id === true) {
      data.subscription_id = this.subscriptionId;
      url = 'booking';
    } else
      url = 'booking/service';
    this._authService.request('post', url, data)
      .subscribe(response => {
        this.spinner.hide();
        if (response.res.id !== -1)
        this.spinner.hide();
          Swal.fire({
            text: 'Matting Request Added Successfully',
            icon: 'success',
            confirmButtonText: 'Okay',
            width: 400,
            allowOutsideClick: false
          }).then(result => {
            if (result.value)
              this.ngZone.run(() => this.route.navigate(['/user/customer']));
          })
      })
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
    this.isSubscription = this.subscriptionDetails.find(x => x.ServiceId === 8) ? true : false;
  }

  /**
   * Method to back vendor selection block.
   */
  backFilter = () => {
    this.displayCount = 1;
  }

  /**
   * Method to navegate final info page.
   */
  finalBlock = () => {
    this.displayCount = 3;
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
