import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  endpoint: string = 'https://localhost:44348/api/users';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Register  Users
  Register(data): Observable<any> {
    console.table(data);
    
    let API_URL = `${this.endpoint}/register`;
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Login  Users
  Login(data): Observable<any> {
    console.table(data);
    
    let API_URL = `${this.endpoint}/authenticate`;
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Forget  Password
  ForgetPassword(data): Observable<any> {
    console.table(data);
    let API_URL = `${this.endpoint}/forgotpassword`;
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

   // reset  Password
   ResetPassword(data): Observable<any> {
    console.table(data);
    let API_URL = `${this.endpoint}/resetpassword`;
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }
   // change  Password
   ChangePassword(data): Observable<any> {
    console.table(data);
    let API_URL = `${this.endpoint}/changepassword`;
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // ValidateToken
  ValidateToken(data): Observable<any> {
    console.table(data);
    let API_URL = `${this.endpoint}/validatetoken`;
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }
 //Check for email
  IsEmailExist(email : string) {
      console.log(email);
      
    let API_URL = `${this.endpoint}/isEmailExists`;
    return this.http.post(API_URL, {emailId : email})
    .pipe(
      catchError(this.errorMgmt)
    )
  }
  // Error handling 
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(error.error.message);
    return throwError(error);
  }

}