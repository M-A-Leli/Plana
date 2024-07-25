import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event.service';
import IEvent from '../../shared/models/Event';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService]
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all events', () => {
    const mockEvents: IEvent[] = [
      { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' },
      { id: '2', organizer_id: '2', title: 'Event 2', description: 'Description 2', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 2' },
    ];

    service.getAllEvents().subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should retrieve an event by ID', () => {
    const mockEvent: IEvent = { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' };

    service.getEventById('1').subscribe(event => {
      expect(event).toEqual(mockEvent);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvent);
  });

  it('should create a new event', () => {
    const newEvent: FormData = new FormData();
    newEvent.append('title', 'Event 3');
    newEvent.append('description', 'Description 3');
    const mockEvent: IEvent = { id: '3', organizer_id: '3', title: 'Event 3', description: 'Description 3', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 3' };

    service.createEvent(newEvent).subscribe(event => {
      expect(event).toEqual(mockEvent);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(mockEvent);
  });

  it('should update an event', () => {
    const updatedEvent: IEvent = { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' };

    service.updateEvent('1', updatedEvent).subscribe(event => {
      expect(event).toEqual(updatedEvent);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedEvent);
  });

  it('should delete an event', () => {
    service.deleteEvent('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should retrieve featured events', () => {
    const mockEvents: IEvent[] = [
      { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' },
      { id: '2', organizer_id: '2', title: 'Event 2', description: 'Description 2', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 2' },
    ];

    service.getFeaturedEvents().subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/featured-events`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should feature an event', () => {
    const mockEvent: IEvent = { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' }

    service.featureEvent('1').subscribe(event => {
      expect(event).toEqual(mockEvent);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/feature/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockEvent);
  });

  it('should remove a featured event', () => {
    const mockEvent: IEvent = { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' }

    service.removeFeaturedEvent('1').subscribe(event => {
      expect(event).toEqual(mockEvent);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/feature/1/exclude`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockEvent);
  });

  it('should retrieve organizer\'s events', () => {
    const mockEvents: IEvent[] = [
      { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' },
      { id: '2', organizer_id: '2', title: 'Event 2', description: 'Description 2', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 2' },
    ];

    service.getOrganizersEvents().subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/organizer`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should retrieve organizer\'s upcoming events', () => {
    const mockEvents: IEvent[] = [
      { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' },
      { id: '2', organizer_id: '2', title: 'Event 2', description: 'Description 2', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 2' },
    ];

    service.getOrganizersUpcomingEvents().subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/organizer/upcoming`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should retrieve organizer\'s past events', () => {
    const mockEvents: IEvent[] = [
      { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' },
      { id: '2', organizer_id: '2', title: 'Event 2', description: 'Description 2', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 2' },
    ];

    service.getOrganizersPastEvents().subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/organizer/past`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should retrieve organizer\'s events analytics', () => {
    const mockAnalytics = { total: 10, upcoming: 5, past: 5 };

    service.getOrganizersEventsAnalytics().subscribe(analytics => {
      expect(analytics).toEqual(mockAnalytics);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/organizer/analytics`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAnalytics);
  });

  it('should retrieve events by organizer ID', () => {
    const mockEvents: IEvent[] = [
      { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' },
      { id: '2', organizer_id: '2', title: 'Event 2', description: 'Description 2', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 2' },
    ];

    service.getEventsByOrganizerId('1').subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/organizer/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should retrieve upcoming events by organizer ID', () => {
    const mockEvents: IEvent[] = [
      { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' },
      { id: '2', organizer_id: '2', title: 'Event 2', description: 'Description 2', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 2' },
    ];

    service.getUpcomingEventsByOrganizerId('1').subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/organizer/1/upcoming`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should retrieve past events by organizer ID', () => {
    const mockEvents: IEvent[] = [
      { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' },
      { id: '2', organizer_id: '2', title: 'Event 2', description: 'Description 2', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 2' },
    ];

    service.getPastEventsByOrganizerId('1').subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/organizer/1/past`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should retrieve related events', () => {
    const mockEvents: IEvent[] = [
      { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' },
      { id: '2', organizer_id: '2', title: 'Event 2', description: 'Description 2', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 2' },
    ];

    service.getRelatedEvents('1').subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/related-events/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should retrieve events by category ID', () => {
    const mockEvents: IEvent[] = [
      { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' },
      { id: '2', organizer_id: '2', title: 'Event 2', description: 'Description 2', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 2' },
    ];

    service.getEventsByCategoryId('1').subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/category/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should retrieve upcoming events', () => {
    const mockEvents: IEvent[] = [
      { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' },
      { id: '2', organizer_id: '2', title: 'Event 2', description: 'Description 2', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 2' },
    ];

    service.getUpcomingEvents().subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/upcoming`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should retrieve past events', () => {
    const mockEvents: IEvent[] = [
      { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' },
      { id: '2', organizer_id: '2', title: 'Event 2', description: 'Description 2', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 2' },
    ];

    service.getPastEvents().subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/past`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should retrieve deleted events', () => {
    const mockEvents: IEvent[] = [
      { id: '1', organizer_id: '1', title: 'Event 1', description: 'Description 1', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 1' },
      { id: '2', organizer_id: '2', title: 'Event 2', description: 'Description 2', date: new Date(), start_time: '13:15', end_time: '15:45', venue: 'Venue 2' },
    ];

    service.getDeletedEvents().subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/deleted`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should retrieve event analytics', () => {
    const mockAnalytics = { total: 10, upcoming: 5, past: 5 };

    service.getEventAnalytics().subscribe(analytics => {
      expect(analytics).toEqual(mockAnalytics);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/analytics`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAnalytics);
  });
});
