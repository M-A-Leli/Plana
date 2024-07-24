import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import User from '../../shared/models/User';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all users', () => {
    const dummyUsers: User[] = [
      { id: '1', email: 'user1@example.com', username: 'user1' },
      { id: '2', email: 'user2@example.com', username: 'user2' }
    ];

    service.getAllUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should fetch a single user by id', () => {
    const dummyUser: User = { id: '1', email: 'user1@example.com', username: 'user1' };

    service.getUserById('1').subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should create a new user', () => {
    const newUser: Partial<User> = { email: 'newuser@example.com', username: 'newuser' };
    const createdUser: User = { id: '1', email: 'newuser@example.com', username: 'newuser' };

    service.createUser(newUser).subscribe(user => {
      expect(user).toEqual(createdUser);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(createdUser);
  });

  it('should update an existing user', () => {
    const updatedUser: User = { id: '1', email: 'updateduser@example.com', username: 'updateduser' };

    service.updateUser('1', updatedUser).subscribe(user => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedUser);
  });

  it('should delete a user', () => {
    service.deleteUser('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should fetch the user profile', () => {
    const dummyUser: User = { id: '1', email: 'user1@example.com', username: 'user1' };

    service.getUserProfile().subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/profile`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should update the user profile', () => {
    const updatedUser: User = { id: '1', email: 'updateduser@example.com', username: 'updateduser' };

    service.updateUserProfile(updatedUser).subscribe(user => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/profile`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedUser);
  });

  it('should fetch the user profile image', () => {
    const dummyUser: User = { id: '1', email: 'user1@example.com', username: 'user1' };

    service.getUserProfileImage().subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/profile-image`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should update the user profile image', () => {
    const formData: FormData = new FormData();
    formData.append('image', new Blob(), 'profile.jpg');

    const updatedUser: User = { id: '1', email: 'updateduser@example.com', username: 'updateduser' };

    service.updateUserProfileImage(formData).subscribe(user => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/profile-image`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedUser);
  });

  it('should fetch active users', () => {
    const dummyUsers: User[] = [
      { id: '1', email: 'user1@example.com', username: 'user1' },
      { id: '2', email: 'user2@example.com', username: 'user2' }
    ];

    service.getActiveUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/active`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should fetch suspended users', () => {
    const dummyUsers: User[] = [
      { id: '1', email: 'user1@example.com', username: 'user1' },
      { id: '2', email: 'user2@example.com', username: 'user2' }
    ];

    service.getSuspendedUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/suspended`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should fetch deleted users', () => {
    const dummyUsers: User[] = [
      { id: '1', email: 'user1@example.com', username: 'user1' },
      { id: '2', email: 'user2@example.com', username: 'user2' }
    ];

    service.getDeletedUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/deleted`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should suspend a user', () => {
    service.suspendUser('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/suspend/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should reinstate a user', () => {
    service.reinstateUser('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/reinstate/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should change the user password', () => {
    const passwords = { oldPassword: 'oldpass', newPassword: 'newpass' };

    service.changePassword(passwords).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/change-password`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should fetch user analytics', () => {
    const dummyAnalytics = { activeUsers: 10, suspendedUsers: 2 };

    service.getUserAnalytics().subscribe(analytics => {
      expect(analytics).toEqual(dummyAnalytics);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/analytics`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyAnalytics);
  });
});
