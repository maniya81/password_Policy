import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/modules/core/services/user/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  submitted = false;
  error = null;
  message = null;

  constructor(
    public fb: FormBuilder,
    private userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.forgotPasswordForm.valid) {
      let forgetPasswordData = {
        emailId: this.forgotPasswordForm.value.emailId,
        clientURI: 'http://localhost:4200/resetpassword'
      }
      console.table(forgetPasswordData);
      this.userService.ForgetPassword(forgetPasswordData).subscribe(x => {
        console.log(x);
        this.message = x.message;
        this.error = null;
      }, (error) => {
        console.log(error);
        this.error = error.error.message;
      })
    }
  }
  public handleError = (controlName: string, errorName: string) => {
    return this.forgotPasswordForm.controls[controlName].hasError(errorName);
  }
}
