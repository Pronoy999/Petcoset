import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-linear-stepper',
  templateUrl: './linear-stepper.component.html',
  styleUrls: ['./linear-stepper.component.css']
})
export class LinearStepperComponent implements OnInit {

  @Input() lableList: string;
  constructor() { }

  ngOnInit() {
  }

}
