import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Attendee from '../../shared/models/Attendee';

@Injectable({
  providedIn: 'root'
})
export class AttendeeService {

  private baseUrl = 'http://localhost:3000/api/v1/attendees';

  constructor(private http: HttpClient) { }

  getAllAttendees(): Observable<Attendee[]> {
    return this.http.get<Attendee[]>(this.baseUrl);
  }

  getAttendeeById(id: string): Observable<Attendee> {
    return this.http.get<Attendee>(`${this.baseUrl}/${id}`);
  }

  createAttendee(attendee: Object): Observable<Attendee> {
    return this.http.post<Attendee>(this.baseUrl, attendee);
  }

  updateAttendee(id: string, attendee: Attendee): Observable<Attendee> {
    return this.http.put<Attendee>(`${this.baseUrl}/${id}`, attendee);
  }

  deleteAttendee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAttendeeProfile(): Observable<Attendee> {
    return this.http.get<Attendee>(`${this.baseUrl}/profile`);
  }

  updateAttendeeProfile(attendee: Attendee): Observable<Attendee> {
    return this.http.put<Attendee>(`${this.baseUrl}/profile`, attendee);
  }

  getActiveAttendees(): Observable<Attendee[]> {
    return this.http.get<Attendee[]>(`${this.baseUrl}/active`);
  }

  getSuspendedAttendees(): Observable<Attendee[]> {
    return this.http.get<Attendee[]>(`${this.baseUrl}/suspended`);
  }

  getDeletedAttendees(): Observable<Attendee[]> {
    return this.http.get<Attendee[]>(`${this.baseUrl}/deleted`);
  }

  getAttendeeAnalytics(): Observable<Object> {
    return this.http.get<Object>(`${this.baseUrl}/analytics`);
  }
}
