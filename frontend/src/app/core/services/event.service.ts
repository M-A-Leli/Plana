import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Event from '../../shared/models/Event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private baseUrl = 'http://localhost:3000/api/v1/events';

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseUrl);
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${id}`);
  }

  createEvent(eventData: FormData): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, eventData);
  }

  updateEvent(id: string, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${id}`, event);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getFeaturedEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/featured-events`);
  }

  getEventsByOrganizerId(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/organizer`);
  }

  getRelatedEvents(id: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/related-events/${id}`);
  }
}
