import { Router } from '@angular/router';
import { Component, OnInit, HostListener } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  status = false;
  header;
  constructor(
    private _authService: AuthenticationService,
    private route: Router
  ) { }

  ngOnInit() {
    this._authService.headerText
      .subscribe((response) => {
        this.header = response;
      })
  }

  toggleProfile() {
    if (this.status === true)
      this.status = false;
    else
      this.status = true;
  }

  logout() {
    console.log('logout hit');
    localStorage.clear();
    this.route.navigateByUrl('/auth');
  }

}
