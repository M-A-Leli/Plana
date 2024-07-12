import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Organizer from '../../shared/models/Organizer';

@Injectable({
  providedIn: 'root'
})
export class OrganizerService {

  private baseUrl = 'http://localhost:3000/api/v1/organizers';

  constructor(private http: HttpClient) { }

  getAllOrganizers(): Observable<Organizer[]> {
    return this.http.get<Organizer[]>(this.baseUrl);
  }

  getOrganizerById(id: string): Observable<Organizer> {
    return this.http.get<Organizer>(`${this.baseUrl}/${id}`);
  }

  createOrganizer(organizer: Organizer): Observable<Organizer> {
    return this.http.post<Organizer>(this.baseUrl, organizer);
  }

  updateOrganizer(id: string, organizer: Organizer): Observable<Organizer> {
    return this.http.put<Organizer>(`${this.baseUrl}/${id}`, organizer);
  }

  deleteOrganizer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getOrganizerProfile(): Observable<Organizer> {
    return this.http.get<Organizer>(`${this.baseUrl}/profile`);
  }

  updateOrganizerProfile(organizer: Organizer): Observable<Organizer> {
    return this.http.put<Organizer>(`${this.baseUrl}/profile`, organizer);
  }
}
