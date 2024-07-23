import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Order from '../../shared/models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:3000/api/v1/orders';

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order);
  }

  updateOrder(id: string, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${id}`, order);
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getOrdersByUserId(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user`);
  }

  getPaidOrdersByUserId(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/paid`);
  }

  getUnpaidOrderByUserId(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/unpaid`);
  }

  getDeletedOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/deleted`);
  }

  checkoutOrder(): Observable<Order[]> {
    return this.http.post<Order[]>(`${this.baseUrl}/checkout`, null);
  }

  getOrderAnalytics(): Observable<Object> {
    return this.http.get<Object>(`${this.baseUrl}/analytics`);
  }
}
