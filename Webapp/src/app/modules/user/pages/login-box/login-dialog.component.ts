import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/core/services/auth/auth.service';
import { StorageKey, StorageService } from 'src/app/modules/core/services/common/storage.service';
import { UserService } from 'src/app/modules/core/services/user/user.service';
import { SessionHelperService } from 'src/app/modules/shared/helpers/session-helper.service';
@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  emailId: string;
  loginForm: FormGroup;
  submitted = false;
  error = null;
  message: any;
  submitCount : number = 0;

  constructor(
    public dialog: MatDialog,
    public fb: FormBuilder,
    private userService: UserService,
    private storageService: StorageService,
    private session: SessionHelperService,
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    ) {}

  
  ngOnInit(): void {
    this.emailId = this.storageService.getValue('currentUserEmailId')
    this.loginForm = this.fb.group({
      emailId: [this.emailId],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.loginForm.valid) {
      this.userService.Login(this.loginForm.value).subscribe(response => {
        this.message = response.token;
        let tokenExpireDate =  new Date(Date.parse(response.tokenExpiresTime)); ;
        console.log(tokenExpireDate);

        let tokenExpireDateString = tokenExpireDate.toISOString();
      
        this.storageService.setValue(
          StorageKey.tokenExpireDate,
           tokenExpireDateString
           );
        this.storageService.setValue(
          StorageKey.authToken,
          response.token
        );
        this.storageService.setValue(
          StorageKey.currentUserName,
          response.name
        );
        this.storageService.setValue(
          StorageKey.currentUserEmailId,
          response.emailId
        );
        this.error = null;
        this.session.isLoginPopUp = false;
        this.dialogRef.close();
      }, (error) => {
        this.error = error.error.message;
        if (error.error.message === "Password is Expired") {
          console.log('route');
          this.router.navigate(['/changepassword', { email: this.loginForm.value.emailId }]);
        }
      })
    }
  }
  openDialog() {
    this.dialog.open(LoginDialogComponent);
  }
  logOut(){
    console.log('logOut');
    this.authService.logout();
    this.dialogRef.close();
    this.router.navigate(['/signin']);
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  }
  
}
