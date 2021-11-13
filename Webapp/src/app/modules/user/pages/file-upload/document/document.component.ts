import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DocumentService } from 'src/app/modules/core/services/document/document.service';
import { DocumentDataSource, DocumentItem } from './document-datasource';
import { map } from 'rxjs/operators';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DocumentViewerComponent } from '../document-viewer/document-viewer.component';
import { DeletePopupComponent } from '../../delete-popup/delete-popup.component';
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DocumentItem>;
  dataSource: DocumentDataSource;
  uploadProgress = 0;
  selectedFiles: File[];
  uploading = false;
  uploaded : boolean = false;
  errorMsg = '';
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'fileName','action'];
  constructor(
    private documentService: DocumentService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    this.dataSource = new DocumentDataSource();
  }
  ngOnInit(): void {
    this.getDocuments();
  }

  chooseFile(files: FileList) {
    this.uploaded = false;
    this.selectedFiles = [];
    this.errorMsg = '';
    this.uploadProgress = 0;
    if (files.length === 0) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
    // console.log(this.selectedFiles);
    this.upload();
  }
  
  upload() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.errorMsg = 'Please choose a file.';
      return;
    }
    this.documentService.upload(this.selectedFiles[0]).subscribe(x=>{
      console.log(x);
      if (x.message =="Success") {
        this.uploaded = true;
        this.refresh();
      }
    },
    err=>{
      this.errorMsg = err.error.message;;
    })
  }

  getDocuments() {
    this.documentService.GetDocuments().subscribe(response => {
      this.dataSource.data = response;
      this.table.dataSource = this.dataSource.connect();
    })
  }
  refresh() {
    this.documentService.GetDocuments().subscribe(response => {
      this.dataSource.data = response;
      this.table.dataSource = this.dataSource.connect();
    })
  }
  view(element){
    if (element.fileExtension.match(/.(jpg|jpeg|png|gif)$/i)) {
      element.type = 'image';
      const dialogRef = this.dialog.open(DocumentViewerComponent, {
        data : element
      });
      return
    }
    if (element.fileExtension.match(/.(pdf)$/i)) {
      element.type = 'pdf';
      const dialogRef = this.dialog.open(DocumentViewerComponent, {
        data : element
      });
      return
    }
    
    this.documentService.GetDocumentById(element.id).subscribe((res: HttpResponse<Blob>)=>{
      // console.log(res.headers);
       {
        switch (res.type) {
           
          case HttpEventType.Response:
            const downloadedFile = new Blob([res.body], { type: res.body.type });
            console.log(res.headers);
            const a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            a.href = URL.createObjectURL(downloadedFile);
            console.log(a.href);
            a.target = '_blank';
            a.download = element.fileName;
            a.click();
            document.body.removeChild(a);
            break;
        }
      }
    })
    
  }
  delete(element){
    console.log(element);
      const dialogRef = this.dialog.open(DeletePopupComponent, {
      });
  
      dialogRef.afterClosed().subscribe(result => {
       console.log(result);
       if (result == true) {
         console.log('delete', element);
         this.documentService.DeleteDocumnt(element.id).subscribe(res=>{
             this.refresh();
         })
       }
       
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
