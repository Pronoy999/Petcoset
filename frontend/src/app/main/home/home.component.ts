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
  constructor() { }

  ngOnInit() {
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
      break;
      default:
        this.serviceText = 'Petcoset!';
    }
  }

}
