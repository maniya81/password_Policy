import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { PasswordComponent } from './pages/password/password.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { LoginDialogComponent } from './pages/login-box/login-dialog.component';
import { DialogBoxComponent } from './pages/password/dialog-box/dialog-box.component';
import { FileUploadComponent } from './pages/file-upload/file-upload.component';
import { DocumentComponent } from './pages/file-upload/document/document.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DocumentViewerComponent } from './pages/file-upload/document-viewer/document-viewer.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DeletePopupComponent } from './pages/delete-popup/delete-popup.component';
import { GooglemapComponent } from './pages/googlemap/googlemap.component';
import { DevExComponent } from './pages/dev-ex/dev-ex.component'; 
import { DxDataGridModule } from 'devextreme-angular';


@NgModule({
  declarations: [
    UserComponent,
    DialogBoxComponent,
    PasswordComponent,
    LoginDialogComponent,
    FileUploadComponent,
    DocumentComponent,
    DocumentViewerComponent,
    DeletePopupComponent,
    GooglemapComponent,
    DevExComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    PdfViewerModule,
    DxDataGridModule
  ],
  providers: [
  ],
})
export class UserModule { }
