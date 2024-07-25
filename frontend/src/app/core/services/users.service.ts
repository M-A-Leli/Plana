import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import User from '../../shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = 'http://localhost:3000/api/v1/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/profile`);
  }

  updateUserProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/profile`, user);
  }

  getUserProfileImage(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/profile-image`);
  }

  updateUserProfileImage(user: FormData): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/profile-image`, user);
  }

  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/active`);
  }

  getSuspendedUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/suspended`);
  }

  getDeletedUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/deleted`);
  }

  suspendUser(id: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/suspend/${id}`, null);
  }

  reinstateUser(id: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/reinstate/${id}`, null);
  }

  changePassword(passwords: Object): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/change-password`, passwords);
  }

  getUserAnalytics(): Observable<Object> {
    return this.http.get<Object>(`${this.baseUrl}/analytics`);
  }
}
