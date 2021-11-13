import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService, StorageKey } from '../common/storage.service';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) {}

  login(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}auth/login`, data);
  }

  logoutrequest(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}auth/logout`, data);
  }

  logout() {
    this.storageService.removeValue(StorageKey.authToken);
    this.storageService.removeValue(StorageKey.currentUserName);
    this.storageService.removeValue(StorageKey.currentUserEmailId);
    this.storageService.removeValue(StorageKey.tokenExpireDate);
  }

  isLoggedIn(): boolean {
    var token = this.storageService.getValue(StorageKey.authToken);
    var currentUserName = this.storageService.getValue(StorageKey.currentUserName);
    if (token && currentUserName) return true;
    else return false;
  }

  getAccessToken(): any {
    var token = this.storageService.getValue(StorageKey.authToken);
    return token ? token : null;
  }

  getUserEmailId(): any {
    var emailId = this.storageService.getValue(StorageKey.currentUserEmailId);
    return emailId ? emailId : null;
  }

  getUserName(): any {
    var name = this.storageService.getValue(StorageKey.currentUserName);
    return name ? name : null;
  }

  getUserFullName(): any {
    var name = JSON.parse(this.storageService.getValue(StorageKey.currentUserName))
      .userFullName;
    return name ? name : null;
  }

  //Get Excise Flag
  getExciseFlag(): any {
    return 'N';
  }
  //Get Configurator Flag
  getConfiguratorFlag(): any {
    var configuratorFlag = 'N';
  }

  getUserRole(): any {
    const role = JSON.parse(
      this.storageService.getValue(StorageKey.currentUserName)
    ).userRole;
    return role ? role : null;
  }

 

  _userActionOccured: Subject<void> = new Subject();
  get userActionOccured(): Observable<void> {
    return this._userActionOccured.asObservable();
  }
}
