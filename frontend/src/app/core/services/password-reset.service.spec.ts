import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PasswordResetService } from './password-reset.service';

describe('PasswordResetService', () => {
  let service: PasswordResetService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PasswordResetService]
    });
    service = TestBed.inject(PasswordResetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test for sendPasswordResetCode
  it('should send password reset code successfully', () => {
    const email = 'test@example.com';
    const dummyResponse = { message: 'Password reset code sent' };

    service.sendPasswordResetCode(email).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    req.flush(dummyResponse);
  });

  // Test for verifyPasswordResetCode
  it('should verify password reset code successfully', () => {
    const resetCode = '123456';
    const dummyResponse = { message: 'Reset code verified' };

    service.verifyPasswordResetCode(resetCode).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/verify`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ reset_code: resetCode });
    req.flush(dummyResponse);
  });

  // Test for resetPassword
  it('should reset password successfully', () => {
    const newPassword = 'newPassword123';
    const dummyResponse = { message: 'Password reset successfully' };

    service.resetPassword(newPassword).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/reset`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ password: newPassword });
    req.flush(dummyResponse);
  });
});
