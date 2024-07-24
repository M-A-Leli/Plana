import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketTypesService } from './ticket-types.service';
import TicketType from '../../shared/models/TicketTypes';

describe('TicketTypesService', () => {
  let service: TicketTypesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketTypesService]
    });
    service = TestBed.inject(TicketTypesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test for getAllTicketTypes
  it('should fetch all ticket types', () => {
    const dummyTicketTypes: TicketType[] = [
      { id: '1', event_id: 'event1', name: 'VIP', price: 100, availability: 50, group_size: 2 },
      { id: '2', event_id: 'event2', name: 'Regular', price: 50, availability: 100 }
    ];

    service.getAllTicketTypes().subscribe(ticketTypes => {
      expect(ticketTypes.length).toBe(2);
      expect(ticketTypes).toEqual(dummyTicketTypes);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTicketTypes);
  });

  // Test for getTicketTypeById
  it('should fetch a single ticket type by id', () => {
    const dummyTicketType: TicketType = { id: '1', event_id: 'event1', name: 'VIP', price: 100, availability: 50, group_size: 2 };

    service.getTicketTypeById('1').subscribe(ticketType => {
      expect(ticketType).toEqual(dummyTicketType);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTicketType);
  });

  // Test for createTicketType
  it('should create a new ticket type', () => {
    const newTicketType: TicketType = { id: '1', event_id: 'event1', name: 'VIP', price: 100, availability: 50, group_size: 2 };

    service.createTicketType(newTicketType).subscribe(ticketType => {
      expect(ticketType).toEqual(newTicketType);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(newTicketType);
  });

  // Test for updateTicketType
  it('should update an existing ticket type', () => {
    const updatedTicketType: TicketType = { id: '1', event_id: 'event1', name: 'VIP', price: 120, availability: 40, group_size: 2 };

    service.updateTicketType('1', updatedTicketType).subscribe(ticketType => {
      expect(ticketType).toEqual(updatedTicketType);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTicketType);
  });

  // Test for deleteTicketType
  it('should delete a ticket type', () => {
    service.deleteTicketType('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // Test for getTicketTypesByEventId
  it('should fetch ticket types by event id', () => {
    const dummyTicketTypes: TicketType[] = [
      { id: '1', event_id: 'event1', name: 'VIP', price: 100, availability: 50, group_size: 2 },
      { id: '2', event_id: 'event1', name: 'Regular', price: 50, availability: 100 }
    ];

    service.getTicketTypesByEventId('event1').subscribe(ticketTypes => {
      expect(ticketTypes.length).toBe(2);
      expect(ticketTypes).toEqual(dummyTicketTypes);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/event/event1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTicketTypes);
  });
});
