import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../core/services/passwordPolicy/api.service';
import { Password } from '../../../core/models/password/password';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  passwordData: any = [];
  dataSource: MatTableDataSource<Password>;
  displayedColumns: string[] = ['id', 'policyName', 'action'];

  constructor(private passwordApi: ApiService,public dialog: MatDialog, private cd: ChangeDetectorRef) {
    this.passwordApi.GetPasswords().subscribe(data => {
      this.passwordData = data;
      console.log(this.passwordData);
      
      this.dataSource = new MatTableDataSource<Password>(this.passwordData);
    })
  }
  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '750px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.passwordApi.AddPassword(result.data.formValue).subscribe(res => {
         console.log(res);
         this.getPasswords();
        });
        console.log('Add', result);
        
      }else if(result.event == 'Update'){
        console.log(result.data.id,result.data.formValue);
        
        this.passwordApi.UpdatePassword( result.data.id,result.data.formValue).subscribe(res => {
          console.log(res);
          this.getPasswords();
        });
        console.log('Update', result);
      }else if(result.event == 'Delete'){
        console.log('Delete', result);
      }
    });
  }
  ngOnInit(): void {
   
  }
  deletePassword(index: number, e) {
    console.log(index, e);
    
    if (window.confirm('Are you sure')) {
      this.passwordApi.DeletePassword(e.id).subscribe(x => {
        console.log('deleted',e.id);
        this.getPasswords();
      })
    }
  }
  getPasswords(){
    this.passwordApi.GetPasswords().subscribe(data => {
      this.passwordData = data;
      this.dataSource = new MatTableDataSource<Password>(this.passwordData);
      this.cd.detectChanges();
    })
  }
}
