import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AttendeeService } from './attendee.service';
import Attendee from '../../shared/models/Attendee';

describe('AttendeeService', () => {
  let service: AttendeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AttendeeService]
    });
    service = TestBed.inject(AttendeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all attendees', () => {
    const mockAttendees: Attendee[] = [
      { id: '1', user_id: '1', bio: 'Bio 1', is_deleted: false },
      { id: '2', user_id: '2', bio: 'Bio 2', is_deleted: false }
    ];

    service.getAllAttendees().subscribe(attendees => {
      expect(attendees.length).toBe(2);
      expect(attendees).toEqual(mockAttendees);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAttendees);
  });

  it('should retrieve an attendee by ID', () => {
    const mockAttendee: Attendee = { id: '1', user_id: '1', bio: 'Bio 1', is_deleted: false };

    service.getAttendeeById('1').subscribe(attendee => {
      expect(attendee).toEqual(mockAttendee);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAttendee);
  });

  it('should create a new attendee', () => {
    const newAttendee: Partial<Attendee> = { user_id: '3', bio: 'Bio 3' };
    const mockAttendee: Attendee = { id: '3', ...newAttendee, is_deleted: false };

    service.createAttendee(newAttendee).subscribe(attendee => {
      expect(attendee).toEqual(mockAttendee);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockAttendee);
  });

  it('should update an attendee', () => {
    const updatedAttendee: Partial<Attendee> = { bio: 'Updated Bio' };
    const mockAttendee: Attendee = { id: '1', user_id: '1', bio: 'Updated Bio', is_deleted: false };

    service.updateAttendee('1', updatedAttendee).subscribe(attendee => {
      expect(attendee).toEqual(mockAttendee);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockAttendee);
  });

  it('should delete an attendee', () => {
    service.deleteAttendee().subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should retrieve attendee profile', () => {
    const mockAttendee: Attendee = { id: '1', user_id: '1', bio: 'Bio 1', is_deleted: false };

    service.getAttendeeProfile().subscribe(attendee => {
      expect(attendee).toEqual(mockAttendee);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/profile`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAttendee);
  });

  it('should update attendee profile', () => {
    const updatedProfile: Partial<Attendee> = { bio: 'Updated Bio' };
    const mockAttendee: Attendee = { id: '1', user_id: '1', bio: 'Updated Bio', is_deleted: false };

    service.updateAttendeeProfile(updatedProfile).subscribe(attendee => {
      expect(attendee).toEqual(mockAttendee);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/profile`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockAttendee);
  });

  it('should retrieve active attendees', () => {
    const mockAttendees: Attendee[] = [
      { id: '1', user_id: '1', bio: 'Bio 1', is_deleted: false },
      { id: '2', user_id: '2', bio: 'Bio 2', is_deleted: false }
    ];

    service.getActiveAttendees().subscribe(attendees => {
      expect(attendees.length).toBe(2);
      expect(attendees).toEqual(mockAttendees);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/active`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAttendees);
  });

  it('should retrieve suspended attendees', () => {
    const mockAttendees: Attendee[] = [
      { id: '1', user_id: '1', bio: 'Bio 1', is_deleted: true },
      { id: '2', user_id: '2', bio: 'Bio 2', is_deleted: true }
    ];

    service.getSuspendedAttendees().subscribe(attendees => {
      expect(attendees.length).toBe(2);
      expect(attendees).toEqual(mockAttendees);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/suspended`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAttendees);
  });

  it('should retrieve deleted attendees', () => {
    const mockAttendees: Attendee[] = [
      { id: '1', user_id: '1', bio: 'Bio 1', is_deleted: true },
      { id: '2', user_id: '2', bio: 'Bio 2', is_deleted: true }
    ];

    service.getDeletedAttendees().subscribe(attendees => {
      expect(attendees.length).toBe(2);
      expect(attendees).toEqual(mockAttendees);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/deleted`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAttendees);
  });

  it('should retrieve attendee analytics', () => {
    const mockAnalytics = { total: 10, active: 8, suspended: 1, deleted: 1 };

    service.getAttendeeAnalytics().subscribe(analytics => {
      expect(analytics).toEqual(mockAnalytics);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/analytics`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAnalytics);
  });
});
