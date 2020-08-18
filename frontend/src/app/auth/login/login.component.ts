import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/authentication.service';
import { FacebookLoginProvider } from "angularx-social-login";
declare var FB: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  screenHeight;
  mobileScreentHeight;
  loginFrom: FormGroup;
  isLoginFormSubmitted = false;
  isLoginError = false;
  returnUrl: string;
  isAccpected: boolean;
  loggedIn: boolean;
  FBLoginEmail;
  FBAccessToken;

  constructor(
    private _formBuilder: FormBuilder,
    private route: Router,
    private spinner: NgxSpinnerService,
    private _authService: AuthenticationService,
    private active: ActivatedRoute,
    private ngZone: NgZone
  ) {
    this.isAccpected = true;
  }

  ngOnInit() {
    this.screenHeight = +screen.height - 143;
    this.mobileScreentHeight = +this.screenHeight;
    this.returnUrl = this.active.snapshot.queryParams['returnUrl'] || '/';
    this.initLoginFrom();


    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '578045989558043',
        cookie: true,
        xfbml: true,
        version: 'v3.1'
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }

  initLoginFrom() {
    this.loginFrom = this._formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      ts: ['']
    })
  }

  loginSubmit() {
    this.isLoginFormSubmitted = true;
    if (this.loginFrom.invalid)
      return;
    else {
      this.spinner.show();
      const data = { ... this.loginFrom.value };
      data.email_id = this.loginFrom.controls.email.value;
      data.password = btoa(this.loginFrom.controls.password.value);
      this._authService.request('post', `auth`, data)
        .subscribe((response) => {
          console.log('login details ', response.res);
          if (response.res.user_data.id === -1) {
            this.isLoginError = true;
            this.spinner.hide();
          } else {
            this._authService.setToken(response.res.jw_token);
            localStorage.setItem('userDetails', JSON.stringify(response.res.user_data));
            console.log('return url ', this.returnUrl);
            if (this.returnUrl === '/') {
              if (response.res.user_data.role === 'tbl_CustomerMaster') {
                this.route.navigateByUrl('/user/customer');
                this.spinner.hide();
              }
              else {
                this.route.navigateByUrl('/user/vendor');
                this.spinner.hide();
              }
            } else {
              this.route.navigateByUrl(this.returnUrl);
              this.spinner.hide();
            }
          }
        })
    }
  }

  socialLogin = () => {
    let email;
    let token;
    let name;
    FB.login((response) => {
      if (response.authResponse) {
        if (response.status === 'connected') {
          console.log('response ', response);
          FB.api(response.authResponse.userID, 'GET', { "fields": "email,id,name,gender" }, (userInfo) => {
            console.log(userInfo);
            email = userInfo.email;
            token = btoa(response.authResponse.userID);
            name = userInfo.name;
            this.fullFBLogin(email, token, name);
          });
        }
      } else {
        console.log('FB login fail');
      }
    }, { scope: 'email' });

  }

  fullFBLogin = (email, token, name) => {
    this.spinner.show();
    const data = {};
    data['email_id'] = email;
    data['password'] = token;
    console.log(data);
    this._authService.request('post', `auth`, data)
      .subscribe(res => {
        console.log('login details ', res.res);
        if (res.res.user_data.id === -1) {
          this.spinner.hide();
          Swal.mixin({
            input: 'select',
            confirmButtonText: 'Next',
            showCancelButton: true,
            inputOptions: { 'Vendor': 'Vendor', 'Customer': 'Customer' },
            allowOutsideClick: false
          }).queue([
            {
              title: '',
              text: 'Select type'
            },
          ]).then((result) => {
            if (result.value) {
              this.spinner.show();
              const answers = JSON.stringify(result.value);
              const type = answers.split('"')[1];
              const splitName = name.split(" ");
              const fistName = splitName[0];
              const lastName = splitName[splitName.length - 1];

              const data1 = {};
              data1['email_id'] = email;
              data1['password'] = token;
              data1['first_name'] = fistName;
              data1['last_name'] = lastName;
              data1['role'] = type;

              this._authService.request('post', `auth/social-register`, data1)
                .subscribe(resposne => {
                  Swal.fire({
                    title: 'Successfull',
                    icon: 'success'
                  })
                });

            }
          });
          this.spinner.hide();
        } else {
          console.log('this is social else part');
          this._authService.setToken(res.res.jw_token);
          localStorage.setItem('userDetails', JSON.stringify(res.res.user_data));
          console.log('return url ', this.returnUrl);
          if (this.returnUrl === '/') {
            if (res.res.user_data.role === 'tbl_CustomerMaster') {
              /* this.route.navigateByUrl('/user/customer'); */
              this.ngZone.run(()=>this.route.navigateByUrl('/user/customer'));
              this.spinner.hide();
            }
            else {
              /* this.route.navigateByUrl('/user/vendor'); */
              this.ngZone.run(() => this.route.navigateByUrl('/user/vendor'));
              this.spinner.hide();
            }
          } else {
            this.route.navigateByUrl(this.returnUrl);
            this.spinner.hide();
          }
        }
      });
  }

}
