import { FormGroup, AbstractControl } from '@angular/forms';

export class CustomValidator {
  // custom validator to check that two fields match
  public static MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  /**
   * Validation rule for numeric only
   */

  public static numericOnlyZeroNotAllowed(control: AbstractControl): any {
    if (control.value == undefined || control.value == null) {
      return;
    }
    return control.value.toString().match(/^[1-9][0-9]*$/)
      ? ''
      : { isValidNumeric: true };
  }

  public static zeroNotAllowed(control: AbstractControl): any {
    if (control.value == undefined || control.value == null) {
      return;
    }
    return control.value.toString().match(/^([1-9]{1,100})$/)
      ? ''
      : { isZeroNotAllowed: true };
  }

  public static numericOnly(control: AbstractControl): any {
    if (!control.value) {
      return;
    }
    return control.value.toString().match(/^[0-9]*$/)
      ? ''
      : { isValidNumeric: true };
  }

  public static decimalOnly(control: AbstractControl): any {
    if (!control.value) {
      return;
    }
    return control.value.toString().match(/^\d{0,2}(\.\d{1,2})?$/)
      ? ''
      : { isValidDecimal: true };
  }
  public static numdecimalOnly(control: AbstractControl): any {
    if (!control.value) {
      return;
    }
    return control.value.toString().match(/^\d{0,9}(\.\d{1,4})?$/)
      ? ''
      : { isValidDecimal: true };
  }
  public static numericdecimalOnly(control: AbstractControl): any {
    if (!control.value) {
      return;
    }
    return control.value.toString().match(/^-?\d*\.?\d*$/)
      ? ''
      : { isValidNumericDecimal: true };
  }

  public static restrictSpecialCharacter(control: AbstractControl): any {
    if (!control.value) {
      return;
    }
    return control.value.toString().match(/^[a-zA-Z0-9_]*$/)
      ? ''
      : { isValidSpecial: true };
  }

  public static alphanumericCharacter(control: AbstractControl): any {
    if (!control.value) {
      return;
    }
    return control.value.toString().match(/^[a-zA-Z0-9_]*$/)
      ? ''
      : { isValidAlphanumeric: true };
  }
  /**
   * Validation rule for email format
   */
  public static validEmailFormat(control: AbstractControl): any {
    if (!control.value) {
      return;
    }
    return control.value.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
      ? ''
      : { isEmailValid: true };
  }
}
