import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService, UserDetails } from 'src/app/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-veterinary',
  templateUrl: './veterinary.component.html',
  styleUrls: ['./veterinary.component.css']
})
export class VeterinaryComponent implements OnInit {

  public veterinaryForm: FormGroup;
  public submitted: boolean;
  public idProofText: string;
  public userDetails: UserDetails;
  public ownImagesText: string;
  public registrationText: string;
  public uploadedFileList = ['', ''];

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) {
    this.submitted = false;
    this.idProofText = 'ID proof (PDF Only!)';
    this.ownImagesText = 'Own images(png or jpeg)';
    this.registrationText = 'Registration number or Crossed prescription with registration number';

  }

  ngOnInit() {
    this.userDetails = this._authService.getUserDetails();
    this.initVeterinarytForm();
  }

  /**
   * Method to init veterinary form
   */
  initVeterinarytForm = () => {
    this.veterinaryForm = this._formBuilder.group({
      service_charge: ['', Validators.compose([Validators.required])]
    });
  }

  /**
   * Method to submit veterinary form
   */
  submitVeteinaryForm = () => {
    this.submitted = true;
    if (this.veterinaryForm.invalid)
      return;
    else {
      this.spinner.show();
      const data = { ...this.veterinaryForm.value };
      data.vendor_id = this.userDetails.id;
      data.service_id = 9;
      data.service_charge = +data.service_charge;
      data.pet_type = 'All';
      data.is_delete = 0;
      data.service_duration_hours = 1;
      this._authService.request('post', `vendors/service`, data)
        .subscribe(response => {
          this.spinner.hide();
          Swal.fire({
            text: 'Veterinary is successfully added with your account!',
            icon: 'success',
            confirmButtonText: 'OKay',
            width: 400,
            allowOutsideClick: false
          }).then((result) => {
            if (result.value) {
              this.route.navigateByUrl('/user/vendor');
            }
          })
        });
    }
  }
  /**
   * Method to upload new id proof.
   * @param event: Parameter for file details.
   */
  uploadIdProof = (event): any => {
    let file = event.target.files[0];
    if (file.type === 'application/pdf') {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      fileReader.onload = () => this.uploadPdf(btoa(fileReader.result.toString()));
    } else {
      this.idProofText = 'Please Uplaod PDF file only!';
    }
  }
  /**
   * Method to upload pdf file to server.
   * @param value : Parameter for file after base64.
   */
  uploadPdf = (value) => {
    this.spinner.show();
    let data = {};
    data['vendor_id'] = this.userDetails.id;
    data['image_type'] = 'DOCUMENT';
    data['image_data'] = value;
    data['file_extension'] = 'pdf';
    data['position'] = 900;
    this._authService.request('post', `vendors/images`, data)
      .subscribe(response => {
        this.idProofText = 'Uploaded Successfully';
        this.spinner.hide();
      });
  }

  /**
   * Method to uplaod Images.
   * @param event : Parameter for images upload.
   */
  uploadImages = (event) => {
    let file = event.target.files[0];
    let fileReader = new FileReader();
    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      fileReader.readAsBinaryString(file);
      fileReader.onload = () => this.uploadVendorImages(btoa(fileReader.result.toString()), file.type);
    } else {
      this.ownImagesText = 'png/jpeg image file only!';
    }
  }
  /**
   * Method to upload images to server.
   * @param file : Parameter for blob file.
   * @param fileType : Parameter for file extension type.
   */
  uploadVendorImages = (file, fileType) => {
    this.spinner.show();
    let data = {};
    data['vendor_id'] = this.userDetails.id;
    data['image_type'] = 'PET';
    data['image_data'] = file;
    data['file_extension'] = fileType.split('/')[1];
    data['position'] = 901;
    this._authService.request('post', `vendors/images`, data)
      .subscribe(response => {
        this.ownImagesText = 'Uploaded Successfully';
        this.getUploadedImages();
      });
  }
  /**
   * Method to upload registration file
   * @param event : Parameter for file.
   */
  registrationUpload = (event) => {
    let file = event.target.files[0];
    let fileReader = new FileReader();
    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      fileReader.readAsBinaryString(file);
      fileReader.onload = () => this.uploadRegistration(btoa(fileReader.result.toString()), file.type);
    } else {
      this.registrationText = 'png/jpeg image file only!';
    }
  }
  /**
   * Method to upload registration to server.
   * @param file : Parameter for blob file.
   * @param fileType : Parameter for file type.
   */
  uploadRegistration = (file, fileType) => {
    this.spinner.show();
    let data = {};
    data['vendor_id'] = this.userDetails.id;
    data['image_type'] = 'PET';
    data['image_data'] = file;
    data['file_extension'] = fileType.split('/')[1];
    data['position'] = 902;
    this._authService.request('post', `vendors/images`, data)
      .subscribe(response => {
        this.registrationText = 'Uploaded Successfully';
        this.getUploadedImages();
      });
  }

  /**
    * Method to get Uploaded images.
    */
  getUploadedImages = () => {
    this._authService.request('get', `vendors/images?vendor_id=${this.userDetails.id}&image_type=PET`)
      .subscribe(response => {
        console.log(response);
        if (response.res.length !== 0) {
          if (response.res.filter(x => x.position === 901)[0] !== undefined)
            this.uploadedFileList[0] = response.res.filter(x => x.position === 901)[0].base_url;
          if (response.res.filter(x => x.position === 902)[0] !== undefined)
            this.uploadedFileList[1] = response.res.filter(x => x.position === 902)[0].base_url;
        }
        this.spinner.hide();
      });
    }

  }
