import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vendor-verified',
  templateUrl: './vendor-verified.component.html',
  styleUrls: ['./vendor-verified.component.scss']
})
export class VendorVerifiedComponent implements OnInit {

  verifiedVendorList = [];
  constructor(
    private _authService: AuthenticationService,
    private route: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this._authService.headerText.next({
      headerStrong: 'Verified Vendors List'
    });
    this.getVerifiedVendorList();
  }

  getVerifiedVendorList() {
    setTimeout(() => {
      this._authService.request('get',`vendors?status_id=Verified`)
        .subscribe((response) => {
          console.log('vendor list ', response);
          this.verifiedVendorList = response.res;
          this.spinner.hide()
        })
    }, 1000);
  }

}
