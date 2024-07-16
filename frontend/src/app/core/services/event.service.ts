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

  featureEvent(id: string): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/feature/${id}`, null);
  }

  removeFeaturedEvent(id: string): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/feature/${id}/exclude`, null);
  }

  getOrganizersEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/organizer`);
  }

  getEventsByOrganizerId(id: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/organizer/${id}`);
  }

  getUpcomingEventsByOrganizerId(id: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/organizer/${id}/upcoming`);
  }

  getPastEventsByOrganizerId(id: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/organizer/${id}/past`);
  }

  getRelatedEvents(id: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/related-events/${id}`);
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/upcoming`);
  }

  getPastEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/past`);
  }

  getDeletedEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/deleted`);
  }

  getEventAnalytics(): Observable<Object> {
    return this.http.get<Object>(`${this.baseUrl}/analytics`);
  }
}
