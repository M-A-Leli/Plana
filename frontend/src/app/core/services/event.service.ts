import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import IEvent  from '../../shared/models/Event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://localhost:3000/api/v1/events';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(this.baseUrl);
  }

  getEventById(id: string): Observable<IEvent> {
    return this.http.get<IEvent>(`${this.baseUrl}/${id}`);
  }

  createEvent(eventData: FormData): Observable<IEvent> {
    return this.http.post<IEvent>(this.baseUrl, eventData);
  }

  updateEvent(id: string, event: FormData): Observable<IEvent> {
    return this.http.put<IEvent>(`${this.baseUrl}/${id}`, event);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getFeaturedEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/featured-events`);
  }

  featureEvent(id: string): Observable<IEvent> {
    return this.http.put<IEvent>(`${this.baseUrl}/feature/${id}`, null);
  }

  removeFeaturedEvent(id: string): Observable<IEvent> {
    return this.http.put<IEvent>(`${this.baseUrl}/feature/${id}/exclude`, null);
  }

  getOrganizersEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/organizer`);
  }

  getOrganizersUpcomingEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/organizer/upcoming`);
  }

  getOrganizersPastEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/organizer/past`);
  }

  getOrganizersEventsAnalytics(): Observable<Object> {
    return this.http.get<Object>(`${this.baseUrl}/organizer/analytics`);
  }

  getEventsByOrganizerId(id: string): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/organizer/${id}`);
  }

  getUpcomingEventsByOrganizerId(id: string): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/organizer/${id}/upcoming`);
  }

  getPastEventsByOrganizerId(id: string): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/organizer/${id}/past`);
  }

  getRelatedEvents(id: string): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/related-events/${id}`);
  }

  getEventsByCategoryId(id: string): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/category/${id}`);
  }

  getUpcomingEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/upcoming`);
  }

  getPastEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/past`);
  }

  getDeletedEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${this.baseUrl}/deleted`);
  }

  getEventAnalytics(): Observable<Object> {
    return this.http.get<Object>(`${this.baseUrl}/analytics`);
  }
}
