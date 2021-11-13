import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomvalidationService } from 'src/app/modules/core/services/common/customvalidation.service';

export interface UsersData {
  id: number;
  policyName: string;
  minlength: number;
  maxlength: number;
  noOfUppercaseLetters: number;
  noOfDigits: number;
  noOfSpecialLetters: number;
  passwordAgeInterval: number;
  sessionTimeoutInterval: number;
  isInactive: boolean;
  isApplied: boolean;
  dateAdded: Date;
  dateUpdated: Date;
  modifiedBy: string;
}


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent {

  action: string;
  local_data: any;
  passwordForm: FormGroup;
 
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData,
    private customValidator: CustomvalidationService,
    ) {
    this.passwordForm = this.fb.group({

      policyName: [data.policyName, [Validators.required]],
      // modifiedBy: [data.modifiedBy, [Validators.required]],
      minLength: [data.minlength, [Validators.required]],
      maxlength: [data.maxlength, [Validators.required]],
      noOfUppercaseLetters: [data.noOfUppercaseLetters, [Validators.required]],
      noOfDigits: [data.noOfDigits, [Validators.required]],
      noOfSpecialLetters: [data.noOfSpecialLetters, [Validators.required]],
      passwordAgeInterval: [data.passwordAgeInterval, [Validators.required]],
      sessionTimeoutInterval:[data.sessionTimeoutInterval, Validators.compose([Validators.required, this.customValidator.SeasionTimeOutInterval()])],
      // dateAdded: [data.dateAdded, [Validators.required]],
      // dateUpdated: [data.dateUpdated],
      isInactive: [data.isInactive],
      isApplied: [data.isApplied],
      id: [data.id],
    })


    console.log(data);
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction() {
    if (!this.passwordForm.valid) {
      console.log(this.passwordForm.value);
    }
    if (this.passwordForm.valid) {
      console.log(this.passwordForm.value);
      this.local_data.formValue = this.passwordForm.value;

      this.dialogRef.close({ event: this.action, data: this.local_data });
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
 
  public handleError = (controlName: string, errorName: string) => {
    return this.passwordForm.controls[controlName].hasError(errorName);
  }

}
