import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ImageService {
  private baseUrl = `${environment.apiUrl}/img`;

  constructor(private http: HttpClient) {}

  addImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, formData);
  }


  fetchImages(inspectionId?: string, imageName?: string): Observable<any> {
    let params = new HttpParams();
    if (inspectionId) {
      params = params.set('inspectionId', inspectionId);
    }
    if (imageName) {
      params = params.set('imageName', imageName);
    }
    return this.http.get(`${this.baseUrl}/fetch`, { params });
  }

  deleteImage(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}
