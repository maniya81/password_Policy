import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ApiService } from '../passwordPolicy/api.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {
  appliedPassword: any;

  constructor(private passwordApi: ApiService,
    private userService: UserService) 
  { 
    this.passwordApi.GetappliedPasswordPolicy().subscribe(x => {
      this.appliedPassword = x;
      // console.table(this.appliedPassword)
    })
  }


  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      // console.log(control);
      let errors:any = {};
      if (!control.value) {
        return null;
      }
      if (this.appliedPassword.noOfDigits != 0) {
        const regex = new RegExp(`(?=([^0-9]*[0-9])\{${this.appliedPassword.noOfDigits},\})`);
        const noOfDigits = regex.test(control.value);
        noOfDigits == false ? errors.noOfDigits = true : null;
      }
      // console.log(noOfDigits);
      if (this.appliedPassword.noOfSpecialLetters != 0) {
        const noOfSpecialLettersRegex = new RegExp(`(?=(\.\*[\$\@\$\!\%\*\?\&])\{${this.appliedPassword.noOfSpecialLetters},\})`);
        const noOfSpecialLetters = noOfSpecialLettersRegex.test(control.value);
        noOfSpecialLetters == false ? errors.noOfSpecialLetters = true : null;
        // console.log(noOfSpecialLetters);
      }
      if (this.appliedPassword.noOfUppercaseLetters != 0) {
        const noOfUpperCaseRegex = new RegExp(`(?=([^A-Z]*[A-Z])\{${this.appliedPassword.noOfUppercaseLetters},\})`);
        const noOfUpperCase = noOfUpperCaseRegex.test(control.value);
        noOfUpperCase == false ? errors.noOfUpperCase = true : null;
        // console.log(noOfUpperCase);
      }
      if (this.appliedPassword.minlength != 0) {
        const minLengthRegex = new RegExp(`[A-Za-z\\d\$\@\$\!\%\*\?\&\.]{${this.appliedPassword.minlength},}`);
        const minLength = minLengthRegex.test(control.value);
        minLength == false ? errors.minLength = true : null;
        // console.log(minLength);
      }
      if (control.value.length >= this.appliedPassword.maxlength) {
        errors.maxLength = true;
      }
      // const maxlength = control.value.length <= this.appliedPassword.maxlength;
      // console.log(maxlength);
      // console.log(errors);

      return errors.length == 0 ? null : errors;
    };
  }
  SeasionTimeOutInterval(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      // console.log(control);
      let errors:any = {};
      if (!control.value) {
        return null;
      }
      control.value < 45 ? errors.minimumSessionTimeoutInterval = true : null;

      return errors.length == 0 ? null : errors;
    };
  }

  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      
      
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  EmailIdValidator(userControl: AbstractControl) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.userService.IsEmailExist(userControl.value).subscribe(x=>{
          if (!x == true) {
            resolve({ EmailIdNotAvailable: true });
            // console.log('Exists');
          }
          else  {
            resolve(null);
            // console.log("Not Exists");
          }
        });
      }, 1000);
    });
  }

  
}