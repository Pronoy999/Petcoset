import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

export interface UserDetails {
  id: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  email: string;
  gender: string;
  city_name: string;
  phone_number: string;
  pincode: string;
  role: string;
  status_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public baseurl = 'http://www.petcoset.com/api/v1';
  //public key = '5e31eb7b48506f1';
  public key = 'VGhpcyBpcyB0aGU';

  subscription_id;

  constructor(private http: HttpClient) { }

  setToken(token) {
    localStorage.setItem('mean-token', btoa(token));
  }

  getToken() {
    return atob(localStorage.getItem('mean-token'));
  }

  getUserDetails(): UserDetails {
    return JSON.parse(localStorage.getItem('userDetails'))
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return true;
    }
    return false;
  }

  public request(method: 'post' | 'get' | 'put' | 'delete' | 'patch' | 'file', type: String, data?: any): Observable<any> {
    let base;
    if (method === 'post') {
      if (type === 'vendors') {
        base = this.http.post(`${this.baseurl}/${type}`, data, {
          headers: {
            'Content-Type': 'application/json',
            'key': this.key,
            'Access-Control-Allow-Origin': '*',
            'maxContentLength' : '4194304'
          }
        });
      } else if (type === 'customers') {
        base = this.http.post(`${this.baseurl}/${type}`, data, {
          headers: {
            'Content-Type': 'application/json',
            'key': this.key,
            'jw_token': this.getToken(),
            'Access-Control-Allow-Origin': '*',
            'maxContentLength' : '4194304'
          }
        });
        console.log(base);
      }
      else {
        base = this.http.post(`${this.baseurl}/${type}`, data, {
          headers: {
            'Content-Type': 'application/json',
            'key': this.key,
            'jw_token': this.getToken(),
            'Access-Control-Allow-Origin': '*',
            'maxContentLength' : '4194304'
          }
        });
      }
    } else if (method === 'get') {
      base = this.http.get(`${this.baseurl}/${type}`, {
        headers: {
          'Content-Type': 'application/json',
          'key': this.key,
          'jw_token': this.getToken(),
          'Access-Control-Allow-Origin': '*',
          'maxContentLength' : '4194304'
        }
      }).catch(this.errorHandler);
    } else if (method === 'put') {
      base = this.http.put(`${this.baseurl}/${type}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'key': this.key,
          'Access-Control-Allow-Origin': '*',
          'jw_token': this.getToken(),
          'maxContentLength' : '4194304'
        }
      });
    }

    return base;
  }

  /**
   * METHOD TO HANDLE ERRORS.
   * @param error
   */
  errorHandler = (error: HttpErrorResponse) => {
    return Observable.throw(error.status);
  }
}

