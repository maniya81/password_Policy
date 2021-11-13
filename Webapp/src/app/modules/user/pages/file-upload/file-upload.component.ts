import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/modules/core/services/document/document.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  studentId = 9998;
  uploadProgress = 0;
  selectedFiles: File[];
  uploading = false;
  uploaded : boolean = false;
  errorMsg = '';
  constructor( 
   private documentService: DocumentService
  ) { }
  
  ngOnInit(): void {
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
    console.log(this.selectedFiles);
    this.upload();
  }
  
  upload() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.errorMsg = 'Please choose a file.';
      return;
    }

    // let lastModified = this.selectedFiles[0].lastModified;
    // let lastModifiedDate = new Date(lastModified);
    


    this.documentService.upload(this.selectedFiles[0]).subscribe(x=>{
      console.log(x);
      
      console.log("uploading");
      
    })

    
    this.uploading = true;
   
  }

  humanFileSize(bytes: number): string {
    if (Math.abs(bytes) < 1024) {
      return bytes + ' B';
    }
    const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    do {
      bytes /= 1024;
      u++;
    } while (Math.abs(bytes) >= 1024 && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
  }

}
