import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserDetails, AuthenticationService } from 'src/app/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adoption',
  templateUrl: './adoption.component.html',
  styleUrls: ['./adoption.component.css']
})
export class AdoptionComponent implements OnInit {

  parentForm: FormGroup;
  userDetails: UserDetails;
  submitted = false;
  subscriptionDetails = [];
  subscriptionId;
  isSubscription;
  addressList;
  public vendorList = [];
  public noVendorText;
  public displayCount: number;
  public imageList = [];
  public vendorId: number;
  public cityList = [];
  keyword = 'name';

  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private _authService: AuthenticationService,
    private route: Router
  ) {
    this.noVendorText = '';
    this.displayCount = 0;
  }

  ngOnInit() {
    this.userDetails = this._authService.getUserDetails();
    this.initParentForm();
    this.getCityList();
    this.getSubscriptionDetails();
    this.isSubscription = false;
    this.getAddressList();
    this.getVendorList();
  }

  /**
   * INIT PARENT FORM:
   */
  initParentForm = () => {
    this.parentForm = this._formBuilder.group({
      preferred_location: ['', Validators.compose([Validators.required])],
      pet_adoption: [''],
      enlist_pet_adoption: [''],
      subscription_id: ['']
    });
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
    this.isSubscription = this.subscriptionDetails.find(x => x.ServiceId === 10) ? true : false;
  }

  getAddressList = () => {
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
 * SUBMIT PARENT FORM:
 */
  submitParentForm = () => {
    this.spinner.show();
    const data = { ...this.parentForm.value };
    data.customer_id = +this.userDetails.id;
    data.service_id = 10;
    data.total_amount = 100;
    data.service_duration_hours = 1;
    data.vendor_id = this.vendorId;
    data.address_id = +this.addressList;
    data.transaction_id = '123';
    data.booking_time = '10:00:00';
    data.booking_date = '2020-07-23';
    data.booking_end_time = `12:00:00`;
    data.recurringBookings = null;
    data.booking_end_date = '2020-07-24';
    data.preferred_location = data.preferred_location.name;

    this._authService.request('post', `booking/service`, data)
      .subscribe(response => {
        console.log(response);
        this.spinner.hide();
        if (response.res.id !== -1){
          Swal.fire({
            text: 'Adoption Request Added Successfully',
            icon: 'success',
            confirmButtonText: 'Okay',
            width: 400,
            allowOutsideClick: false
          }).then(result => {
            if (result.value)
              this.route.navigateByUrl('/user/customer');
          })
        } else {
          Swal.fire({
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonText: 'Okay',
            width: 400,
            allowOutsideClick: false
          })
        }
      })
  }


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
   * Method to get selected vendor booking index.
   * @param index : Parameter for selected index.
   */
  selectedVendor = (index) => {
    this.submitted = true;
    if (this.parentForm.invalid)
      return;
    else {
      this.spinner.show();
      this.imageList = [];
      this.vendorId = index;
      this._authService.request('get', `vendors/images?vendor_id=${index}&image_type=PET`)
        .subscribe(response => {
          response.res.forEach(element => {
            if (element.position === 1001 || element.position === 1002 || element.position === 1003 || element.position === 1004) {
              this.imageList.push(element.base_url);
              this.displayCount = 1;
              this.spinner.hide();
            }
          });
        });
    }
  }

  /**
   * Method to get back previous page
   */
  backFilter = () => {
    this.displayCount = 0;
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
