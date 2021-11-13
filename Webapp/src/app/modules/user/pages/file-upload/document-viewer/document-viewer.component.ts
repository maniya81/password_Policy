import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from 'src/app/modules/core/services/document/document.service';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent implements OnInit {
isImage : boolean = false;
isPdf : boolean = false;
docUrl : string = 'https://localhost:44348/uploads/'
  constructor(
    public dialogRef: MatDialogRef<DocumentViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentService: DocumentService
  ) { }

  ngOnInit(): void {
   if (this.data.type == 'pdf') {
     this.isPdf = true
     console.log(this.isPdf);
     this.documentService.GetDocumentNamebyId(this.data.id).subscribe(res=>{
      console.log(res);
      
      this.docUrl = this.docUrl+ res.fileName;
      console.log(this.docUrl);
      
    })
   }
   if (this.data.type == 'image') {
    this.isImage = true
    console.log(this.isImage);
    this.documentService.GetDocumentNamebyId(this.data.id).subscribe(res=>{
      console.log(res);
      
      this.docUrl = this.docUrl+ res.fileName;
      console.log(this.docUrl);
      
    })
  }
    
  }


  download(){
     this.documentService.GetDocumentById(this.data.id).subscribe((res: HttpResponse<Blob>)=>{
      console.log(res.headers);
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
            a.download =this.data.fileName;
            a.click();
            document.body.removeChild(a);
            break;
        }
      }
      
    })
  }
  openInFullWindow(){
    window.open(this.docUrl, "_blank");
  }
  close(){
    this.dialogRef.close();
  }

}
