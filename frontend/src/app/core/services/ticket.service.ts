import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Ticket from '../../shared/models/Ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private baseUrl = 'http://localhost:3000/api/v1/tickets';

  constructor(private http: HttpClient) { }

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.baseUrl);
  }

  getTicketById(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}/${id}`);
  }

  createTicket(ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.post<Ticket>(this.baseUrl, ticket);
  }

  updateTicket(id: string, ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/${id}`, ticket);
  }

  deleteTicket(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  validateTicket(code: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/validate/${code}`);
  }

  getTicketsByUserId(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/user`);
  }

  getEventTicketsByUserId(id: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/event/user/${id}`);
  }

  getTicketsByEventId(id: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/event/${id}`);
  }

  getTicketsByOrderId(id: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/order/${id}`);
  }

  getTicketAnalytics(): Observable<Object> {
    return this.http.get<Object>(`${this.baseUrl}/analytics`);
  }
}
