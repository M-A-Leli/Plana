import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Review from '../../shared/models/Review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private baseUrl = 'http://localhost:3000/api/v1/reviews';

  constructor(private http: HttpClient) { }

  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.baseUrl);
  }

  getReviewById(id: string): Observable<Review> {
    return this.http.get<Review>(`${this.baseUrl}/${id}`);
  }

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.baseUrl, review);
  }

  updateReview(id: string, review: Review): Observable<Review> {
    return this.http.put<Review>(`${this.baseUrl}/${id}`, review);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getReviewsByUserId(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/user}`);
  }

  getReviewsByEventId(id: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/event/${id}`);
  }
}
