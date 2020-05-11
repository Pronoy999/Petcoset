import { Injectable } from '@angular/core';
import { Router, CanActivate} from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) { }
  canActivate() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/auth/login');
      return false;
    }
    return true
  }
  
}
