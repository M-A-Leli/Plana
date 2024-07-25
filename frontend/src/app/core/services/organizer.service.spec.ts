import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrganizerService } from './organizer.service';
import Organizer from '../../shared/models/Organizer';

describe('OrganizerService', () => {
  let service: OrganizerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrganizerService]
    });
    service = TestBed.inject(OrganizerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all organizers', () => {
    const mockOrganizers: Organizer[] = [
      { id: '1', user_id: 'user1', company: 'Company 1', bio: 'Bio 1', is_deleted: false, approved: true },
      { id: '2', user_id: 'user2', company: 'Company 2', bio: 'Bio 2', is_deleted: false, approved: true }
    ];

    service.getAllOrganizers().subscribe(organizers => {
      expect(organizers.length).toBe(2);
      expect(organizers).toEqual(mockOrganizers);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrganizers);
  });

  it('should retrieve organizer by ID', () => {
    const mockOrganizer: Organizer = { id: '1', user_id: 'user1', company: 'Company 1', bio: 'Bio 1', is_deleted: false, approved: true };

    service.getOrganizerById('1').subscribe(organizer => {
      expect(organizer).toEqual(mockOrganizer);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrganizer);
  });

  it('should create an organizer', () => {
    const newOrganizer: Partial<Organizer> = { user_id: 'user3', company: 'Company 3', bio: 'Bio 3', is_deleted: false, approved: false };

    service.createOrganizer(newOrganizer).subscribe(organizer => {
      expect(organizer).toEqual({ ...newOrganizer, id: '3' } as Organizer);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newOrganizer);
    req.flush({ ...newOrganizer, id: '3' } as Organizer);
  });

  it('should approve an organizer', () => {
    const updatedOrganizer: Organizer = { id: '1', user_id: 'user1', company: 'Company 1', bio: 'Bio 1', is_deleted: false, approved: true };

    service.approveOrganizer('1').subscribe(organizer => {
      expect(organizer).toEqual(updatedOrganizer);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/approve/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedOrganizer);
  });

  it('should revoke an organizer', () => {
    const updatedOrganizer: Organizer = { id: '1', user_id: 'user1', company: 'Company 1', bio: 'Bio 1', is_deleted: false, approved: false };

    service.revokeOrganizer('1').subscribe(organizer => {
      expect(organizer).toEqual(updatedOrganizer);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/revoke/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedOrganizer);
  });

  it('should update an organizer', () => {
    const updatedOrganizer: Organizer = { id: '1', user_id: 'user1', company: 'Updated Company', bio: 'Updated Bio', is_deleted: false, approved: true };

    service.updateOrganizer('1', updatedOrganizer).subscribe(organizer => {
      expect(organizer).toEqual(updatedOrganizer);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedOrganizer);
    req.flush(updatedOrganizer);
  });

  it('should delete an organizer', () => {
    service.deleteOrganizer().subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should retrieve organizer profile', () => {
    const mockOrganizer: Organizer = { id: '1', user_id: 'user1', company: 'Company 1', bio: 'Bio 1', is_deleted: false, approved: true };

    service.getOrganizerProfile().subscribe(organizer => {
      expect(organizer).toEqual(mockOrganizer);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/profile`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrganizer);
  });

  it('should update organizer profile', () => {
    const updatedOrganizer: Organizer = { id: '1', user_id: 'user1', company: 'Updated Company', bio: 'Updated Bio', is_deleted: false, approved: true };

    service.updateOrganizerProfile(updatedOrganizer).subscribe(organizer => {
      expect(organizer).toEqual(updatedOrganizer);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/profile`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedOrganizer);
    req.flush(updatedOrganizer);
  });

  it('should retrieve active organizers', () => {
    const mockOrganizers: Organizer[] = [
      { id: '1', user_id: 'user1', company: 'Company 1', bio: 'Bio 1', is_deleted: false, approved: true },
      { id: '2', user_id: 'user2', company: 'Company 2', bio: 'Bio 2', is_deleted: false, approved: true }
    ];

    service.getActiveOrganizers().subscribe(organizers => {
      expect(organizers.length).toBe(2);
      expect(organizers).toEqual(mockOrganizers);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/active`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrganizers);
  });

  it('should retrieve approved organizers', () => {
    const mockOrganizers: Organizer[] = [
      { id: '1', user_id: 'user1', company: 'Company 1', bio: 'Bio 1', is_deleted: false, approved: true },
      { id: '2', user_id: 'user2', company: 'Company 2', bio: 'Bio 2', is_deleted: false, approved: true }
    ];

    service.getApprovedOrganizers().subscribe(organizers => {
      expect(organizers.length).toBe(2);
      expect(organizers).toEqual(mockOrganizers);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/approved`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrganizers);
  });

  it('should retrieve deleted organizers', () => {
    const mockOrganizers: Organizer[] = [
      { id: '1', user_id: 'user1', company: 'Company 1', bio: 'Bio 1', is_deleted: true, approved: false },
      { id: '2', user_id: 'user2', company: 'Company 2', bio: 'Bio 2', is_deleted: true, approved: false }
    ];

    service.getDeletedOrganizers().subscribe(organizers => {
      expect(organizers.length).toBe(2);
      expect(organizers).toEqual(mockOrganizers);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/deleted`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrganizers);
  });

  it('should retrieve organizer analytics', () => {
    const mockAnalytics = { total: 10, approved: 5, revoked: 5 };

    service.getOrganizerAnalytics().subscribe(analytics => {
      expect(analytics).toEqual(mockAnalytics);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/analytics`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAnalytics);
  });
});
