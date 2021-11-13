import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomvalidationService } from 'src/app/modules/core/services/common/customvalidation.service';
import { ApiService } from 'src/app/modules/core/services/passwordPolicy/api.service';
import { UserService } from 'src/app/modules/core/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  appliedPassword: any;
  submitted: boolean = false;
  message: any;
  error: any;
  constructor(
    public fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private userService: UserService,
    private passwordApi: ApiService,
    private router: Router,
  ) {  }

  ngOnInit(): void {
    this.passwordApi.GetappliedPasswordPolicy().subscribe(x => {
      this.appliedPassword = x;
      // console.log(this.appliedPassword);
    })

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email], this.customValidator.EmailIdValidator.bind(this.customValidator)],
      password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
      confirmPassword: ['', [Validators.required]],
    },
      {
        validator: this.customValidator.MatchPassword('password', 'confirmPassword'),
      }
    );
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      // console.table(this.registerForm.value);
      this.userService.Register(this.registerForm.value).subscribe(x => {
        if (x.message === "Success") {
          this.message = x.message;
          this.error = null;
          // console.log('route');
          this.router.navigate(['signin']);
        }
      }, (error) => {
        // console.log(error);
        this.error = error.error.message
      })
    }
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  }
}
