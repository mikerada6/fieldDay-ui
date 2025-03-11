import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        // Get the user role from the token and route accordingly
        const role = this.authService.getUserRole();
        if (role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'GAME_RUNNER') {
          this.router.navigate(['/game-runner-dashboard']);
        } else if (role === 'TEAM_CAPTAIN') {
          this.router.navigate(['/team-captain-dashboard']);
        } else if (role === 'TEAM_CHAPERONE') {
          this.router.navigate(['/team-chaperone-dashboard']);
        } else {
          this.errorMessage = 'Invalid user role';
        }
      },
      error: () => {
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    });
  }
}