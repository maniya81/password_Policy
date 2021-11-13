import { DevExComponent } from './pages/dev-ex/dev-ex.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { PasswordComponent } from './pages/password/password.component';
import { ChangePasswordComponent } from '../auth/pages/change-password/change-password.component';
import { FileUploadComponent } from './pages/file-upload/file-upload.component';
import { DocumentComponent } from './pages/file-upload/document/document.component';
import { GooglemapComponent } from './pages/googlemap/googlemap.component';



@NgModule({
  imports: [
      RouterModule.forChild([
          {
              path: '',
              component: UserComponent,
              children: [
                { path: 'password', component: PasswordComponent},
                { path: 'devex', component: DevExComponent},
                { path: 'changepassword', component: ChangePasswordComponent},
                { path: 'fileupload', component: DocumentComponent},
                { path: 'fileuploads', component: FileUploadComponent},
                { path: 'googlemap', component: GooglemapComponent},
                { path: '**', redirectTo: 'password' }
              ],
              
          }
      ])
  ],
  exports: [
      RouterModule
  ]
})
export class UserRoutingModule { }
