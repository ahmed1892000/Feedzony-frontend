import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-actions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auth-actions.component.html',
  styleUrl: './auth-actions.component.css',
})
export class AuthActionsComponent {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.user;
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  logout(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.authService.logout().subscribe({
      next: () => this.isLoading.set(false),
      error: (error: unknown) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error instanceof HttpErrorResponse && error.status === 0
            ? 'Auth server unavailable.'
            : 'Could not log out. Please try again.',
        );
      },
    });
  }
}
