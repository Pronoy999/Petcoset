import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-boarding',
  templateUrl: './boarding.component.html',
  styleUrls: ['./boarding.component.css']
})
export class BoardingComponent implements OnInit {

  lableList: string[] = ['Booking information', 'Pet information', 'Pet friend Choose', 'Payment'];
  constructor() { }

  ngOnInit() {
  }

}
