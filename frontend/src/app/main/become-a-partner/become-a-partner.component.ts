import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthenticationService } from 'src/app/authentication.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-become-a-partner',
  templateUrl: './become-a-partner.component.html',
  styleUrls: ['./become-a-partner.component.css']
})
export class BecomeAPartnerComponent implements OnInit {

  displayCount = 1;
  parentForm: FormGroup;
  isParentFormSubmitted = false;
  userMobileNumber;
  userOtpValue = '';
  selectServiceList = [];
  enlistDogList = [];
  isSelectionError = false;
  isEnlistDogError = false;
  getOtp;
  vendorId;
  confirmationText = '';
  phoneNoRegisterMessage = '';
  fileContent;
  fileUploadErrorMessage = 'Pdf only';
  imgdate: any;

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: Router,
    private _authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.initParentFomr();
  }

  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: true,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  initParentFomr() {
    this.parentForm = this.formBuilder.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      mobileNo: ['', Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      identity: ['', Validators.compose([Validators.required])],
      idProofNumber: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      password: ['', [Validators.compose([Validators.required,
      Validators.pattern("(?=^.{6,16}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?&gt;.&lt;,])(?!.*\\s).*$")])]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    })
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  submitPartnar() {
    this.isParentFormSubmitted = true;
    if (this.parentForm.invalid)
      return;
    else {
      this.spinner.show();
      this.userMobileNumber = `+91${this.parentForm.controls.mobileNo.value}`;
      let data = {... this.parentForm.value};
      data.first_name = this.parentForm.controls.first_name.value;
      data.last_name = this.parentForm.controls.last_name.value;
      data.password = btoa(this.parentForm.controls.password.value);
      data.phone_number = `+91${this.parentForm.controls.mobileNo.value}`;
      data.document_type = this.parentForm.controls.identity.value;
      data.document_id_number = this.parentForm.controls.idProofNumber.value;
      data.pincode = 0;
      delete data.name;
      delete data.mobileNo;
      delete data.confirmPassword;
      delete data.identity;
      delete data.idProofNumber;
      this._authService.request('post',`vendors`,data)
        .subscribe((response) => {
          this.vendorId = response.res.id;
          if(this.vendorId !== -1) {
            this.displayCount = 2;
            this.spinner.hide();
          } else {
            this.phoneNoRegisterMessage = 'This Phone Number is already registered!';
            this.spinner.hide();
          }
      })
    }
  }

  onOtpChange(otp) {
    this.userOtpValue = otp;
  }

  createAccount() {
    if(this.userOtpValue !== '') {
      this.spinner.show();
      const data = {};
      data['vendor_id'] = this.vendorId;
      data['otp'] = this.userOtpValue;
      this._authService.request('post', `vendors/2f`, data)
        .subscribe((response) => {
          this.spinner.hide();
          Swal.fire({
            text: 'Registration is successfull, Please login and fill up all required information!',
            icon: 'success',
            confirmButtonText: 'Okay',
            width: 400,
            allowOutsideClick: false
          }).then((result) => {
            if(result.value){
              this.route.navigateByUrl('/auth/login');
            }
          })
        })
    }
  }

  uploadDocument(event):any {
    let file = event.target.files[0];
    console.log('file ', file);
    if(file.type === 'application/pdf') {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
     /*  fileReader.onloadend = function(x) {
         console.log(btoa(fileReader.result.toString()));
      } */
    fileReader.onload = () => this.getFileValue(btoa(fileReader.result.toString()));
    this.fileUploadErrorMessage = 'File uploaded Successfully!';
    } else {
      this.fileUploadErrorMessage = 'Please Uplaod PDF file only!';
    }
  }

  uploadedFile(event) {
    this.uploadDocument(event);
  }

  getFileValue(result) {
    this.imgdate = atob(result);
    console.log('img date ', this.imgdate);
  }

}
