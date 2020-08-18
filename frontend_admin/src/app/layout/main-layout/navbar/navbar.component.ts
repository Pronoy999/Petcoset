import { UserDetails, AuthenticationService } from './../../../authentication.service';
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  status: boolean = false;
  userDetails: UserDetails;
  vendorStatus = false;
  customerStatus = false;

  constructor(
    private eRef: ElementRef,
    private _authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.userDetails = this._authService.getUserDetails();
  }

  sidebarToggle() {
    console.log('toggle button hit', this.status);
    if (this.status === true)
      this.status = false;
    else
      this.status = true;
  }

  closeSidebar() {
    this.status = false
  }

}
