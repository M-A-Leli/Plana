import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import Admin from '../../shared/models/Admin';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  const mockAdmins: Admin[] = [
    { id: '1', user_id: '1', level: 1, is_deleted: false },
    { id: '2', user_id: '2', level: 2, is_deleted: false }
  ];

  const mockAdmin: Admin = { id: '1', user_id: '1', level: 1, is_deleted: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all admins', () => {
    service.getAllAdmins().subscribe(admins => {
      expect(admins.length).toBe(2);
      expect(admins).toEqual(mockAdmins);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdmins);
  });

  it('should retrieve an admin by ID', () => {
    service.getAdminById('1').subscribe(admin => {
      expect(admin).toEqual(mockAdmin);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdmin);
  });

  it('should create a new admin', () => {
    service.createAdmin(mockAdmin).subscribe(admin => {
      expect(admin).toEqual(mockAdmin);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(mockAdmin);
  });

  it('should update an admin', () => {
    service.updateAdmin('1', mockAdmin).subscribe(admin => {
      expect(admin).toEqual(mockAdmin);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockAdmin);
  });

  it('should delete an admin', () => {
    service.deleteAdmin('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should retrieve admin profile', () => {
    service.getAdminProfile().subscribe(admin => {
      expect(admin).toEqual(mockAdmin);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/profile`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdmin);
  });

  it('should update admin profile', () => {
    service.updateAdminProfile(mockAdmin).subscribe(admin => {
      expect(admin).toEqual(mockAdmin);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/profile`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockAdmin);
  });

  it('should retrieve active admins', () => {
    service.getActiveAdmins().subscribe(admins => {
      expect(admins.length).toBe(2);
      expect(admins).toEqual(mockAdmins);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/active`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdmins);
  });

  it('should retrieve suspended admins', () => {
    service.getSuspendedAdmins().subscribe(admins => {
      expect(admins.length).toBe(2);
      expect(admins).toEqual(mockAdmins);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/suspended`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdmins);
  });

  it('should retrieve deleted admins', () => {
    service.getDeletedAdmins().subscribe(admins => {
      expect(admins.length).toBe(2);
      expect(admins).toEqual(mockAdmins);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/deleted`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdmins);
  });

  it('should retrieve admin analytics', () => {
    const mockAnalytics = { total: 2, active: 1, suspended: 1 };

    service.getAdminAnalytics().subscribe(analytics => {
      expect(analytics).toEqual(mockAnalytics);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/analytics`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAnalytics);
  });
});
