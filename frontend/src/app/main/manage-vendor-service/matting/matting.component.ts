import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService, UserDetails } from 'src/app/authentication.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-matting',
  templateUrl: './matting.component.html',
  styleUrls: ['./matting.component.css']
})
export class MattingComponent implements OnInit {

  parentForm: FormGroup;
  isDogSelected = false;
  isCatSelected = false;
  isLookAfterOneClicked = false;
  isLookAfterTwoClicked = false;
  isLookAfterThreeClicked = false;
  isLookAfterFourClicked = false;
  isSubimitted = false;
  petGender;
  userDetails: UserDetails;

  public imgPosOneText: string;
  public imgPosTwoText: string;
  public imgPosThreeText: string;
  public imgPosFourText: string;

  public uploadedFileList = ['', '', '', ''];

  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private _authService: AuthenticationService,
    private route: Router,
  ) { }

  ngOnInit() {
    this.initParentForm();
    this.userDetails = this._authService.getUserDetails();
    this.getUploadedImages();
  }

  serviceProvide(value) {
    this.isDogSelected = value === 'M' ? true : false;
    this.isCatSelected = value === 'F' ? true : false;
    this.petGender = value;
  }

  lookAfterClicked(value) {
    this.isLookAfterOneClicked = value === 1 ? true : false;
    this.isLookAfterTwoClicked = value === 2 ? true : false;
    this.isLookAfterThreeClicked = value === 3 ? true : false;
    this.isLookAfterFourClicked = value === 4 ? true : false;
  }

  initParentForm() {
    this.parentForm = this._formBuilder.group({
      breed: ['', Validators.compose([Validators.required])],
      pet_sex: [''],
      pet_age: [''],
      is_pedigree_certificate: [0],
      is_written_medical_certificate: [0],
      service_charge: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])]
    })
  }

  submitAdoption() {
    this.isSubimitted = true;
    if (this.parentForm.invalid)
      return;
    else {
      this.spinner.show();
      const data = { ...this.parentForm.value };
      data.pet_sex = this.petGender;
      data.pet_age = +data.pet_age;
      data.is_pedigree_certificate = data.is_pedigree_certificate === true ? 1 : 0;
      data.is_written_medical_certificate = data.is_written_medical_certificate === true ? 1 : 0;
      data.service_charge = +data.service_charge;
      data.service_duration_hours = 1;
      data.vendor_id = this.userDetails.id;
      data.service_id = 8;
      this._authService.request('post', `vendors/service`, data)
        .subscribe((response) => {
          this.spinner.hide();
          Swal.fire({
            text: 'Mating is successfully added with your account!',
            icon: 'success',
            confirmButtonText: 'OKay',
            width: 400,
            allowOutsideClick: false
          }).then((result) => {
            if (result.value)
              this.route.navigateByUrl('/user/vendor');
          })
        })
    }
  }
  /**
   * Method to upload images.
   * @param event : Parameter for blob file
   * @param position : Parameter for Position,
   */
  uploadImages = (event, position) => {
    let file = event.target.files[0];
    let fileReader = new FileReader();
    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      fileReader.readAsBinaryString(file);
      fileReader.onload = () => this.uploadImagesToServer(btoa(fileReader.result.toString()), position, file.type);
    } else {
      if (position === 801)
        this.imgPosOneText = 'png/jpge only';
      if (position === 802)
        this.imgPosTwoText = 'png/jpge only';
      if (position === 803)
        this.imgPosThreeText = 'png/jpge only';
      if (position === 804)
        this.imgPosFourText = 'png/jpge only';
    }
  }

  /**
   * Method to upload images to server,
   * @param file : Parameter for file.
   * @param pos : Parameter for position.
   * @param fileType : Parameter for file type.
   */
  uploadImagesToServer = (file, pos, fileType) => {
    this.spinner.show();
    let data = {};
    data['vendor_id'] = this.userDetails.id;
    data['image_type'] = 'PET';
    data['image_data'] = file;
    data['file_extension'] = fileType.split("/")[1];
    data['position'] = pos;
    this._authService.request('post', `vendors/images`, data)
      .subscribe(response => {
        if (pos === 801)
          this.imgPosOneText = 'Uploaded Successfully';
        if (pos === 802)
          this.imgPosTwoText = 'Uploaded Successfully';
        if (pos === 803)
          this.imgPosThreeText = 'Uploaded Successfully';
        if (pos === 804)
          this.imgPosFourText = 'Uploaded Successfully';
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
          if (response.res.filter(x => x.position === 801)[0] !== undefined)
            this.uploadedFileList[0] = response.res.filter(x => x.position === 801)[0].base_url;
          if (response.res.filter(x => x.position === 802)[0] !== undefined)
            this.uploadedFileList[1] = response.res.filter(x => x.position === 802)[0].base_url;
          if (response.res.filter(x => x.position === 803)[0] !== undefined)
            this.uploadedFileList[2] = response.res.filter(x => x.position === 803)[0].base_url;
          if (response.res.filter(x => x.position === 804)[0] !== undefined)
            this.uploadedFileList[3] = response.res.filter(x => x.position === 804)[0].base_url
        }
        this.spinner.hide();
      });
  }

}
