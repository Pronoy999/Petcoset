import { UserDetails } from './../../../authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

export interface booking {
  CustomerFirstName: string;
  CustomerLastName: string;
}

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {

  bookingId;
  bookingDetails: booking[] = [];
  userDetails: UserDetails;
  type;
  vendorList = [];
  selectedId = false;
  vendorSelectErrorText = '';

  constructor(
    private _authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private activateroute: ActivatedRoute,
    private toaster: ToastrService,
    private router: Router,
    private active: ActivatedRoute
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.type = this.active.snapshot.params.type;
    this.userDetails = this._authService.getUserDetails();
    this.bookingId = this.activateroute.snapshot.params.id;
    this._authService.headerText.next({
      headerStrong: 'Customer Details'
    });
    this.getBookingById();
  }

  /**
   * METHOD TO GET BOOKING DETAILS BY ID.
   */
  getBookingById = () => {
    setTimeout(() => {
      this._authService.request('get', `booking?booking_id=${this.bookingId}`)
        .subscribe(response => {
          this.bookingDetails = response.res[0];
          this.getVendorList();
          this.spinner.hide();
        })
    }, 1000);
  }

  /**
   * METHOD TO APPROVE BOOKING.
   */
  approveRequest = () => {
    this.spinner.show();
    let data = {};
    data['booking_id'] = +this.bookingId;
    data['user_id'] = this.userDetails.id;
    data['vendor_id'] = this.bookingDetails['vendor_id'];
    data['total_amount'] = this.bookingDetails['total_amount'];
    data['address_id'] = this.bookingDetails['address_id'];
    data['booking_time'] = this.bookingDetails['booking_time'];
    data['booking_date'] = this.bookingDetails['booking_date'].split('T')[0];
    data['remarks'] = '';
    data['booking_status_id'] = 13;
    if (data) {
      console.log(data);
      this._authService.request('put', `booking`, data)
        .subscribe(response => {
          if (response.res.id !== -1) {
            this.toaster.success('Petcoset Admin', 'Request Approved');
            this.router.navigateByUrl('/admin/customer/customer-list');
            this.spinner.hide();
          }
        });
    }
  }

  /**
   * METHOD TO REJECT BOOKING
   */
  rejectRequest = () => {
    this.spinner.show();
    let data = {};
    data['booking_id'] = +this.bookingId;
    data['user_id'] = this.userDetails.id;
    data['vendor_id'] = this.bookingDetails['vendor_id'];
    data['total_amount'] = this.bookingDetails['total_amount'];
    data['address_id'] = this.bookingDetails['address_id'];
    data['booking_time'] = this.bookingDetails['booking_time'];
    data['booking_date'] = this.bookingDetails['booking_date'].split('T')[0];
    data['remarks'] = '';
    data['booking_status_id'] = 7;
    if (data) {
      console.log(data);
      this._authService.request('put', `booking`, data)
        .subscribe(response => {
          if (response.res.id !== -1) {
            this.toaster.success('Petcoset Admin', 'Request Rejcted');
            this.router.navigateByUrl('/admin/customer/customer-list');
            this.spinner.hide();
          }
        });
    }
  }

  /**
   * METHOD TO GET VENDOR LIST
   */
  getVendorList = () => {
    this._authService.request('get', `services/vendors?service_id=${this.bookingDetails['service_id']}&booking_date=${this.bookingDetails['booking_date'].split('T')[0]}&booking_time=${this.bookingDetails['booking_time']}`)
      .subscribe(response => {
        this.vendorList = response.res
      });
  }
  /**
   * METHOD TO GET NEW SELECTED VENDOR.
   * @param id : PARAMETER TO GET NEW VENDOR'S VENDOR ID.
   */
  getNewVendor = (id) => {
    if (id) {
      this.selectedId = id;
    }
  }

  /**
   * METHOD TO UPDATE VENDOR DETAILS OF CUSTOMER.
   */
  updateVendor = () => {
    if (this.selectedId) {
      this.vendorSelectErrorText = '';
    } else {
      this.vendorSelectErrorText = 'Please Select One Vendor';
    }

    if (!this.vendorSelectErrorText) {
      this.spinner.show();
      const data = {};
      data['booking_id'] = +this.bookingId;
      data['user_id'] = this.userDetails.id;
      data['vendor_id'] = +this.selectedId;
      data['total_amount'] = this.bookingDetails['total_amount'];
      data['address_id'] = this.bookingDetails['address_id'];
      data['booking_time'] = this.bookingDetails['booking_time'];
      data['booking_date'] = this.bookingDetails['booking_date'].split('T')[0];
      data['remarks'] = '';
      data['booking_status_id'] = 6;
      console.log(data);
      this._authService.request('put', `booking`, data)
        .subscribe(response => {
          if (response.res.id !== -1) {
            this.toaster.success('Petcoset Admin', 'vendor Updated');
            this.router.navigateByUrl('/admin/customer/customer-list');
            this.spinner.hide();
          } else {
            this.toaster.success('Petcoset Admin', 'Something went wrong!');
            this.router.navigateByUrl('/admin/customer/customer-list');
            this.spinner.hide();
          }
        }, err => {
          this.toaster.success('Petcoset Admin', 'Something went wrong!');
          this.router.navigateByUrl('/admin/customer/customer-list');
          this.spinner.hide();
        }); 
    } else {
      this.vendorSelectErrorText = 'Please Select One Vendor';
    }
  }

}
