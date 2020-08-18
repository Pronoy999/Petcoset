import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  requestList = [];
  type;
  constructor(
    private _authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private active: ActivatedRoute
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.type = this.active.snapshot.params.type;
    console.log(this.type);
    this._authService.headerText.next({
      headerStrong: 'Customers List'
    });
    this.getCustomerPendingList();
  }

  /**
   * METHOD TO GET PENDING CUSTOMER REQUEST LIST
   */
  getCustomerPendingList = () => {
    if (this.type === 'pending') {
      setTimeout(() => {
        this._authService.request('get', `booking?booking_status_id=4`)
          .subscribe(response => {
            console.log('customer list ', response);
            if (response.res.length > 0) {
              this.requestList = response.res;
            } else {
              this.requestList = [];
            }
            this.spinner.hide();
          });
      }, 1000);
    }
    if (this.type === 'approve') {
      setTimeout(() => {
        this._authService.request('get', `booking?booking_status_id=6`)
        .subscribe(response => {
          console.log('customer list ', response);
          if(response.res.length > 0) {
            this.requestList = response.res;
          } else {
            this.requestList = [];
          }
          this.spinner.hide();
        });
      }, 1000);
     }
  }

}
