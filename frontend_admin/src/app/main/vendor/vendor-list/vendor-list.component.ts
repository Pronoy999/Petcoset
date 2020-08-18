import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {

  vendorList = [];
  constructor(
    private _authService: AuthenticationService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this._authService.headerText.next({
      headerStrong: 'Pending Vendors List'
    });
    this.getvendorList();
  }

  getvendorList() {
    setTimeout(()=>{
      this._authService.request('get', `vendors?status_id=Confirmed`)
        .subscribe((response) => {
          this.vendorList = response.res;
          console.log('vendor list ', this.vendorList);
          this.spinner.hide();
        });
    },1000);
  }

}
