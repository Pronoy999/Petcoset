import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-address',
  templateUrl: './update-address.component.html',
  styleUrls: ['./update-address.component.css']
})
export class UpdateAddressComponent implements OnInit {

  parentForm: FormGroup;
  isSubmit: boolean = false;
  customerId;
  stateList = [];
  cityList = [];
  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private activateRoute: ActivatedRoute,
    private _authService: AuthenticationService,
    private rouet: Router
  ) { }

  ngOnInit() {
    this.customerId = this.activateRoute.snapshot.params.id;
    this.initAddCustomerAddres();

    this.getStateList();
  }

  initAddCustomerAddres = () => {
    this.parentForm = this._formBuilder.group({
      address_1: ['', Validators.compose([Validators.required])],
      address_2: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      country: ['1', Validators.compose([Validators.required])],
      pincode: ['', Validators.compose([Validators.required])],
      is_default: ['']
    })
  }

  addCustomerAddress = () => {
    this.isSubmit = true;
    if(this.parentForm.invalid)
      return;
    else {
      this.spinner.show();
      const data = { ...this.parentForm.value };
      data.customer_id = +this.customerId;
      data.is_default = data.is_default === true  ? 1 : 0;
      data.city = +data.city;
      data.pincode = +data.pincode;
      delete data.state;
      delete data.country;
      console.log('address details ', data);
      this._authService.request('post', `customers/address`, data)
        .subscribe(response => {
          this.spinner.hide();
          Swal.fire({
            text: 'Address Added Successfully',
            icon: 'success',
            confirmButtonText: 'Okay',
            width: 400,
            allowOutsideClick: false
          }).then(result =>{
            if(result.value){
              this.rouet.navigateByUrl('/user/customer')
            }
          });
        });
    }
  }

  /**
   * GET STATE LIST:
   */
  getStateList = () => {
    this._authService.request('get', `city/state`)
      .subscribe(response => {
        response.res.forEach(element => {
          this.stateList.push({ code: element.id, value: element.state_name });
        });
      })
  }

  /**
   * GET SELECTED COUNTRY FORM DROPDOWN AND
   * GET CITY LIST AS PER SELECTED STATE
   */
  getSelectedState = (value) => {
    this.cityList = [];
    this._authService.request('get', `city?state_id=${value}`)
      .subscribe(response => {
        response.res.forEach(element => {
          this.cityList.push({ code: element.id, value: element.city_name })
        });
      })
  }
}
