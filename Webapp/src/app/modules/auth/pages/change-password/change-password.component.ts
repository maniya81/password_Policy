import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomvalidationService } from 'src/app/modules/core/services/common/customvalidation.service';
import { ApiService } from 'src/app/modules/core/services/passwordPolicy/api.service';
import { UserService } from 'src/app/modules/core/services/user/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  private token: string;
  private emailId: string;
  changePasswordForm: FormGroup;
  appliedPassword: any;
  submitted: boolean = false;
  isTokenVerified : boolean = true;
  validateToken : any = {};
  changePassword : any = {}; 
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
    this.emailId = this.route.snapshot.params['email'];
    console.log(this.emailId);
    
      this.passwordApi.GetappliedPasswordPolicy().subscribe(x => {
        this.appliedPassword = x;
      })

  
      this.changePasswordForm = this.fb.group({
        emailId: [this.emailId],
        oldPassword: ['', [Validators.required]],
        password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
        confirmPassword: ['', [Validators.required]],
      },
        {
          validator: this.customValidator.MatchPassword('password', 'confirmPassword'),
        }
      );
  }

  get changePasswordFormControl() {
    return this.changePasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.table(this.changePasswordForm);
    if (this.changePasswordForm.valid) {
      // console.table(this.changePasswordForm.value);
      this.changePassword.emailId = this.emailId;
      this.changePassword.oldPassword = this.changePasswordForm.value.oldPassword;
      this.changePassword.password = this.changePasswordForm.value.password;
      this.changePassword.confirmPassword = this.changePasswordForm.value.confirmPassword;
      this.userService.ChangePassword(this.changePassword).subscribe(x => {
        this.message = x.message;
        this.error = null;
        if (x.message === "Password changed sucessfully") {
          this.error = null;
          alert("Password change successful, you can now login")
          this.router.navigate(['signin']);
        }
      }, (error) => {
        // console.log(error);
        this.message = null;
        this.error = error.error.message;
      })
    }
    
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.changePasswordForm.controls[controlName].hasError(errorName);
  }

}
