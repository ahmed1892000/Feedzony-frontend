import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthTokensResponse } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('registers, stores the session in memory, and revokes it on logout', () => {
    const response: AuthTokensResponse = {
      user: {
        id: 'user-id',
        email: 'ada@example.com',
        firstName: 'Ada',
        lastName: 'Lovelace',
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer',
      expiresIn: 900,
    };

    service
      .register({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        password: 'correct horse battery staple',
      })
      .subscribe();

    const registerRequest = httpTestingController.expectOne(
      'http://localhost:3000/api/v1/auth/register',
    );
    expect(registerRequest.request.method).toBe('POST');
    registerRequest.flush(response);

    expect(service.user()).toEqual(response.user);
    expect(service.getAccessToken()).toBe('access-token');

    service.logout().subscribe();
    const logoutRequest = httpTestingController.expectOne(
      'http://localhost:3000/api/v1/auth/logout',
    );
    expect(logoutRequest.request.body).toEqual({ refreshToken: 'refresh-token' });
    logoutRequest.flush({ message: 'Logged out' });

    expect(service.user()).toBeNull();
    expect(service.getAccessToken()).toBeNull();
  });
});
