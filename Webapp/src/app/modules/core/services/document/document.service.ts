import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentItem } from 'src/app/modules/user/pages/file-upload/document/document-datasource';
import { Password } from '../../models/password/password';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  endpoint: string = 'https://localhost:44348/api/documents';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  upload(file): Observable<any> {
    var formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.endpoint}`, formData);
  }

  // Get all Docs
  GetDocuments(): Observable<DocumentItem[]> {
    return this.http.get<DocumentItem[]>(`${this.endpoint}`);
  }
  // get documentBy Id
  GetDocumentById(id): Observable<HttpResponse<Blob>> {
    // return this.http.request((`${this.endpoint}/${id}`,{
    //     reportProgress: true,
    //     responseType: 'blob',
    // });

    // return this.http.request(new HttpRequest(
    //     'GET',
    //     `${this.endpoint}/${id}`,
    //     {
    //         responseType: 'blob' as 'json',
    //         observe: 'response' as 'body'
    //     },
    //     {
    //       reportProgress: true,
    //       responseType: 'blob'
    //     }));

    return this.http.get<Blob>(`${this.endpoint}/${id}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }
  GetDocumentNamebyId(id): Observable<any> {
    return this.http.get(`${this.endpoint}/GetById/${id}`);
  
  }
  DeleteDocumnt(id): Observable<any> {
    return this.http.delete(`${this.endpoint}/${id}`);
  }
}
