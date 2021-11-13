import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomvalidationService } from 'src/app/modules/core/services/common/customvalidation.service';
import { ApiService } from 'src/app/modules/core/services/passwordPolicy/api.service';
import { UserService } from 'src/app/modules/core/services/user/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private token: string;
  private emailId: string;
  resetPasswordForm: FormGroup;
  appliedPassword: any;
  submitted: boolean = false;
  isTokenVerified : boolean = false;
  validateToken : any = {};
  resetPassword : any = {}; 
  message: any;
  error: any;
  constructor(private route: ActivatedRoute,
    public fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private userService: UserService,
    private passwordApi: ApiService,
    private router : Router
    ) { }

  ngOnInit(): void {
    this.validateToken.token = this.route.snapshot.queryParams['token'];
    this.validateToken.emailId = this.route.snapshot.queryParams['email'];
    this.emailId = this.route.snapshot.queryParams['email'];
    this.token = this.route.snapshot.queryParams['token'];
      this.passwordApi.GetappliedPasswordPolicy().subscribe(x => {
        this.appliedPassword = x;
      })
      this.userService.ValidateToken(this.validateToken).subscribe(x => {
        if (x == true) {
          this.isTokenVerified = true;
        }
        console.log(x);
      })
  
      this.resetPasswordForm = this.fb.group({
        emailId: [this.emailId],
        password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
        confirmPassword: ['', [Validators.required]],
      },
        {
          validator: this.customValidator.MatchPassword('password', 'confirmPassword'),
        }
      );
  }

  get resetPasswordFormControl() {
    return this.resetPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // console.table(this.resetPasswordForm);
    if (this.resetPasswordForm.valid) {
      // console.table(this.resetPasswordForm.value);
      this.resetPassword.token = this.token;
      this.resetPassword.password = this.resetPasswordForm.value.password;
      this.resetPassword.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.userService.ResetPassword(this.resetPassword).subscribe(x => {
        this.message = x.message;
        this.error = null;
        if (x.message === "Password reset successful, you can now login") {
          this.error = null;
          alert("Password reset successful, you can now login")
          this.router.navigate(['signin']);
        }
      }, (error) => {
        // console.log(error);
        this.error = error.error.message;
      })
    }
    
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.resetPasswordForm.controls[controlName].hasError(errorName);
  }

}
