import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import TicketType from '../../shared/models/TicketTypes';

@Injectable({
  providedIn: 'root'
})
export class TicketTypesService {

  private baseUrl = 'http://localhost:3000/api/v1/ticket-types';

  constructor(private http: HttpClient) { }

  getAllTicketTypes(): Observable<TicketType[]> {
    return this.http.get<TicketType[]>(this.baseUrl);
  }

  getTicketTypeById(id: string): Observable<TicketType> {
    return this.http.get<TicketType>(`${this.baseUrl}/${id}`);
  }

  createTicketType(ticketType: TicketType): Observable<TicketType> {
    return this.http.post<TicketType>(this.baseUrl, ticketType);
  }

  updateTicketType(id: string, ticketType: TicketType): Observable<TicketType> {
    return this.http.put<TicketType>(`${this.baseUrl}/${id}`, ticketType);
  }

  deleteTicketType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getTicketTypesByEventId(id: string): Observable<TicketType[]> {
    return this.http.get<TicketType[]>(`${this.baseUrl}/event/${id}`);
  }
}
