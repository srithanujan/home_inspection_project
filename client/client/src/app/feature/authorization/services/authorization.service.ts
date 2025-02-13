import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private authToken: string | null = null;
  isAuthenticated = false;
  private baseUrl = `${environment.apiUrl}/inspection`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const bodyData = { email, password };
    return this.http.post(this.baseUrl + "/login", bodyData);
  }

  register(bodyData: any): Observable<any> {
    return this.http.post(this.baseUrl + "/createInspector", bodyData);
  }

  setAuthToken(token: string): void {
    this.authToken = token;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearAuthToken(): void {
    this.authToken = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  checkAuthentication(): boolean {
     return this.isAuthenticated;
  }

}
