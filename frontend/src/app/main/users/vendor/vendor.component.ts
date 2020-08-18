import Swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService, UserDetails } from './../../../authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {

  bookingId;
  bookingDetails = [];
  parentForm: FormGroup;
  isSubscription: boolean;
  userDetails: UserDetails;
  vendorList = [];
  noVendorText;
  addressList;
  subscriptionId;

  constructor(
    private active: ActivatedRoute,
    private _authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private route: Router
  ) {
    this.userDetails = _authService.getUserDetails();
    this.bookingId = this.active.snapshot.params.id;
    this.isSubscription = false;
    this.noVendorText = '';
  }

  ngOnInit() {
    this.spinner.show();
    this.getBookingDetails();
    this.initParentForm();
  }

  /**
   * Method to get booking details.
   */
  getBookingDetails = () => {
    setTimeout(() => {
      this._authService.request('get', `booking?booking_id=${this.bookingId}`)
        .subscribe(response => {
          if (response.res.length !== 0) {
            this.bookingDetails = response.res[0];
            console.log('booking details ', this.bookingDetails);
            this.getSubscriptionDetails();
            this.getVendorDetails();
            this.getCustomerAddressList();
            this.parentForm.patchValue({
              service_name: this.bookingDetails['service_name']
            });
            this.spinner.hide();
          }
        });
    }, 1000);
  }

  /**
   * Method to init parent form.
   */
  initParentForm = () => {
    this.parentForm = this._formBuilder.group({
      service_name: [''],
      extraMessage: [''],
      subscription_id: ['']
    });
  }
  /**
   * Method to get booking subscription details
   */
  getSubscriptionDetails = () => {
    this._authService.request('get', `customers/subscription?customer_id=${this.userDetails.id}`)
      .subscribe(response => {
        this.isSubscription = response.res.find(x => x.ServiceId === this.bookingDetails['service_id']) ? true : false;
      });
  }

  /**
   * Method to get available vendor list
   */
  getVendorDetails = () => {
    this._authService.request('get', `services/vendors?service_id=1&booking_date=${this.bookingDetails['booking_date'].split('T')[0]}&booking_time=${this.bookingDetails['booking_time']}`)
      .subscribe(response => {
        console.log('vendor details ', response);
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
  }

  /**
   * METHOD TO GET CUSTOMER ADDRESS LIST
   * DEFAULT ADDRESS IS THE BOOKING ADDRESS 
   */
  getCustomerAddressList = () => {
    this._authService.request('get', `customers/address?customer_id=${this.userDetails.id}`)
      .subscribe(response => {
        if (response.res.length !== 0) {
          this.addressList = response.res.find(x => x.is_default === 1)['id'];
          console.log('address list ', this.addressList);
        }
      });
  }

  /**
  * METHOD TO GET SELECTED VENDOR AND 
  * CHANGE BLOCK TO PAYMENT BLOCK
  */
  selectedVendor = (id) => {
    Swal.fire({
      title: 'Are you sure to complete this process ?',
      icon: 'warning',
    }).then(result => {
      if (result.value) {
        this.spinner.show();
        const data = { ...this.parentForm.value };
        data.customer_id = +this.userDetails.id;
        data.vendor_id = +id;
        data.total_amount = this.bookingDetails['total_amount'];
        data.service_id = this.bookingDetails['service_id'];
        data.address_id = +this.addressList;
        data.booking_date = this.bookingDetails['booking_date'].split('T')[0];
        data.booking_time = this.bookingDetails['booking_time'];
        data.booking_end_time = this.bookingDetails['booking_end_time'];
        data.remarks = data.extraMessage;
        data.transaction_id = '';
        data.recurringBookings = null;
        data.booking_status_id = 4;
        let url;
        if (data.subscription_id === true) {
          data.subscription_id = this.subscriptionId;
          url = 'booking';
        } else
          url = 'booking/service';

        this._authService.request('put', 'booking', data)
          .subscribe(response => {
            this.spinner.hide();
            Swal.fire({
              text: `${this.bookingDetails['service_name']} Request Added Successfully!`,
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
    })
  }



}
