import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {TeamCaptainApiResponseModel} from '../models/team-captain-api-response.model';


@Injectable({
  providedIn: 'root'
})
export class TeamCaptainDashboardService {
  private apiUrl = environment.apiUrl; // e.g. 'http://localhost:8080/api/v1'

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDashboardData(): Observable<TeamCaptainApiResponseModel> {
    return this.http.get<TeamCaptainApiResponseModel>(`${this.apiUrl}/teams/team-captain-dashboard`, { headers: this.getHeaders() });
  }
}
