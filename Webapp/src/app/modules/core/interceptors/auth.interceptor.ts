import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { StorageService, StorageKey } from '../services/common';
import { AuthService } from "../services/auth/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService, private storageService: StorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var authToken = this.authService.getAccessToken();
    if (authToken) {
      const clonedReq = req.clone({
        headers: new HttpHeaders({
         // 'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken,
        })
      });
      return next.handle(clonedReq).pipe(
        tap(
          succ => { },
          err => {
            if (err.status == 401) {
              this.backToLogin();
            }
          }
        ))
    }
    else {
      // return next.handle(req.clone());
      return next.handle(req.clone()).pipe(
        tap(
          succ => { },
          err => {
            if (err.status == 401) {
              this.backToLogin();
            }
          }
        ))
    }
  }

  private backToLogin() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}



