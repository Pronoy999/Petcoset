import { UserDetails, AuthenticationService } from './../../authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  serviceText = 'Petcoset!';
  isClicked;
  isboardingClicked = false;
  isDropInClicked = false;
  isDayCareClicked = false;
  isHomeSittingClick = false;
  isTrainnerClick = false;
  isGrommingClick = false;
  isWalkingClick = false;
  isMatingClick = false;
  isVeterinaryClicked = false;
  isAdptionClicked = false;
  selectedPath = '';
  userDetails: UserDetails;
  isVendor: boolean;


  constructor(
    private router: Router,
    private _authService: AuthenticationService
  ) { 
    this.isVendor = false;
  }

  ngOnInit() {
    this.userDetails = this._authService.getUserDetails();
    this.getuserType();
  }

  getServiceText(service) {
    switch (service) {
      case 'boarding':
        this.serviceText = 'Slumber parties and play dates for your pet, for as long you want';
        this.isboardingClicked = true;
        this.isDropInClicked = false;
        this.isDayCareClicked = false;
        this.isHomeSittingClick = false;
        this.isTrainnerClick = false;
        this.isGrommingClick = false;
        this.isWalkingClick = false;
        this.isMatingClick = false;
        this.isVeterinaryClicked = false;
        this.isAdptionClicked = false;
        this.selectedPath = 'boarding';
        break;
      case 'dropIn':
        this.serviceText = 'We will keep visiting by and say Hi!';
        this.isboardingClicked = false;
        this.isDropInClicked = true;
        this.isDayCareClicked = false;
        this.isHomeSittingClick = false;
        this.isTrainnerClick = false;
        this.isGrommingClick = false;
        this.isWalkingClick = false;
        this.isMatingClick = false;
        this.isVeterinaryClicked = false;
        this.isAdptionClicked = false;
        this.selectedPath = 'dropIn';
        break;
      case 'dayCare':
        this.serviceText = 'Daytime play time for your furry buddy with an unlimited amount of hugs and snuggles';
        this.isboardingClicked = false;
        this.isDropInClicked = false;
        this.isDayCareClicked = true;
        this.isHomeSittingClick = false;
        this.isTrainnerClick = false;
        this.isGrommingClick = false;
        this.isWalkingClick = false;
        this.isMatingClick = false;
        this.isVeterinaryClicked = false;
        this.isAdptionClicked = false;
        this.selectedPath = 'dayCare';
        break;
      case 'homeSitting':
        this.serviceText = 'A professional pet-sitter to look after your buddy overnight';
        this.isboardingClicked = false;
        this.isDropInClicked = false;
        this.isDayCareClicked = false;
        this.isHomeSittingClick = true
        this.isTrainnerClick = false;
        this.isGrommingClick = false;
        this.isWalkingClick = false;
        this.isMatingClick = false;
        this.isVeterinaryClicked = false;
        this.isAdptionClicked = false;
        this.selectedPath = 'homeSitting';
        break;
      case 'trinner':
        this.serviceText = 'Coaches to coach your furry fairy';
        this.isboardingClicked = false;
        this.isDropInClicked = false;
        this.isDayCareClicked = false;
        this.isHomeSittingClick = false;
        this.isTrainnerClick = true;
        this.isGrommingClick = false;
        this.isWalkingClick = false;
        this.isMatingClick = false;
        this.isVeterinaryClicked = false;
        this.isAdptionClicked = false;
        this.selectedPath = 'trainer'
        break;
      case 'gromming':
        this.serviceText = 'Washing, Smiling, Clipping drying and getting your buddy squeaky clean';
        this.isboardingClicked = false;
        this.isDropInClicked = false;
        this.isDayCareClicked = false;
        this.isHomeSittingClick = false;
        this.isTrainnerClick = false;
        this.isGrommingClick = true;
        this.isWalkingClick = false;
        this.isMatingClick = false;
        this.isVeterinaryClicked = false;
        this.isAdptionClicked = false;
        this.selectedPath = 'gromming';
        break;
      case 'walking':
        this.serviceText = 'Because we are always up for a long, bouncy scroll, sun in or sun out!';
        this.isboardingClicked = false;
        this.isDropInClicked = false;
        this.isDayCareClicked = false;
        this.isHomeSittingClick = false;
        this.isTrainnerClick = false;
        this.isGrommingClick = false;
        this.isWalkingClick = true;
        this.isMatingClick = false;
        this.isVeterinaryClicked = false;
        this.isAdptionClicked = false;
        this.selectedPath = 'walking';
        break;
      case 'mating':
        this.serviceText = 'Bceause Love and Family, knows no boundaries!';
        this.isboardingClicked = false;
        this.isDropInClicked = false;
        this.isDayCareClicked = false;
        this.isHomeSittingClick = false;
        this.isTrainnerClick = false;
        this.isGrommingClick = false;
        this.isWalkingClick = false;
        this.isMatingClick = true;
        this.isVeterinaryClicked = false;
        this.isAdptionClicked = false;
        this.selectedPath = 'mating';
        break;
      case 'veterinary':
        this.serviceText = 'Regular mrdical care for your BFFs good health';
        this.isboardingClicked = false;
        this.isDropInClicked = false;
        this.isDayCareClicked = false;
        this.isHomeSittingClick = false;
        this.isTrainnerClick = false;
        this.isGrommingClick = false;
        this.isWalkingClick = false;
        this.isMatingClick = false;
        this.isVeterinaryClicked = true;
        this.isAdptionClicked = false;
        this.selectedPath = 'veterinary';
        break;
      case 'adption':
        this.serviceText = 'Because theres no place like home';
        this.isboardingClicked = false;
        this.isDropInClicked = false;
        this.isDayCareClicked = false;
        this.isHomeSittingClick = false;
        this.isTrainnerClick = false;
        this.isGrommingClick = false;
        this.isWalkingClick = false;
        this.isMatingClick = false;
        this.isVeterinaryClicked = false;
        this.isAdptionClicked = true;
        this.selectedPath = 'adoption';
        break;
      default:
        this.serviceText = 'Petcoset!';
    }
  }

  /**
   * METHOD TO NAVIGATE ONE PAGE TO ANOTHER PAGE FOR MOBILE VERSION 
   */
  serviceLink = () => {
    switch (this.selectedPath) {
      case 'boarding':
        this.router.navigateByUrl('/customer/boarding');
        break;
      case 'dropIn':
        this.router.navigateByUrl('/customer/drop-in');
        break;
      case 'dayCare':
        this.router.navigateByUrl('/customer/day-care');
        break;
      case 'homeSitting':
        this.router.navigateByUrl('/customer/home-sitting');
        break;
      case 'trainer':
        this.router.navigateByUrl('/customer/trainer');
        break;
      case 'gromming':
        this.router.navigateByUrl('/customer/grooming');
        break;
      case 'walking':
        this.router.navigateByUrl('/customer/pet-walking');
        break;
      case 'mating':
        this.router.navigateByUrl('/customer/mating')
        break;
      case 'veterinary':
        this.router.navigateByUrl('/customer/veterinary-doctor');
        break;
      case 'adoption':
        this.router.navigateByUrl('/customer/adoption');
        break;
    }
  }

  getuserType = () => {
    this.isVendor = this.userDetails.role === 'tbl_VendorMaster' ? true : false;
  }

}
