import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor() {}

  getValue(key: string): string {
    return localStorage.getItem(key);
  }

  setValue(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeValue(key: string): void {
    localStorage.removeItem(key);
  }
}

export class StorageKey {
  public static currentUserName = 'currentUserName';
  public static authToken = 'authToken';
  public static tokenExpireDate = 'tokenExpireDate';
  public static currentUserEmailId = 'currentUserEmailId';
}
