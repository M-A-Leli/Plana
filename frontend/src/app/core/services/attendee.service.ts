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

  createAttendee(attendee: Attendee): Observable<Attendee> {
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
}
