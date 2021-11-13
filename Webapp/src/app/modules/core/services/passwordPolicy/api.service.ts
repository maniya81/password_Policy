import { Injectable } from '@angular/core';
import { Password } from '../../models/password/password';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  endpoint: string = 'https://localhost:44348/api/passwords';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Add passwords
  AddPassword(data): Observable<any> {
    console.log('AddPassword',data);
    
    let API_URL = `${this.endpoint}`;
    let{id,dateUpdated, ...newData} = data;
    return this.http.post(API_URL, newData)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all passwords
  GetPasswords() {
    return this.http.get(`${this.endpoint}`);
  }



  // Get passwords
  GetPassword(id): Observable<any> {
    let API_URL = `${this.endpoint}/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
  }

  // Get applied PasswordPolicy
  GetappliedPasswordPolicy(): Observable<any> {
    let API_URL = `${this.endpoint}/GetAppliedPasswordPolicy`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
  }

  // Update passwords
  UpdatePassword(id, data): Observable<any> {
    console.log(data);
    
    let API_URL = `${this.endpoint}/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Delete passwords
  DeletePassword(id): Observable<any> {
    var API_URL = `${this.endpoint}/${id}`;
    return this.http.delete(API_URL)
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
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}