import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import Order from '../../shared/models/Order';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService]
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all orders', () => {
    const mockOrders: Order[] = [
      { id: '1', attendee_id: '1', event_id: '1', total: 30, updated_at: new Date() },
      { id: '2', attendee_id: '2', event_id: '2', total: 30, updated_at: new Date() }
    ];

    service.getAllOrders().subscribe(orders => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should retrieve order by ID', () => {
    const mockOrder: Order = { id: '1', attendee_id: '1', event_id: '1', total: 30, updated_at: new Date() };

    service.getOrderById('1').subscribe(order => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrder);
  });

  it('should create an order', () => {
    const newOrder: Order = { id: '3', attendee_id: '3', event_id: '3', total: 30, updated_at: new Date() };

    service.createOrder(newOrder).subscribe(order => {
      expect(order).toEqual(newOrder);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newOrder);
    req.flush(newOrder);
  });

  it('should update an order', () => {
    const updatedOrder: Order = { id: '1', attendee_id: '1', event_id: '1', total: 30, updated_at: new Date() };

    service.updateOrder('1', updatedOrder).subscribe(order => {
      expect(order).toEqual(updatedOrder);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedOrder);
    req.flush(updatedOrder);
  });

  it('should delete an order', () => {
    service.deleteOrder('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should retrieve orders by user ID', () => {
    const mockOrders: Order[] = [
      { id: '1', attendee_id: '1', event_id: '1', total: 30, updated_at: new Date() },
      { id: '2', attendee_id: '2', event_id: '2', total: 30, updated_at: new Date() }
    ];

    service.getOrdersByUserId().subscribe(orders => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/user`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should retrieve paid orders by user ID', () => {
    const mockOrders: Order[] = [
      { id: '1', attendee_id: '1', event_id: '1', total: 30, updated_at: new Date() },
      { id: '2', attendee_id: '2', event_id: '2', total: 30, updated_at: new Date() }
    ];

    service.getPaidOrdersByUserId().subscribe(orders => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/user/paid`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should retrieve unpaid orders by user ID', () => {
    const mockOrders: Order[] = [
      { id: '1', attendee_id: '1', event_id: '1', total: 30, updated_at: new Date() },
      { id: '2', attendee_id: '2', event_id: '2', total: 30, updated_at: new Date() }
    ];

    service.getUnpaidOrderByUserId().subscribe(orders => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/user/unpaid`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should retrieve deleted orders', () => {
    const mockOrders: Order[] = [
      { id: '1', attendee_id: '1', event_id: '1', total: 30, updated_at: new Date() },
      { id: '2', attendee_id: '2', event_id: '2', total: 30, updated_at: new Date() }
    ];

    service.getDeletedOrders().subscribe(orders => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/deleted`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should checkout order', () => {
    const mockOrders: Order[] = [
      { id: '1', attendee_id: '1', event_id: '1', total: 30, updated_at: new Date() },
      { id: '2', attendee_id: '2', event_id: '2', total: 30, updated_at: new Date() }
    ];

    service.checkoutOrder().subscribe(orders => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/checkout`);
    expect(req.request.method).toBe('POST');
    req.flush(mockOrders);
  });

  it('should retrieve order analytics', () => {
    const mockAnalytics = { total: 10, paid: 5, unpaid: 5 };

    service.getOrderAnalytics().subscribe(analytics => {
      expect(analytics).toEqual(mockAnalytics);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/analytics`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAnalytics);
  });
});
