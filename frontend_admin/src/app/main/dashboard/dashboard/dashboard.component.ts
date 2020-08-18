import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  vendorCount = 0;
  verifiedVendorCount = 0;

  constructor(
    private _authService: AuthenticationService,
    private route: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this._authService.headerText.next({
      headerStrong: 'Dashboard'
    });
    this.getVendorCount();
    this.getVerifiedVendorCount();
  }

  getVendorCount() {
    setTimeout(() => {
      this._authService.request('get', 'vendors?status_id=Pending')
        .subscribe((response) => {
          this.vendorCount = response.res.length;
          this.spinner.hide();
        })
    }, 1000);
  }

  getVerifiedVendorCount() {
    this._authService.request('get', 'vendors?status_id=Verified')
      .subscribe((response) => {
        this.verifiedVendorCount = response.res.length;
        this.spinner.hide();
      })
  }

  getpath(value) {
    if (value === 'vendor')
      this.route.navigateByUrl('admin/vendor/vendor-list')
    if (value === 'vendor-verified')
      this.route.navigateByUrl('admin/vendor/vendor-verified-list');
    if(value === 'customer') 
      this.route.navigateByUrl('admin/customer/customer-list/pending');
    if(value === 'customer-approve') {
      this.route.navigateByUrl('admin/customer/customer-list/approve');
    }
  }

}
