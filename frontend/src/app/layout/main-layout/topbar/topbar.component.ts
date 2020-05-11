import { Component, OnInit, HostListener,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, UserDetails } from 'src/app/authentication.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  userDetails: UserDetails;
  showScrollNavbar: boolean;
  showScrollNavbarMobile: boolean;
  status: boolean = false;
  isCLicked = false;
  isLoggedInUser = false;
  fullName;
  constructor(
    private eRef: ElementRef,
    private route: Router,
    private _authService: AuthenticationService,) { }

  ngOnInit() {
    this.userDetails = this._authService.getUserDetails();
    this.isLoggedInUser = this._authService.isLoggedIn() === true ? true : false; 
    if(this.userDetails !== null)
      this.fullName = this.userDetails.first_name;
    else
      this.fullName = '';
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (number > 60) {
      this.showScrollNavbar = true;
    } else if (number === 0) {
      this.showScrollNavbar = false;
      this.status = false;
    }

  }

  @HostListener("window:scroll", [])
  onWindowScrollMobile() {
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (number > 20) {
      this.showScrollNavbarMobile = true;
      this.isCLicked = false;
    } else if (number === 0) {
      this.showScrollNavbarMobile = false;
      this.status = false;
    }

  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.eRef.nativeElement.contains(event.target) && event.target.lastChild == undefined) {
      this.status = !this.status;
    } else {
      this.status = false;
    }
  }

  clickEvent() {

  }

  menuItems(){
    if(!this.isCLicked) {
      this.isCLicked = true;
    } else {
      this.isCLicked = false;
    }

  }

  linkClikced() {
    this.isCLicked = false;
    this.route.navigateByUrl('/subscription')
  }

  logoutUser() {
    localStorage.clear();
    this.route.navigateByUrl('/auth');
  }
}
