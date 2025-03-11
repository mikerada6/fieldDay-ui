import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<any>(url, { username, password }).pipe(
      tap(response => {
        if(response && response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Decode the JWT token to extract the payload
  getUserPayload(): any {
    const token = this.getToken();
    if(token) {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    }
    return null;
  }

  getUserRole(): string | null {
    const payload = this.getUserPayload();
    if(payload && payload.roles && payload.roles.length > 0) {
      // For simplicity, assume one role per user.
      return payload.roles[0];
    }
    return null;
  }
}
