import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Game {
  id: number;
  name: string;
  type: 'points' | 'time';
  highScoreWins: boolean;
  location: string;
  equipment: string;
  numberOfTeamMembers: number;
  instructions: string;
  objective: string;
}


  interface Team {
    id: number;
    name: string;
    flagUrl: string;
    teamCaptain: string;
    teamChaperon: string;
    score?: number;
    editing?: boolean;
  }

interface ApiResponse {
  status: number;
  message: string;
  data: {
    game: {
      id: number;
      name: string;
      type: string;
      highScoreWins: boolean;
      gameRunnerId: number;
      location: string;
      equipment: string;
      numberOfTeamMembers: number;
      objective: string;
      instructions: string;
    };
    teams: Array<{
      teamId: number;
      teamName: string;
      score: number | null;
      flagSvgFilename: string;
      captainName: string;
      chaperoneName: string;
    }>;
  };
  timestamp: string;
}

@Component({
  selector: 'app-game-runner-dashboard',
  templateUrl: './game-runner-dashboard.component.html',
  styleUrls: ['./game-runner-dashboard.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule]
  
})
export class GameRunnerDashboardComponent implements OnInit {
  game: Game | undefined;;
  teams: Team[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  showInstructionsModal = false;
  selectedTeam: Team | null = null;
  editScoreModalOpen: boolean = false;
  editScoreValue: number | null = null;
  editMinutes: number | null = null;
  editSeconds: number | null = null;
  editMilliseconds: number | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadDashboardData(): void {
    this.errorMessage = ''; // Clear previous errors
    this.loading = true;
    this.http.get<ApiResponse>(
      'http://localhost:8080/api/v1/games/runner-dashboard',
      { headers: this.getHeaders() }
    ).subscribe({
      next: (response) => {
        this.game = {
          id: response.data.game.id,
          name: response.data.game.name,
          type: response.data.game.type.toLowerCase() as 'points' | 'time',
          highScoreWins: response.data.game.highScoreWins,
          location: response.data.game.location,
          equipment: response.data.game.equipment,
          numberOfTeamMembers: response.data.game.numberOfTeamMembers,
          instructions: response.data.game.instructions,
          objective: response.data.game.objective
        };
  
        // Teams mapping remains the same
        this.teams = response.data.teams.map(apiTeam => ({
          id: apiTeam.teamId,
          name: apiTeam.teamName,
          flagUrl: `/assets/flags/${apiTeam.flagSvgFilename}`,
          teamCaptain: apiTeam.captainName,
          teamChaperon: apiTeam.chaperoneName,
          score: apiTeam.score !== null ? apiTeam.score : undefined,
          editing: false
        }));


        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.message || 'Failed to load dashboard data.';
        this.loading = false;  
      }
    });
  }

  toggleEditing(team: Team): void {
    team.editing = !team.editing;
  }

  updateScore(team: Team): void {
    const payload = { score: team.score };
    this.http.put(`/api/teams/${team.id}/score`, payload)
      .subscribe({
        next: () => {
          team.editing = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = `Failed to update score for ${team.name}.`;
        }
      });
  }

  toggleInstructionsModal(): void {
    this.showInstructionsModal = !this.showInstructionsModal;
  }

  openEditScore(team: Team): void {
    this.selectedTeam = team;
    this.editScoreModalOpen = true;
    if (this.game?.type === 'points') {
      this.editScoreValue = team.score || 0;
    } else if (this.game?.type === 'time') {
      const totalMs = team.score || 0;
      this.editMinutes = Math.floor(totalMs / 60000);
      this.editSeconds = Math.floor((totalMs % 60000) / 1000);
      this.editMilliseconds = totalMs % 1000;
    }
  }

  closeEditScore(): void {
    this.selectedTeam = null;
    this.editScoreModalOpen = false;
    this.editScoreValue = null;
    this.editMinutes = null;
    this.editSeconds = null;
    this.editMilliseconds = null;
  }

  submitScoreUpdate(): void {
    // Ensure both team and game are defined
    if (!this.selectedTeam || !this.game) {
      this.errorMessage = 'Missing team or game data.';
      return;
    }
  
    // Error out if game.id is null or undefined
    if (this.game.id == null) {
      this.errorMessage = 'Game ID is missing. Cannot update score.';
      return;
    }
  
  
    let newScore: number;
    if (this.game.type === 'points') {
      newScore = this.editScoreValue ?? 0;
    } else if (this.game.type === 'time') {
      const minutes = this.editMinutes ?? 0;
      const seconds = this.editSeconds ?? 0;
      const milliseconds = this.editMilliseconds ?? 0;
      newScore = minutes * 60000 + seconds * 1000 + milliseconds;
    } else {
      newScore = 0;
    }
  
    const payload = {
      gameId: this.game.id,
      teamId: this.selectedTeam.id,
      scoreValue: newScore
    };
  
    this.http.post(
      `http://localhost:8080/api/v1/games/${this.game.id}/scores`,
      payload,
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        // Use non-null assertion to tell TypeScript that selectedTeam is not null here
        this.selectedTeam!.score = newScore;
        this.closeEditScore();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = `Failed to update score for ${this.selectedTeam?.name}.`;
      }
    });
  }
  
  
  

  formatTime(score: number | undefined): string {
    if (score === undefined || score === null) return '00:00.000';
    const minutes = Math.floor(score / 60000);
    const seconds = Math.floor((score % 60000) / 1000);
    const milliseconds = score % 1000;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }
  
}