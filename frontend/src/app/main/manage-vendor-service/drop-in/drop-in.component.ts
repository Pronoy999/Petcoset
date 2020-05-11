import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drop-in',
  templateUrl: './drop-in.component.html',
  styleUrls: ['./drop-in.component.css']
})
export class DropInComponent implements OnInit {

  isDogSelected = false;
  isCatSelected = false;
  isLookAfterOneClicked = false;
  isLookAfterTwoClicked = false;
  isLookAfterThreeClicked = false;
  isLookAfterFourClicked = false;
  isOneVisitClicked = false;
  isTwoVisitClicked = false;
  isThreeVisitClicked = false;
  constructor() { }

  ngOnInit() {
  }

  serviceProvide(value){
    this.isDogSelected = value === 'dog' ? true : false;
    this.isCatSelected = value === 'cat' ? true : false;
  }

  lookAfterClicked(value) {
    this.isLookAfterOneClicked = value === 1 ? true : false;
    this.isLookAfterTwoClicked = value === 2 ? true : false;
    this.isLookAfterThreeClicked = value === 3 ? true : false;
    this.isLookAfterFourClicked = value === 4 ? true : false; 
  }

  visitProvide(value) {
    this.isOneVisitClicked = value === 1 ? true : false;
    this.isTwoVisitClicked = value === 2 ? true : false;
    this.isThreeVisitClicked = value === 3 ? true : false;
  }

}
