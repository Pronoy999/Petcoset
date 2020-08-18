import { ToastrService } from 'ngx-toastr';
import { UserDetails } from './../../authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { Constant } from 'src/app/core/helper/constant';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2'

declare const Razorpay: any;

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  userDetails: UserDetails;
  subscriptionId;
  amount;

  constructor(
    private _authService: AuthenticationService,
    private route: Router,
    private constant: Constant,
    private spinner: NgxSpinnerService,
    private ngZone: NgZone,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
    this.userDetails = this._authService.getUserDetails();
  }
/**
 * METHOD TO SUBSCRIBE BY USER.
 * @param value : TYPE OF SUBSCRIPTION
 */
  subscribe = (value) => {
    let user = this._authService.getUserDetails();
    if(user) {
      switch(value) {
        case 'regular': 
          this.subscriptionId = 1;
          this.amount = '4999';
          this.regularSubcription();
          break;
        case 'premium':
          this.subscriptionId = 2;
          this.amount = '7999';
          this.permiumSubscription();
          break;
        case 'training':
          this.subscriptionId = 3;
          this.amount = '3499';
          this.trainingSubscription();
          break;
      }
    } else {
      this.route.navigateByUrl('/auth/login');
    }
  }

  /**
   * METHOD FOR INIT RAZORPAY WHICH WILL PROVIDE FULL DETAILS OF PAYMENT AND PAYMENT UI.
   * @param amount: PARAMETER FOR AMOUNT OF TRANSACTION
   * @param subscriptionType: PARAMETER FOR TRANSCRIPTION DESCRIPTION
   */
  initRazorpay = (amount, subscriptionType) => {
    const rzpConfig = {
      "key": this.constant.RAZORPAY_KEY_ID,
      "amount": amount * 100, // 2000 paise = INR 20
      "name": "Petcoset",
      "description": subscriptionType,
      "image": '',
      "prefill": {
        "name": `${this.userDetails.first_name} ${this.userDetails.last_name}`,
        "email": `${this.userDetails.email}`
      },
      "notes": {
        "address": `${this.userDetails.address_1} ${this.userDetails.address_2}`
      },
      "theme": {
        "color": "#0d519c"
      },
      "handler": this.getTnxId.bind(this),
    }
    let rzp = new Razorpay(rzpConfig);
    rzp.open()
  }

  /**
   * METHOD FOR CATCH TRANSACTION ID OF TRANSACTION
   * @param response 
   */
  getTnxId = (response) => {
    this.confirmSubscription(response.razorpay_payment_id);
  }

  /**
   * METHOD FOR REGULAR SUBSCRIPTION
   */
  regularSubcription = () => {
    this.initRazorpay('4999', 'Regualr Subscription');
  }

  /**
   * METHOD FOR PREMIUM SUBSCRIPTION.
   */
  permiumSubscription = () => {
    this.initRazorpay('7999', 'Permium Subscription');
  }

  /**
   * METHOD FOR TRAINING SUBSCRIPTION.
   */
  trainingSubscription = () => {
    this.initRazorpay('3499', 'Training Subscription');
  }

  /**
   * METHOD FOR CONFIRM SUBSCRIPTION AND API CALL FOR UPLOADING TRANSACTION DATA IN  DATABASE.
   */
  confirmSubscription = (tnxId) => {
    this.spinner.show();
    const data = {};
    data['subscription_id'] = this.subscriptionId;
    data['total_amount'] = this.amount;
    data['transaction_id'] = tnxId;
    data['customer_id'] = this.userDetails.id;
    if(data) {
      this._authService.request('post', `booking/subscription`, data)
        .subscribe(response => {
          console.log('subscription response ', response);
          if(response.res.id !== -1)  {
            this.spinner.hide();
            Swal.fire({
              text: 'Subscription Added Successfully!',
              icon: 'success',
              confirmButtonText: 'OKay',
              width: 400,
              allowOutsideClick: false
            }).then(result => {
              if(result.value) {
                this.ngZone.run(() => this.route.navigate(['/user/customer']))
              }
            });
          } else {
            this.toaster.error('', 'This subscription plan is already taken by you!');
          }
        }, err => {
          if(err === 403) {
            this.spinner.hide();
            localStorage.clear();
            this.route.navigateByUrl('/user/customer');
          } else {
            this.toaster.error('', 'Something went to wrong! Please try again later');
            this.spinner.hide();
          }
        });
    } 
  }

}
