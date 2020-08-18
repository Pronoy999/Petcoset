import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  public documnetType: string;

  constructor(
    private active: ActivatedRoute
  ) { }

  ngOnInit() {
    this.documnetType = this.active.snapshot.params.type;
  }

}
