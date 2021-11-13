import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.css']
})
export class DeletePopupComponent implements OnInit {
  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
   isDelete: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DeletePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
   ) { }

  ngOnInit(): void {
  }

  close(){
    this.isDelete = true
    this.dialogRef.close( this.isDelete);
  }

}
