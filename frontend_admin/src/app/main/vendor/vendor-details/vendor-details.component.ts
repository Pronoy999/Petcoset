import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { RequiredValidator } from 'src/app/core/validator/required.validator';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss']
})
export class VendorDetailsComponent implements OnInit {

  parentForm: FormGroup;
  bookingId;
  vendorDetails = [];
  vendorBankDetails = [];
  isUpdateError = false;
  isUpdated;


  constructor(
    private _authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private route: Router
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.bookingId = this._activatedRoute.snapshot.params.id;
    this._authService.headerText.next({
      headerStrong: 'Vendor Details'
    });
    this.getvendorDetailsbyId();
    this.initParentForm();
  }

  getvendorDetailsbyId() {
    setTimeout(() => {
      let vendor = this._authService.request('get', `vendors?vendor_id=${this.bookingId}`);
      let details = this._authService.request('get', `vendors/details?vendor_id=${this.bookingId}`);
      forkJoin([vendor, details]).subscribe(response => {
        console.log('vendor details ', response);
        this.vendorDetails = response[0].res[0];
        this.vendorDetails['account_number'] = response[1].res[0] ? response[1].res[0].account_number : '--';
        this.vendorDetails['bank_name'] = response[1].res[0] ? response[1].res[0].bank_name : '--';
        this.vendorDetails['ifsc_code'] = response[1].res[0] ? response[1].res[0].ifsc_code : '--';
        this.spinner.hide();
      });
    }, 1000);
  }

  initParentForm() {
    this.parentForm = this._formBuilder.group({
      payment_gateway_account_id: ['']
    })
  }

  updateVendor() {
    if (this.parentForm.invalid) {
      this.markFormGroupTouched(this.parentForm);
    } else {
      this.spinner.show();
      const data = { ...this.parentForm.value };
      data.account_number = this.vendorDetails['account_number'];
      data.vendor_id = +this.bookingId;
      this.spinner.hide();
      if(data.account_number) {
        this._authService.request('put', `vendors/details`, data)
        .subscribe((response) => {
          this.isUpdated = 'Account Updated Successfully';
          this.route.navigateByUrl('/admin/vendor/vendor-details/');
          this.spinner.hide();
        }, err=>{
          this.isUpdated = 'Something went wrong!';
          this.route.navigateByUrl('/admin/vendor/vendor-details/');
          this.spinner.hide();
        })
      } else {
        this.isUpdateError = true;
        this.spinner.hide();
      }
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getBackPath() {
    if(this.vendorDetails['status_name'] === 'Pending')
      return '/admin/vendor/vendor-list';
    if(this.vendorDetails['status_name'] ==='Verified')
      return '/admin/vendor/vendor-verified-list';
  }

}
