import { Injectable } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { AuthService } from 'src/app/modules/core/services/auth/auth.service';
import { StorageKey, StorageService } from 'src/app/modules/core/services/common/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../../user/pages/login-box/login-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class SessionHelperService {
  isLoginPopUp: boolean = false;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    public dialog: MatDialog,
  ) {
  }



  checkSession() {
    if (!this.authService.isLoggedIn()) {
      return
    }
    let tokenExpireDate = new Date(this.storageService.getValue('tokenExpireDate'));
    //  console.log(tokenExpireDate, new Date());
    if (tokenExpireDate > new Date()) {
      this.isLoginPopUp = false;
    }
    else {
      if (!this.isLoginPopUp) {
        const dialogRef = this.dialog.open(LoginDialogComponent, {
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(result => {
          this.isLoginPopUp = false;
        });
        this.isLoginPopUp = true;
      }
    }
  }

}
