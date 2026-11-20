import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthActionsComponent } from '../../core/components/auth-actions.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AuthActionsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
