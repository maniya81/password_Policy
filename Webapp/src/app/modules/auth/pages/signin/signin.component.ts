import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageKey, StorageService } from 'src/app/modules/core/services/common/storage.service';
import { UserService } from 'src/app/modules/core/services/user/user.service';
import { SessionHelperService } from 'src/app/modules/shared/helpers/session-helper.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  error = null;
  message: any;

  constructor(
    public fb: FormBuilder,
    private userService: UserService,
    private storageService: StorageService,
    private session: SessionHelperService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.userService.Login(this.loginForm.value).subscribe(response => {
        this.message = response.token;
        let tokenExpireDate =  new Date(Date.parse(response.tokenExpiresTime)); ;
        console.log(new Date());
        console.log(tokenExpireDate);
        let tokenExpireDateString = tokenExpireDate.toISOString();
        // console.log(new Date(tokenExpireDateString));
        this.storageService.setValue(StorageKey.tokenExpireDate, tokenExpireDateString)
        
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
        this.router.navigate(['/app']);
        this.error = null;
      }, (error) => {
        // console.log(error);
        this.error = error.error.message;
        if (error.error.message === "Password is Expired") {
          console.log('route');
          this.router.navigate(['/changepassword', { email: this.loginForm.value.emailId }]);
        }
      })
    }
  }
  forgotPassword(){
    this.router.navigate(['forgotpassword']);
  }
  public handleError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  }
}
