import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketService } from './ticket.service';
import Ticket from '../../shared/models/Ticket';

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketService]
    });
    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test for getAllTickets
  it('should fetch all tickets', () => {
    const dummyTickets: Ticket[] = [
      { id: '1', ticket_type_id: 'type1', order_id: 'order1', quantity: 1, subtotal: 100 },
      { id: '2', ticket_type_id: 'type2', order_id: 'order2', quantity: 2, subtotal: 200 }
    ];

    service.getAllTickets().subscribe(tickets => {
      expect(tickets.length).toBe(2);
      expect(tickets).toEqual(dummyTickets);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTickets);
  });

  // Test for getTicketById
  it('should fetch a single ticket by id', () => {
    const dummyTicket: Ticket = { id: '1', ticket_type_id: 'type1', order_id: 'order1', quantity: 1, subtotal: 100 };

    service.getTicketById('1').subscribe(ticket => {
      expect(ticket).toEqual(dummyTicket);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTicket);
  });

  // Test for createTicket
  it('should create a new ticket', () => {
    const newTicket: Ticket = { id: '1', ticket_type_id: 'type1', order_id: 'order1', quantity: 1, subtotal: 100 };

    service.createTicket(newTicket).subscribe(ticket => {
      expect(ticket).toEqual(newTicket);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(newTicket);
  });

  // Test for updateTicket
  it('should update an existing ticket', () => {
    const updatedTicket: Ticket = { id: '1', ticket_type_id: 'type1', order_id: 'order1', quantity: 1, subtotal: 100 };

    service.updateTicket('1', updatedTicket).subscribe(ticket => {
      expect(ticket).toEqual(updatedTicket);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTicket);
  });

  // Test for deleteTicket
  it('should delete a ticket', () => {
    service.deleteTicket('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // Test for validateTicket
  it('should fetch validated tickets', () => {
    const dummyTickets: Ticket[] = [
      { id: '1', ticket_type_id: 'type1', order_id: 'order1', quantity: 1, subtotal: 100 },
      { id: '2', ticket_type_id: 'type2', order_id: 'order2', quantity: 2, subtotal: 200 }
    ];

    service.validateTicket().subscribe(tickets => {
      expect(tickets.length).toBe(2);
      expect(tickets).toEqual(dummyTickets);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/validate`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTickets);
  });

  // Test for getTicketsByUserId
  it('should fetch tickets by user id', () => {
    const dummyTickets: Ticket[] = [
      { id: '1', ticket_type_id: 'type1', order_id: 'order1', quantity: 1, subtotal: 100 },
      { id: '2', ticket_type_id: 'type2', order_id: 'order2', quantity: 2, subtotal: 200 }
    ];

    service.getTicketsByUserId().subscribe(tickets => {
      expect(tickets.length).toBe(2);
      expect(tickets).toEqual(dummyTickets);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/user`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTickets);
  });

  // Test for getEventTicketsByUserId
  it('should fetch event tickets by user id', () => {
    const dummyTickets: Ticket[] = [
      { id: '1', ticket_type_id: 'type1', order_id: 'order1', quantity: 1, subtotal: 100 },
      { id: '2', ticket_type_id: 'type2', order_id: 'order2', quantity: 2, subtotal: 200 }
    ];

    service.getEventTicketsByUserId('1').subscribe(tickets => {
      expect(tickets.length).toBe(2);
      expect(tickets).toEqual(dummyTickets);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/event/user/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTickets);
  });

  // Test for getTicketsByEventId
  it('should fetch tickets by event id', () => {
    const dummyTickets: Ticket[] = [
      { id: '1', ticket_type_id: 'type1', order_id: 'order1', quantity: 1, subtotal: 100 },
      { id: '2', ticket_type_id: 'type2', order_id: 'order2', quantity: 2, subtotal: 200 }
    ];

    service.getTicketsByEventId('1').subscribe(tickets => {
      expect(tickets.length).toBe(2);
      expect(tickets).toEqual(dummyTickets);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/event/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTickets);
  });

  // Test for getTicketsByOrderId
  it('should fetch tickets by order id', () => {
    const dummyTickets: Ticket[] = [
      { id: '1', ticket_type_id: 'type1', order_id: 'order1', quantity: 1, subtotal: 100 },
      { id: '2', ticket_type_id: 'type2', order_id: 'order2', quantity: 2, subtotal: 200 }
    ];

    service.getTicketsByOrderId('1').subscribe(tickets => {
      expect(tickets.length).toBe(2);
      expect(tickets).toEqual(dummyTickets);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/order/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTickets);
  });

  // Test for getTicketAnalytics
  it('should fetch ticket analytics', () => {
    const dummyAnalytics = { totalTicketsSold: 100, totalRevenue: 10000 };

    service.getTicketAnalytics().subscribe(analytics => {
      expect(analytics).toEqual(dummyAnalytics);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/analytics`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyAnalytics);
  });
});
