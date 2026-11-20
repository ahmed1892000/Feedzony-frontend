import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly mode = signal<AuthMode>('login');
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly user = this.authService.user;

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
  });

  readonly registerForm = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.maxLength(100)],
    lastName: ['', Validators.maxLength(100)],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
  });

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const requestedMode = params.get('mode');
      if (requestedMode === 'login' || requestedMode === 'register') {
        this.mode.set(requestedMode);
      }
    });
  }

  selectMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.errorMessage.set('');
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => this.isLoading.set(false),
      error: (error: unknown) => this.handleError(error, 'Login failed. Please try again.'),
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => this.isLoading.set(false),
      error: (error: unknown) => this.handleError(error, 'Registration failed. Please try again.'),
    });
  }

  logout(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.authService.logout().subscribe({
      next: () => this.isLoading.set(false),
      error: (error: unknown) => this.handleError(error, 'Logout failed. Please try again.'),
    });
  }

  private handleError(error: unknown, fallback: string): void {
    this.isLoading.set(false);
    if (!(error instanceof HttpErrorResponse)) {
      this.errorMessage.set(fallback);
      return;
    }

    if (error.status === 0) {
      this.errorMessage.set('Unable to reach the authentication server. Check that it is running.');
    } else if (error.status === 401) {
      this.errorMessage.set('Email or password is incorrect.');
    } else if (error.status === 409) {
      this.errorMessage.set('An account with this email already exists.');
    } else {
      const serverMessage = error.error?.message;
      this.errorMessage.set(
        Array.isArray(serverMessage)
          ? serverMessage.join(' ')
          : typeof serverMessage === 'string'
            ? serverMessage
            : fallback,
      );
    }
  }
}
