import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Admin from '../../shared/models/Admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:3000/api/v1/admins';

  constructor(private http: HttpClient) { }

  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.baseUrl);
  }

  getAdminById(id: string): Observable<Admin> {
    return this.http.get<Admin>(`${this.baseUrl}/${id}`);
  }

  createAdmin(admin: Object): Observable<Admin> {
    return this.http.post<Admin>(this.baseUrl, admin);
  }

  updateAdmin(id: string, admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.baseUrl}/${id}`, admin);
  }

  deleteAdmin(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAdminProfile(): Observable<Admin> {
    return this.http.get<Admin>(`${this.baseUrl}/profile`);
  }

  updateAdminProfile(admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.baseUrl}/profile`, admin);
  }

  getActiveAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.baseUrl}/active`);
  }

  getSuspendedAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.baseUrl}/suspended`);
  }

  getDeletedAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.baseUrl}/deleted`);
  }

  getAdminAnalytics(): Observable<Object> {
    return this.http.get<Object>(`${this.baseUrl}/analytics`);
  }
}
