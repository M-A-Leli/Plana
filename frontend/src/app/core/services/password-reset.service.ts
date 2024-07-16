import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  private baseUrl = 'http://localhost:3000/api/v1/password-reset';
  private tokenKey: string = 'resetToken';

  constructor(private http: HttpClient) { }

  sendPasswordResetCode(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/`, { email });
  }

  verifyPasswordResetCode(reset_code: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/verify`, { reset_code });
  }

  resetPassword(password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset`, { password });
  }
}
