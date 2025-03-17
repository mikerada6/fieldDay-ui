import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from './models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameRunnerDashboardService {
  private apiUrl = environment.apiUrl; // e.g. 'http://localhost:8080/api/v1'

  constructor(private http: HttpClient) {}

  // Although you can include this here, it’s best practice to eventually use an HTTP interceptor.
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDashboardData(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/games/runner-dashboard`, { headers: this.getHeaders() });
  }

  updateTeamScore(teamId: number, score: number | undefined): Observable<any> {
    const payload = { score };
    return this.http.put(`${this.apiUrl}/teams/${teamId}/score`, payload, { headers: this.getHeaders() });
  }

  submitScoreUpdate(gameId: number, payload: { gameId: number; teamId: number; scoreValue: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/games/${gameId}/scores`, payload, { headers: this.getHeaders() });
  }
}
